import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./components/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'aviso-list',
    loadComponent: () => import('./components/aviso-list/aviso-list.component').then((m) => m.AvisoListComponent),
  },
  {
    path: 'crear-aviso',
    loadComponent: () => import('./components/crear-aviso/crear-aviso.component').then((m) => m.CrearAvisoComponent),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
