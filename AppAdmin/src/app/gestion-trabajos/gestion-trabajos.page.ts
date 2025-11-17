import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem,
  IonLabel, IonButton, IonFab, IonFabButton, IonIcon,
  IonModal, IonInput, IonButtons
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, create, trash } from 'ionicons/icons';
import { ApiService } from '../services/api';

@Component({
  selector: 'app-gestion-trabajos',
  templateUrl: 'gestion-trabajos.page.html',
  styleUrls: ['gestion-trabajos.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem,
    IonLabel, IonButton, IonFab, IonFabButton, IonIcon,
    IonModal, IonInput, IonButtons
  ],
})
export class GestionTrabajosPage implements OnInit {
  trabajos: any[] = [];
  isModalOpen = false;
  isEditMode = false;

  trabajoActual: any = {
    Nombre: ''
  };

  constructor(private apiService: ApiService) {
    addIcons({ add, create, trash });
  }

  ngOnInit() {
    this.cargarTrabajos();
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

  abrirModalCrear() {
    this.isEditMode = false;
    this.trabajoActual = { Nombre: '' };
    this.isModalOpen = true;
  }

  abrirModalEditar(trabajo: any) {
    this.isEditMode = true;
    this.trabajoActual = { ...trabajo };
    this.isModalOpen = true;
  }

  cerrarModal() {
    this.isModalOpen = false;
  }

  guardarTrabajo() {
    if (!this.trabajoActual.Nombre) {
      alert('El nombre es obligatorio');
      return;
    }

    if (this.isEditMode) {
      // Actualizar
      this.apiService.updateTrabajo(this.trabajoActual.IdTrabajo, this.trabajoActual).subscribe({
        next: () => {
          this.cargarTrabajos();
          this.cerrarModal();
        },
        error: (err) => {
          console.error('Error al actualizar trabajo:', err);
          alert('Error al actualizar trabajo');
        }
      });
    } else {
      // Crear
      this.apiService.createTrabajo(this.trabajoActual).subscribe({
        next: () => {
          this.cargarTrabajos();
          this.cerrarModal();
        },
        error: (err) => {
          console.error('Error al crear trabajo:', err);
          alert('Error al crear trabajo');
        }
      });
    }
  }

  eliminarTrabajo(id: number) {
    if (confirm('¿Estás seguro de eliminar este trabajo?')) {
      this.apiService.deleteTrabajo(id).subscribe({
        next: () => {
          this.cargarTrabajos();
        },
        error: (err) => {
          console.error('Error al eliminar trabajo:', err);
          alert('Error al eliminar trabajo');
        }
      });
    }
  }
}