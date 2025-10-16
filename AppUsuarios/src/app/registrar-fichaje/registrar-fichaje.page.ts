import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-registrar-fichaje',
  templateUrl: './registrar-fichaje.page.html',
  styleUrls: ['./registrar-fichaje.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, RouterModule, IonButton],
})
export class RegistrarFichajePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
