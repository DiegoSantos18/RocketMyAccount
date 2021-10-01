import { ElevationGuard } from './../../../shared/utils/guards/elevation.guard';
import { EditUserDialogComponent } from './../dialogs/edit-user-dialog/edit-user-dialog.component';
import { LayoutComponent } from './../../template/layout/layout.component';
import { AuthGuard } from './../../../shared/utils/guards/auth.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from '../users.component';

const routes: Routes = [
  {path: 'list', component: UsersComponent, canActivate: [AuthGuard] },
  {path: 'add', component: EditUserDialogComponent, canActivate: [AuthGuard, ElevationGuard] },
  {path: 'edit/:id', component: EditUserDialogComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
