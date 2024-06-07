import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HeadquarterComponent } from './headquarter/headquarter.component';
import { authGuard } from './auth.guard';
import { AdminComponent } from './admin/admin.component';
import { TicketPageComponent } from './admin/ticket-page/ticket-page.component';
import { UsersPageComponent } from './admin/users-page/users-page.component';
import { NewUserLoginComponent } from './new-user-login/new-user-login.component';
import { OtpComponent } from './otp/otp.component';
import { SetPasswordComponent } from './set-password/set-password.component';
import { authDeactivateGuard } from './auth-deactivate.guard';

const routes: Routes = [
  //{ path: '', loadChildren: () => import('./public/public.module').then((m) => m.PublicModule) },
  { path: 'headquarter', loadChildren: () => import('./public/public.module').then((m) => m.PublicModule) },
  
  { path: '', loadChildren: () => import('./public/public.module').then((m) => m.PublicModule) },
  //{ path: '', component: LoginComponent },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
      canActivate:[authGuard],
  },
  { path: 'login', component: LoginComponent },
  { path: 'headquarter', component: HeadquarterComponent },
  { path: 'newUserLogin', component: NewUserLoginComponent, canActivate: [authGuard],canDeactivate: [authDeactivateGuard] },
  // { path: 'otp', component: OtpComponent, canActivate: [authGuard], canDeactivate: [authDeactivateGuard] },
  { path: 'setPassword', component: SetPasswordComponent, canActivate: [authGuard], canDeactivate: [authDeactivateGuard] },
  { path: 'otp', component: OtpComponent, canActivate: [authGuard], canDeactivate: [authDeactivateGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
