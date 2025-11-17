import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem,
  IonLabel, IonButton, IonFab, IonFabButton, IonIcon, IonAlert,
  IonModal, IonInput, IonButtons
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, create, trash } from 'ionicons/icons';
import { ApiService } from '../services/api';

@Component({
  selector: 'app-gestion-usuarios',
  templateUrl: 'gestion-usuarios.page.html',
  styleUrls: ['gestion-usuarios.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem,
    IonLabel, IonButton, IonFab, IonFabButton, IonIcon, IonAlert,
    IonModal, IonInput, IonButtons
  ],
})
export class GestionUsuariosPage implements OnInit {
  usuarios: any[] = [];
  isModalOpen = false;
  isEditMode = false;

  usuarioActual: any = {
    Nombre: '',
    Usuario: '',
    Clave: ''
  };

  constructor(private apiService: ApiService) {
    addIcons({ add, create, trash });
  }

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.apiService.getUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
      }
    });
  }

  abrirModalCrear() {
    this.isEditMode = false;
    this.usuarioActual = { Nombre: '', Usuario: '', Clave: '' };
    this.isModalOpen = true;
  }

  abrirModalEditar(usuario: any) {
    this.isEditMode = true;
    this.usuarioActual = { ...usuario };
    this.isModalOpen = true;
  }

  cerrarModal() {
    this.isModalOpen = false;
  }

  guardarUsuario() {
    if (!this.usuarioActual.Nombre) {
      alert('El nombre es obligatorio');
      return;
    }

    if (this.isEditMode) {
      // Actualizar
      this.apiService.updateUsuario(this.usuarioActual.IdUsuario, this.usuarioActual).subscribe({
        next: () => {
          this.cargarUsuarios();
          this.cerrarModal();
        },
        error: (err) => {
          console.error('Error al actualizar usuario:', err);
          alert('Error al actualizar usuario');
        }
      });
    } else {
      // Crear
      this.apiService.createUsuario(this.usuarioActual).subscribe({
        next: () => {
          this.cargarUsuarios();
          this.cerrarModal();
        },
        error: (err) => {
          console.error('Error al crear usuario:', err);
          alert('Error al crear usuario');
        }
      });
    }
  }

  eliminarUsuario(id: number) {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.apiService.deleteUsuario(id).subscribe({
        next: () => {
          this.cargarUsuarios();
        },
        error: (err) => {
          console.error('Error al eliminar usuario:', err);
          alert('Error al eliminar usuario');
        }
      });
    }
  }
}