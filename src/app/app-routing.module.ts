import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HeadquarterComponent } from './headquarter/headquarter.component';
import { authGuard } from './auth.guard';
import { AdminComponent } from './admin/admin.component';
import { TicketPageComponent } from './admin/ticket-page/ticket-page.component';
import { UsersPageComponent } from './admin/users-page/users-page.component';

const routes: Routes = [
  //{ path: '', loadChildren: () => import('./public/public.module').then((m) => m.PublicModule) },
  { path: 'headquarter', loadChildren: () => import('./public/public.module').then((m) => m.PublicModule) },
  { path: '', component: LoginComponent },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
      canActivate:[authGuard],
  },
  {
    path: 'overview',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
      canActivate:[authGuard],
  },
  { path: 'login', component: LoginComponent },
  { path: 'headquarter', component: HeadquarterComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
