/**
 * COMPONENTE DE REGISTRO DE FICHAJES - APLICACIÓN TRABAJADORES
 * ==============================================================
 * Este componente permite a los trabajadores:
 * - Fichar entrada seleccionando un trabajo
 * - Fichar salida del trabajo activo
 * - Capturar automáticamente la ubicación GPS (geolocalización)
 * - Calcular horas trabajadas
 * 
 * Tecnologías clave:
 * - Capacitor Geolocation: Acceso a GPS del dispositivo
 * - Geocoding: Convertir coordenadas GPS en direcciones legibles
 * - LocalStorage: Mantener sesión del usuario
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonButton, IonSelect, IonSelectOption, IonItem, IonLabel, IonIcon, IonButtons
} from '@ionic/angular/standalone';
import { Geolocation } from '@capacitor/geolocation';  // Plugin de Capacitor para GPS
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
  // ==========================================
  // PROPIEDADES DEL COMPONENTE
  // ==========================================
  
  trabajos: any[] = [];                    // Lista de trabajos disponibles
  trabajoSeleccionado: number | null = null;  // ID del trabajo seleccionado para fichar

  // Estado del fichaje activo
  tieneFichajeAbierto: boolean = false;    // ¿Tiene un fichaje sin cerrar?
  fichajeAbierto: any = null;              // Datos del fichaje abierto
  nombreTrabajoActivo: string = '';        // Nombre del trabajo activo
  direccionFichaje: string = 'Cargando ubicación...';  // Dirección obtenida por geocoding

  userId: number = 0;  // ID del usuario autenticado

  constructor(
    private apiService: ApiService,
    private geocodingService: GeocodingService,
    private authService: AuthService,
    private router: Router
  ) { }

  /**
   * Inicialización del componente
   * - Obtiene usuario actual de la sesión
   * - Carga lista de trabajos disponibles
   * - Verifica si hay un fichaje abierto
   */
  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.userId = currentUser.IdUsuario;
    }
    this.cargarTrabajos();
    this.verificarFichajeAbierto();
  }

  // ==========================================
  // MÉTODOS AUXILIARES
  // ==========================================
  
  /**
   * Cerrar sesión del usuario
   */
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  /**
   * Cargar lista de trabajos disponibles desde la API
   */
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

  /**
   * Verificar si el usuario tiene un fichaje abierto (sin cerrar)
   * 
   * Lógica:
   * 1. Obtiene todos los fichajes del usuario
   * 2. Filtra los que no tienen fecha de salida
   * 3. Solo considera fichajes de las últimas 12 horas (prevenir fichajes antiguos olvidados)
   * 4. Si encuentra uno, lo marca como activo y obtiene su dirección
   */
  verificarFichajeAbierto() {
    const ahora = new Date();

    this.apiService.getFichajes({ usuario: this.userId }).subscribe({
      next: (fichajes) => {
        // Buscar fichajes de las últimas 12 horas sin cerrar
        const fichajesRecientes = fichajes.filter(f => {
          const fechaEntrada = new Date(f.FechaHoraEntrada);
          
          // Calcular horas transcurridas desde la entrada
          // getTime() retorna milisegundos, dividir para convertir a horas
          const horasTranscurridas = (ahora.getTime() - fechaEntrada.getTime()) / (1000 * 60 * 60);

          // Si tiene fecha de salida, está cerrado
          if (f.FechaHoraSalida) return false;

          // Si tiene menos de 12 horas, está abierto
          return horasTranscurridas < 12;
        });

        if (fichajesRecientes.length > 0) {
          // Hay fichaje abierto
          this.tieneFichajeAbierto = true;
          this.fichajeAbierto = fichajesRecientes[0];

          // Buscar el nombre del trabajo asociado
          const trabajo = this.trabajos.find(t => t.IdTrabajo === this.fichajeAbierto.IdTrabajo);
          this.nombreTrabajoActivo = trabajo ? trabajo.Nombre : 'Desconocido';

          // Obtener dirección legible de las coordenadas GPS
          // Reverse geocoding: coordenadas → dirección
          this.geocodingService.getAddress(
            this.fichajeAbierto.GeolocalizacionLatitud,
            this.fichajeAbierto.GeolocalizacionLongitud
          ).subscribe({
            next: (direccion) => {
              this.direccionFichaje = direccion;
            },
            error: () => {
              // Si falla geocoding, mostrar coordenadas
              this.direccionFichaje = `${this.fichajeAbierto.GeolocalizacionLatitud}, ${this.fichajeAbierto.GeolocalizacionLongitud}`;
            }
          });
        } else {
          // No hay fichaje abierto
          this.tieneFichajeAbierto = false;
          this.fichajeAbierto = null;
        }
      },
      error: (err) => {
        console.error('Error al verificar fichajes:', err);
      }
    });
  }

  // ==========================================
  // MÉTODOS PRINCIPALES: FICHAR ENTRADA Y SALIDA
  // ==========================================
  
  /**
   * Iniciar fichaje (registrar entrada)
   * 
   * Proceso:
   * 1. Validar que se haya seleccionado un trabajo
   * 2. Obtener ubicación GPS del dispositivo (Capacitor Geolocation)
   * 3. Crear fichaje con fecha actual y coordenadas
   * 4. Enviar al backend
   * 
   * Nota: async/await para trabajar con Promises de forma más legible
   */
  async iniciarFichaje() {
    if (!this.trabajoSeleccionado) {
      alert('Por favor selecciona un trabajo');
      return;
    }

    try {
      // Obtener posición actual del GPS
      // Esto puede pedir permisos de ubicación al usuario
      const position = await Geolocation.getCurrentPosition();

      // Preparar objeto de fichaje
      const nuevoFichaje = {
        FechaHoraEntrada: new Date().toISOString(),  // Formato ISO: 2025-12-01T18:30:00.000Z
        IdTrabajo: this.trabajoSeleccionado,
        IdUsuario: this.userId,
        GeolocalizacionLatitud: position.coords.latitude,   // Latitud GPS
        GeolocalizacionLongitud: position.coords.longitude  // Longitud GPS
      };

      // Enviar fichaje a la API
      this.apiService.createFichaje(nuevoFichaje).subscribe({
        next: (fichaje) => {
          console.log('Fichaje iniciado:', fichaje);
          this.verificarFichajeAbierto();  // Actualizar UI
        },
        error: (err) => {
          console.error('Error al iniciar fichaje:', err);
          alert('Error al iniciar fichaje');
        }
      });
    } catch (error) {
      // Error al obtener GPS (sin permisos, GPS desactivado, etc.)
      console.error('Error al obtener geolocalización:', error);
      alert('Error al obtener ubicación. Verifica los permisos.');
    }
  }

  /**
   * Cerrar fichaje (registrar salida)
   * 
   * Proceso:
   * 1. Obtener fichaje activo
   * 2. Calcular horas trabajadas (diferencia entre entrada y salida)
   * 3. Actualizar fichaje con fecha de salida y horas
   * 4. Enviar actualización al backend
   */
  cerrarFichaje() {
    if (!this.fichajeAbierto) return;

    const ahora = new Date();
    const fechaEntrada = new Date(this.fichajeAbierto.FechaHoraEntrada);

    // Calcular horas trabajadas
    // getTime() retorna milisegundos, convertir a horas:
    // 1000 ms * 60 seg * 60 min = 1 hora
    const horasTrabajadas = (ahora.getTime() - fechaEntrada.getTime()) / (1000 * 60 * 60);

    // Preparar actualización del fichaje
    const fichajeActualizado = {
      FechaHoraSalida: ahora.toISOString(),
      HorasTrabajadas: parseFloat(horasTrabajadas.toFixed(2))  // Redondear a 2 decimales
    };

    // Enviar actualización a la API
    this.apiService.updateFichaje(this.fichajeAbierto.IdFichaje, fichajeActualizado).subscribe({
      next: (fichaje) => {
        console.log('Fichaje cerrado:', fichaje);
        
        // Limpiar estado local
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