import { NgmaterialModule } from './../../../shared/modules/material/ngmaterial/ngmaterial.module';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UsersComponent } from '../users.component';
import { EditUserDialogComponent } from '../dialogs/edit-user-dialog/edit-user-dialog.component';
import { UsersListComponent } from '../dialogs/list/users-list/users-list.component';

@NgModule({
  declarations: [
    UsersComponent,
    EditUserDialogComponent,
    UsersListComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    NgmaterialModule
  ],
  exports: [
    NgmaterialModule
  ],
  entryComponents: [
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class UserModule { }
