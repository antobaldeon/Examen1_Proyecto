import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list';
import { CartComponent } from './components/cart/cart';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { adminGuard } from './guards/admin.guard';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard';
import { ProductCreateComponent } from './pages/admin/product-create/product-create';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'cart', component: CartComponent },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [adminGuard] },
  { path: 'admin/products/new', component: ProductCreateComponent, canActivate: [adminGuard] },
  { path: 'admin/products/:id/edit', component: ProductCreateComponent, canActivate: [adminGuard] },
  { path: '**', redirectTo: 'products' }
];
