import { Routes } from '@angular/router';
import { Products } from './pages/products/products';
import { Login } from './pages/login/login';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'products', component: Products, canActivate: [authGuard] }
];