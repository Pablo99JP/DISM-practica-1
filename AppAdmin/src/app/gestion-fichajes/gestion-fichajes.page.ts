import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem,
  IonLabel, IonButton, IonSearchbar, IonCard, IonCardContent,
  IonDatetime, IonModal, IonButtons
} from '@ionic/angular/standalone';
import { ApiService } from '../services/api';
import * as L from 'leaflet';

@Component({
  selector: 'app-gestion-fichajes',
  templateUrl: 'gestion-fichajes.page.html',
  styleUrls: ['gestion-fichajes.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem,
    IonLabel, IonButton, IonSearchbar, IonCard, IonCardContent,
    IonDatetime, IonModal, IonButtons
  ],
})
export class GestionFichajesPage implements OnInit {
  fichajes: any[] = [];
  fichajesFiltrados: any[] = [];
  searchTerm: string = '';
  fechaDesde: string = '';
  fechaHasta: string = '';

  isMapModalOpen = false;
  map: any;
  fichajeSeleccionado: any = null;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.cargarFichajes();
  }

  cargarFichajes() {
    this.apiService.getFichajes().subscribe({
      next: (fichajes) => {
        this.fichajes = fichajes;
        this.fichajesFiltrados = fichajes;
      },
      error: (err) => {
        console.error('Error al cargar fichajes:', err);
      }
    });
  }

  filtrarPorFechas() {
    if (!this.fechaDesde || !this.fechaHasta) {
      alert('Selecciona ambas fechas');
      return;
    }

    const params = {
      desde: new Date(this.fechaDesde).toISOString().slice(0, 19).replace('T', ' '),
      hasta: new Date(this.fechaHasta).toISOString().slice(0, 19).replace('T', ' ')
    };

    this.apiService.getFichajes(params).subscribe({
      next: (fichajes) => {
        this.fichajes = fichajes;
        this.filtrarPorBusqueda();
      },
      error: (err) => {
        console.error('Error al filtrar fichajes:', err);
      }
    });
  }

  filtrarPorBusqueda() {
    if (!this.searchTerm) {
      this.fichajesFiltrados = this.fichajes;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.fichajesFiltrados = this.fichajes.filter(f =>
      (f.NombreTrabajo && f.NombreTrabajo.toLowerCase().includes(term)) ||
      (f.IdUsuario && f.IdUsuario.toString().includes(term))
    );
  }

  mostrarMapa(fichaje: any) {
    this.fichajeSeleccionado = fichaje;
    this.isMapModalOpen = true;

    setTimeout(() => {
      this.initMap();
    }, 300);
  }

  initMap() {
    if (this.map) {
      this.map.remove();
    }

    const lat = this.fichajeSeleccionado.GeolocalizacionLatitud;
    const lon = this.fichajeSeleccionado.GeolocalizacionLongitud;

    this.map = L.map('map').setView([lat, lon], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    L.marker([lat, lon]).addTo(this.map)
      .bindPopup(`<b>${this.fichajeSeleccionado.NombreTrabajo}</b><br>Fichaje realizado aquí`)
      .openPopup();
  }

  cerrarMapa() {
    this.isMapModalOpen = false;
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }
}