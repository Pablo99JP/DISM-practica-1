import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'gestion-usuarios',
        loadComponent: () =>
          import('../gestion-usuarios/gestion-usuarios.page').then((m) => m.GestionUsuariosPage),
      },
      {
        path: 'gestion-trabajos',
        loadComponent: () =>
          import('../gestion-trabajos/gestion-trabajos.page').then((m) => m.GestionTrabajosPage),
      },
      {
        path: 'gestion-fichajes',
        loadComponent: () =>
          import('../gestion-fichajes/gestion-fichajes.page').then((m) => m.GestionFichajesPage),
      },
      {
        path: '',
        redirectTo: '/tabs/gestion-usuarios',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/gestion-usuarios',
    pathMatch: 'full',
  },
];
