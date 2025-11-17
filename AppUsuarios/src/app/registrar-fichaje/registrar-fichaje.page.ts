import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonButton, IonSelect, IonSelectOption, IonItem, IonLabel
} from '@ionic/angular/standalone';
import { Geolocation } from '@capacitor/geolocation';
import { ApiService } from '../services/api';
import { GeocodingService } from '../services/geocoding';

@Component({
  selector: 'app-registrar-fichaje',
  templateUrl: 'registrar-fichaje.page.html',
  styleUrls: ['registrar-fichaje.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButton, IonSelect, IonSelectOption, IonItem, IonLabel
  ],
})



export class RegistrarFichajePage implements OnInit {
  trabajos: any[] = [];
  trabajoSeleccionado: number | null = null;

  tieneFichajeAbierto: boolean = false;
  fichajeAbierto: any = null;
  nombreTrabajoActivo: string = '';
  direccionFichaje: string = 'Cargando ubicación...';

  userId: number = 1; // Usuario hardcoded por ahora (sin login)

  // Función para convertir Date a formato MySQL con hora local
  private dateToMySQLFormat(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  constructor(
    private apiService: ApiService,
    private geocodingService: GeocodingService
  ) { }

  ngOnInit() {
    this.cargarTrabajos();
    this.verificarFichajeAbierto();
  }

  cargarTrabajos() {
    this.apiService.getTrabajos().subscribe({
      next: (trabajos) => {
        this.trabajos = trabajos;
      },
      error: (err) => {
        console.error('Error al cargar trabajos:', err);
      }
    });
  }

  verificarFichajeAbierto() {
    const ahora = new Date();

    this.apiService.getFichajes({ usuario: this.userId }).subscribe({
      next: (fichajes) => {
        // Buscar fichajes de las últimas 12 horas sin cerrar
        const fichajesRecientes = fichajes.filter(f => {
          const fechaEntrada = new Date(f.FechaHoraEntrada);
          const horasTranscurridas = (ahora.getTime() - fechaEntrada.getTime()) / (1000 * 60 * 60);

          // Si tiene fecha de salida, está cerrado
          if (f.FechaHoraSalida) return false;

          // Si tiene menos de 12 horas, está abierto
          return horasTranscurridas < 12;
        });

        if (fichajesRecientes.length > 0) {
          this.tieneFichajeAbierto = true;
          this.fichajeAbierto = fichajesRecientes[0];

          // Buscar el nombre del trabajo
          const trabajo = this.trabajos.find(t => t.IdTrabajo === this.fichajeAbierto.IdTrabajo);
          this.nombreTrabajoActivo = trabajo ? trabajo.Nombre : 'Desconocido';

          // Obtener dirección de las coordenadas
          this.geocodingService.getAddress(
            this.fichajeAbierto.GeolocalizacionLatitud,
            this.fichajeAbierto.GeolocalizacionLongitud
          ).subscribe({
            next: (direccion) => {
              this.direccionFichaje = direccion;
            },
            error: () => {
              this.direccionFichaje = `${this.fichajeAbierto.GeolocalizacionLatitud}, ${this.fichajeAbierto.GeolocalizacionLongitud}`;
            }
          });
        } else {
          this.tieneFichajeAbierto = false;
          this.fichajeAbierto = null;
        }
      },
      error: (err) => {
        console.error('Error al verificar fichajes:', err);
      }
    });
  }

  async iniciarFichaje() {
    if (!this.trabajoSeleccionado) {
      alert('Por favor selecciona un trabajo');
      return;
    }

    try {
      // Obtener geolocalización
      const position = await Geolocation.getCurrentPosition();

      const nuevoFichaje = {
        FechaHoraEntrada: this.dateToMySQLFormat(new Date()),
        IdTrabajo: this.trabajoSeleccionado,
        IdUsuario: this.userId,
        GeolocalizacionLatitud: position.coords.latitude,
        GeolocalizacionLongitud: position.coords.longitude
      };

      this.apiService.createFichaje(nuevoFichaje).subscribe({
        next: (fichaje) => {
          console.log('Fichaje iniciado:', fichaje);
          this.verificarFichajeAbierto();
        },
        error: (err) => {
          console.error('Error al iniciar fichaje:', err);
          alert('Error al iniciar fichaje');
        }
      });
    } catch (error) {
      console.error('Error al obtener geolocalización:', error);
      alert('Error al obtener ubicación. Verifica los permisos.');
    }
  }

  cerrarFichaje() {
    if (!this.fichajeAbierto) return;

    const ahora = new Date();
    const fechaEntrada = new Date(this.fichajeAbierto.FechaHoraEntrada);

    // Calcular horas trabajadas
    const horasTrabajadas = (ahora.getTime() - fechaEntrada.getTime()) / (1000 * 60 * 60);

    const fichajeActualizado = {
      FechaHoraEntrada: this.fichajeAbierto.FechaHoraEntrada, // Mantener la original SIN modificar
      FechaHoraSalida: this.dateToMySQLFormat(ahora),
      HorasTrabajadas: parseFloat(horasTrabajadas.toFixed(2)),
      IdTrabajo: this.fichajeAbierto.IdTrabajo,
      IdUsuario: this.fichajeAbierto.IdUsuario,
      GeolocalizacionLatitud: this.fichajeAbierto.GeolocalizacionLatitud,
      GeolocalizacionLongitud: this.fichajeAbierto.GeolocalizacionLongitud
    };

    this.apiService.updateFichaje(this.fichajeAbierto.IdFichaje, fichajeActualizado).subscribe({
      next: (fichaje) => {
        console.log('Fichaje cerrado:', fichaje);
        this.tieneFichajeAbierto = false;
        this.fichajeAbierto = null;
      },
      error: (err) => {
        console.error('Error al cerrar fichaje:', err);
        alert('Error al cerrar fichaje');
      }
    });
  }
}