import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list';
import { CartComponent } from './components/cart/cart';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { ProductDetailComponent } from './pages/product-detail/product-detail';
import { adminGuard } from './guards/admin.guard';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard';
import { ProductCreateComponent } from './pages/admin/product-create/product-create';

export const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'cart', component: CartComponent, canActivate: [authGuard] },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [adminGuard] },
  { path: 'admin/products/new', component: ProductCreateComponent, canActivate: [adminGuard] },
  { path: '**', redirectTo: '' }
];
