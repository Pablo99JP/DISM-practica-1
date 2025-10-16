import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButton, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-consulta-fichajes',
  templateUrl: './consulta-fichajes.page.html',
  styleUrls: ['./consulta-fichajes.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, RouterModule],
})
export class ConsultaFichajesPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
