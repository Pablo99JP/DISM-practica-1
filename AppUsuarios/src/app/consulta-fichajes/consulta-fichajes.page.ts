import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton, IonContent, IonHeader, IonTitle, IonToolbar,
  IonCard, IonCardContent, IonItem, IonLabel, IonList, IonDatetime
} from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-consulta-fichajes',
  templateUrl: './consulta-fichajes.page.html',
  styleUrls: ['./consulta-fichajes.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    IonButton, RouterModule, IonCard, IonCardContent, IonItem, IonLabel, IonList, IonDatetime
  ],
})
export class ConsultaFichajesPage implements OnInit {
  fechaDesde: Date | null = null;
  fechaHasta: Date | null = null;
  fichajes: any[] = [];
  userId: number = 1;

  // ✅ Inyectamos HttpClient
  constructor(private http: HttpClient) { }

  ngOnInit() {
    // Opcional: cargar todos los fichajes al iniciar
  }

  filtrarFichajes() {
    if (!this.fechaDesde || !this.fechaHasta) return;

    const desde = new Date(this.fechaDesde).toISOString();
    const hasta = new Date(this.fechaHasta).toISOString();

    this.http.get<any[]>(`http://localhost:3000/fichajes?usuario=${this.userId}&desde=${desde}&hasta=${hasta}`)
      .subscribe(data => {
        this.fichajes = data;
      }, error => {
        console.error('Error al filtrar fichajes:', error);
      });
  }
}
