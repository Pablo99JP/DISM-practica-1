import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'registrar-fichaje',
        loadComponent: () =>
          import('../registrar-fichaje/registrar-fichaje.page').then((m) => m.RegistrarFichajePage),
      },
      {
        path: 'consulta-fichajes',
        loadComponent: () =>
          import('../consulta-fichajes/consulta-fichajes.page').then((m) => m.ConsultaFichajesPage),
      },
      {
        path: '',
        redirectTo: '/tabs/registrar-fichaje',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/registrar-fichaje',
    pathMatch: 'full',
  },
];