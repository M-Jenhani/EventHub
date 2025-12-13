import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/events', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'events',
    loadComponent: () => import('./components/event-list/event-list.component').then(m => m.EventListComponent)
  },
  {
    path: 'events/:id',
    loadComponent: () => import('./components/event-detail/event-detail.component').then(m => m.EventDetailComponent)
  },
  {
    path: 'events/create',
    loadComponent: () => import('./components/event-form/event-form.component').then(m => m.EventFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'events/edit/:id',
    loadComponent: () => import('./components/event-form/event-form.component').then(m => m.EventFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/user-dashboard/user-dashboard.component').then(m => m.UserDashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    loadComponent: () => import('./components/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    canActivate: [adminGuard]
  },
  { path: '**', redirectTo: '/events' }
];
