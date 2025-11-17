import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';

@Component({
  selector: 'app-consulta-fichajes',
  templateUrl: 'consulta-fichajes.page.html',
  styleUrls: ['consulta-fichajes.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent]
})
export class ConsultaFichajesPage {

  constructor() {}

}
