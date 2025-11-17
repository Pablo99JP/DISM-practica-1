import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';

@Component({
  selector: 'app-gestion-usuarios',
  templateUrl: 'gestion-usuarios.page.html',
  styleUrls: ['gestion-usuarios.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent],
})
export class GestionUsuariosPage {
  constructor() {}
}
