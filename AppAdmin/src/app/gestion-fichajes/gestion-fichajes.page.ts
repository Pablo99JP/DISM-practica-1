import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';

@Component({
  selector: 'app-gestion-fichajes',
  templateUrl: 'gestion-fichajes.page.html',
  styleUrls: ['gestion-fichajes.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent],
})
export class GestionFichajesPage {
  constructor() {}
}
