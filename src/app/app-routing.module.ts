import { HomeComponent } from './components/template/home/home.component';
import { UsersComponent } from './components/users/users.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/utils/guards/auth.guard';
import { ElevationGuard } from './shared/utils/guards/elevation.guard';

import { LoginComponent } from './components/login/login.component';
import { LayoutComponent } from './components/template/layout/layout.component';
import { EditUserDialogComponent } from './components/users/dialogs/edit-user-dialog/edit-user-dialog.component';
import { ProfileDialogComponent } from './components/users/dialogs/profile-dialog/profile-dialog/profile-dialog.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: LayoutComponent, canActivate: [AuthGuard], children: [
    { path: 'dashboard', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
    { path: 'users/add', component: EditUserDialogComponent, canActivate: [AuthGuard, ElevationGuard] },
    { path: 'users/edit/:id', component: EditUserDialogComponent, canActivate: [AuthGuard, ElevationGuard] },
    { path: 'users/profile', component: ProfileDialogComponent, canActivate: [AuthGuard] }
  ] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
