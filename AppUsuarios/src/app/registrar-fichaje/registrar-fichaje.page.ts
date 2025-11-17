import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';

@Component({
  selector: 'app-registrar-fichaje',
  templateUrl: 'registrar-fichaje.page.html',
  styleUrls: ['registrar-fichaje.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent],
})
export class RegistrarFichajePage {
  constructor() {}
}
