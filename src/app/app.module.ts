import { UsersComponent } from './components/users/users.component';
import { EditUserDialogComponent } from './components/users/dialogs/edit-user-dialog/edit-user-dialog.component';
import { LayoutComponent } from './components/template/layout/layout.component';
import { LoginComponent } from './components/login/login.component';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/template/header/header.component';
import { NgmaterialModule } from './shared/modules/material/ngmaterial/ngmaterial.module';
import { FooterComponent } from './components/template/footer/footer/footer.component';
import { NavComponent } from './components/template/nav/nav.component';
import { HomeComponent } from './components/template/home/home.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogRef } from '@angular/material/dialog';
import { fakeBackendProvider } from './shared/utils/fake-backend';
import { ErrorInterceptor } from './shared/utils/interceptors/error.interceptor';
import { JwtInterceptor } from './shared/utils/interceptors/jwt.interceptor';
import { ProfileDialogComponent } from './components/users/dialogs/profile-dialog/profile-dialog/profile-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    NavComponent,
    HomeComponent,
    ProfileDialogComponent,
    LoginComponent,
    LayoutComponent,
    EditUserDialogComponent,
    UsersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgmaterialModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    NgmaterialModule
  ],
  exports: [
    NgmaterialModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        {
          provide: MatDialogRef,
          useValue: {}
        },
        // provider used to create fake backend
        fakeBackendProvider
  ],
  entryComponents: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
