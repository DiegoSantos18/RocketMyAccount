import { NgmaterialModule } from './../../../../shared/modules/material/ngmaterial/ngmaterial.module';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LayoutComponent } from './../../../../components/template/layout/layout.component';
import { LoginComponent } from '../../login.component';


@NgModule({
  declarations: [
    LayoutComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
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
export class AuthModule { }
