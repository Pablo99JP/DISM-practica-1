import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonButton, IonSelect, IonSelectOption, IonItem, IonLabel, IonIcon, IonButtons
} from '@ionic/angular/standalone';
import { Geolocation } from '@capacitor/geolocation';
import { ApiService } from '../services/api';
import { GeocodingService } from '../services/geocoding';
import { AuthService } from '../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrar-fichaje',
  templateUrl: 'registrar-fichaje.page.html',
  styleUrls: ['registrar-fichaje.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButton, IonSelect, IonSelectOption, IonItem, IonLabel, IonIcon, IonButtons
  ],
})



export class RegistrarFichajePage implements OnInit {
  trabajos: any[] = [];
  trabajoSeleccionado: number | null = null;

  tieneFichajeAbierto: boolean = false;
  fichajeAbierto: any = null;
  nombreTrabajoActivo: string = '';
  direccionFichaje: string = 'Cargando ubicación...';

  userId: number = 0;

  constructor(
    private apiService: ApiService,
    private geocodingService: GeocodingService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.userId = currentUser.IdUsuario;
    }
    this.cargarTrabajos();
    this.verificarFichajeAbierto();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
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
        FechaHoraEntrada: new Date().toISOString(),
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
      FechaHoraSalida: ahora.toISOString(),
      HorasTrabajadas: parseFloat(horasTrabajadas.toFixed(2))
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