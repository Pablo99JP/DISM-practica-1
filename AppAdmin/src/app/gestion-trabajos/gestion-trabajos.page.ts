import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';

@Component({
  selector: 'app-gestion-trabajos',
  templateUrl: 'gestion-trabajos.page.html',
  styleUrls: ['gestion-trabajos.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent]
})
export class GestionTrabajosPage {

  constructor() {}

}
