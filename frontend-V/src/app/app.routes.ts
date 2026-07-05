import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list';
import { ProductDetailComponent } from './components/product-detail/product-detail';
import { CartComponent } from './components/cart/cart';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './pages/login/login';
import { adminGuard } from './guards/admin.guard';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard';
import { ProductCreateComponent } from './pages/admin/product-create/product-create';
import { ProductsAdminComponent } from './pages/admin/products-admin/products-admin';
import { InventoryAdminComponent } from './pages/admin/inventory-admin/inventory-admin';
import { OrdersAdminComponent } from './pages/admin/orders-admin/orders-admin';
import { RegisterComponent } from './pages/register/register';
import { MyOrdersComponent } from './pages/my-orders/my-orders';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'cart', component: CartComponent, canActivate: [authGuard] },
  { path: 'my-orders', component: MyOrdersComponent, canActivate: [authGuard] },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [adminGuard] },
  { path: 'admin/products', component: ProductsAdminComponent, canActivate: [adminGuard] },
  { path: 'admin/products/new', component: ProductCreateComponent, canActivate: [adminGuard] },
  { path: 'admin/inventory', component: InventoryAdminComponent, canActivate: [adminGuard] },
  { path: 'admin/orders', component: OrdersAdminComponent, canActivate: [adminGuard] },
  { path: '**', redirectTo: 'login' }
];
