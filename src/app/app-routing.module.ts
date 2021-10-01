import { AuthGuard } from './shared/utils/guards/auth.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/template/home/home.component';

const authModule = () => import('./components/login/auth-module/auth/auth.module').then(x => x.AuthModule);
const userModule = () => import('./components/users/user-module/user.module').then(x => x.UserModule);

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'users', loadChildren: userModule },
  { path: 'auth', loadChildren: authModule }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
