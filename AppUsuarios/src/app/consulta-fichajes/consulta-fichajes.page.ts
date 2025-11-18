import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardContent, IonItem, IonLabel, IonList, IonDatetime, IonButton, IonButtons, IonIcon
} from '@ionic/angular/standalone';
import { ApiService } from '../services/api';
import { GeocodingService } from '../services/geocoding';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-consulta-fichajes',
  templateUrl: 'consulta-fichajes.page.html',
  styleUrls: ['consulta-fichajes.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonCard, IonCardContent, IonItem, IonLabel, IonList, IonDatetime, IonButton, IonButtons, IonIcon
  ],
})
export class ConsultaFichajesPage implements OnInit {
  fechaDesde: string = '';
  fechaHasta: string = '';
  fichajes: any[] = [];
  userId: number = 0;

  constructor(
    private apiService: ApiService,
    private geocodingService: GeocodingService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    console.log('Usuario actual en consulta-fichajes:', currentUser);
    if (currentUser) {
      this.userId = currentUser.IdUsuario;
      console.log('userId asignado:', this.userId);
    }
    // Cargar fichajes del día actual al iniciar
    this.cargarFichajesDelDia();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  cargarFichajesDelDia() {
    const hoy = new Date();
    const inicioDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 0, 0, 0);
    const finDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 23, 59, 59);

    this.fechaDesde = inicioDia.toISOString();
    this.fechaHasta = finDia.toISOString();

    this.filtrarFichajes();
  }

  filtrarFichajes() {
    if (!this.fechaDesde || !this.fechaHasta) {
      alert('Selecciona ambas fechas');
      return;
    }

    const params = {
      usuario: this.userId,
      desde: new Date(this.fechaDesde).toISOString().split('T')[0],
      hasta: new Date(this.fechaHasta).toISOString().split('T')[0]
    };

    console.log('Params enviados a API:', params);

    this.apiService.getFichajes(params).subscribe({
      next: (fichajes) => {
        this.fichajes = fichajes;
        // Cargar direcciones para cada fichaje
        this.fichajes.forEach((fichaje, index )=> this.cargarDireccion(fichaje, index));
      },
      error: (err) => {
        console.error('Error al cargar fichajes:', err);
        alert('Error al cargar fichajes');
      }
    });
  }

  cargarDireccion(fichaje: any, index: number): void {
    if (!fichaje.direccion) {
      fichaje.direccion = 'Cargando...';

      // Delay para evitar rate limiting de la API
      setTimeout(() => {
        this.geocodingService.getAddress(
          fichaje.GeolocalizacionLatitud,
          fichaje.GeolocalizacionLongitud
        ).subscribe({
          next: (direccion) => {
            fichaje.direccion = direccion;
            console.log('Dirección cargada:', direccion);
          },
          error: (err) => {
            console.error('Error al cargar dirección:', err);
            fichaje.direccion = `${fichaje.GeolocalizacionLatitud}, ${fichaje.GeolocalizacionLongitud}`;
          }
        });
      }, index * 500); // 500ms de delay entre cada petición
    }
  }
}