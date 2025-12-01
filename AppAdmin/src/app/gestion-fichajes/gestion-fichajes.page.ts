/**
 * COMPONENTE DE GESTIÓN DE FICHAJES - APLICACIÓN ADMINISTRADOR
 * =============================================================
 * Este componente permite a los administradores:
 * - Ver todos los fichajes de los trabajadores
 * - Filtrar fichajes por fechas
 * - Buscar fichajes por trabajo o usuario
 * - Ver la ubicación GPS de cada fichaje en un mapa
 * 
 * Tecnologías utilizadas:
 * - Angular (framework frontend)
 * - Ionic (componentes UI multiplataforma)
 * - Leaflet (librería de mapas open source)
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem,
  IonLabel, IonButton, IonSearchbar, IonCard, IonCardContent,
  IonDatetime, IonModal, IonButtons
} from '@ionic/angular/standalone';
import { ApiService } from '../services/api';
import * as L from 'leaflet';  // Leaflet para mapas interactivos

@Component({
  selector: 'app-gestion-fichajes',
  templateUrl: 'gestion-fichajes.page.html',
  styleUrls: ['gestion-fichajes.page.scss'],
  standalone: true,  // Componente standalone (Angular 15+)
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem,
    IonLabel, IonButton, IonSearchbar, IonCard, IonCardContent,
    IonDatetime, IonModal, IonButtons
  ],
})
export class GestionFichajesPage implements OnInit {
  // ==========================================
  // PROPIEDADES DEL COMPONENTE
  // ==========================================
  
  fichajes: any[] = [];              // Todos los fichajes desde la API
  fichajesFiltrados: any[] = [];     // Fichajes después de aplicar filtros
  searchTerm: string = '';           // Término de búsqueda en tiempo real
  fechaDesde: string = '';           // Filtro: fecha inicial
  fechaHasta: string = '';           // Filtro: fecha final

  // Propiedades para el modal del mapa
  isMapModalOpen = false;            // Controla visibilidad del modal
  map: any;                          // Instancia del mapa Leaflet
  fichajeSeleccionado: any = null;   // Fichaje actualmente mostrado en mapa

  /**
   * Constructor con inyección de dependencias
   * @param apiService - Servicio para comunicación con backend
   */
  constructor(private apiService: ApiService) { }

  /**
   * Lifecycle hook: Se ejecuta cuando el componente se inicializa
   * Carga los fichajes al entrar en la página
   */
  ngOnInit() {
    this.cargarFichajes();
  }

  // ==========================================
  // MÉTODOS DE CARGA Y FILTRADO DE DATOS
  // ==========================================
  
  /**
   * Cargar todos los fichajes desde la API
   * 
   * Observable.subscribe() recibe un objeto con:
   * - next: Función que se ejecuta cuando llegan los datos
   * - error: Función que se ejecuta si hay error
   * - complete: (opcional) Se ejecuta cuando termina el Observable
   */
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

  /**
   * Filtrar fichajes por rango de fechas
   * Envía parámetros al backend para filtrar en el servidor
   */
  filtrarPorFechas() {
    // Validar que ambas fechas estén seleccionadas
    if (!this.fechaDesde || !this.fechaHasta) {
      alert('Selecciona ambas fechas');
      return;
    }

    // Convertir fechas a formato YYYY-MM-DD
    // toISOString() retorna formato ISO 8601: 2025-12-01T00:00:00.000Z
    // slice(0, 10) extrae solo: 2025-12-01
    const params = {
      desde: new Date(this.fechaDesde).toISOString().slice(0, 10),
      hasta: new Date(this.fechaHasta).toISOString().slice(0, 10)
    };

    // Llamar a la API con los parámetros de filtro
    this.apiService.getFichajes(params).subscribe({
      next: (fichajes) => {
        this.fichajes = fichajes;
        this.filtrarPorBusqueda();  // Aplicar también el filtro de búsqueda
      },
      error: (err) => {
        console.error('Error al filtrar fichajes:', err);
      }
    });
  }

  /**
   * Filtrar fichajes localmente por término de búsqueda
   * Este filtro funciona sobre los datos ya cargados (frontend)
   */
  filtrarPorBusqueda() {
    if (!this.searchTerm) {
      this.fichajesFiltrados = this.fichajes;
      return;
    }

    // Convertir término a minúsculas para búsqueda case-insensitive
    const term = this.searchTerm.toLowerCase();
    
    // Array.filter() retorna nuevo array con elementos que cumplen la condición
    this.fichajesFiltrados = this.fichajes.filter(f =>
      (f.NombreTrabajo && f.NombreTrabajo.toLowerCase().includes(term)) ||
      (f.IdUsuario && f.IdUsuario.toString().includes(term))
    );
  }

  // ==========================================
  // MÉTODOS PARA VISUALIZACIÓN DE MAPAS
  // ==========================================
  
  /**
   * Mostrar mapa con la ubicación del fichaje seleccionado
   * @param fichaje - Fichaje que contiene coordenadas GPS
   * 
   * setTimeout es necesario porque:
   * - El modal tarda en renderizarse en el DOM
   * - Leaflet necesita que el contenedor exista antes de inicializar
   */
  mostrarMapa(fichaje: any) {
    this.fichajeSeleccionado = fichaje;
    this.isMapModalOpen = true;

    // Esperar 300ms a que el modal se renderice
    setTimeout(() => {
      this.initMap();
    }, 300);
  }

  /**
   * Inicializar mapa de Leaflet con marcador
   * 
   * Leaflet es una alternativa open source a Google Maps
   * - Más ligero y sin necesidad de API key
   * - Usa tiles de OpenStreetMap
   */
  initMap() {
    // Limpiar mapa anterior si existe (prevenir duplicados)
    if (this.map) {
      this.map.remove();
    }

    // Extraer coordenadas del fichaje
    const lat = this.fichajeSeleccionado.GeolocalizacionLatitud;
    const lon = this.fichajeSeleccionado.GeolocalizacionLongitud;

    // Crear mapa centrado en las coordenadas
    // setView([lat, lon], zoom): zoom 15 es bueno para ver calles
    this.map = L.map('map').setView([lat, lon], 15);

    // Añadir capa de tiles de OpenStreetMap
    // {s} = subdominios (a, b, c) para distribuir carga
    // {z}/{x}/{y} = zoom/coordenadas del tile
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Configurar icono personalizado para el marcador
    // Por defecto, Leaflet no carga los iconos correctamente en algunos entornos
    const defaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],          // Tamaño del icono
      iconAnchor: [12, 41],         // Punto del icono que se ancla a la posición
      popupAnchor: [1, -34],        // Desde dónde aparece el popup
      shadowSize: [41, 41]          // Tamaño de la sombra
    });

    // Añadir marcador en la posición del fichaje
    L.marker([lat, lon], { icon: defaultIcon }).addTo(this.map)
      .bindPopup(`<b>${this.fichajeSeleccionado.NombreTrabajo}</b><br>Fichaje realizado aquí`)
      .openPopup();  // Abrir popup automáticamente
  }

  /**
   * Cerrar modal del mapa y limpiar recursos
   * Importante: Leaflet requiere limpiar mapas para liberar memoria
   */
  cerrarMapa() {
    this.isMapModalOpen = false;
    if (this.map) {
      this.map.remove();  // Limpiar instancia de Leaflet
      this.map = null;
    }
  }
}