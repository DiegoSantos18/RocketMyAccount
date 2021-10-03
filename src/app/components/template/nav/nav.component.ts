import { AuthService } from './../../../shared/services/auth-service/auth.service';
import { NavService } from './nav.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';
import { EditUserDialogComponent } from '../../users/dialogs/edit-user-dialog/edit-user-dialog.component';
import { AuthorizationUser } from './../../../shared/models/user';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  @ViewChild('sidenav' , {static: true})
  public sidenav!: MatSidenav;
  public userLogged!: AuthorizationUser;

  constructor(
    private dialogRef: MatDialog,
    private sidenavService: NavService, 
    private authService: AuthService
  ) { 
    this.userLogged = this.authService.loggedUser;
  }

  ngOnInit(): void {
		this.sidenavToggle();
	}

  //Toggle Menu
  sidenavToggle(){
    this.sidenavService.sideNavToggleSubject.subscribe(()=> {
      this.sidenav.toggle();
    });
  }

  //Fechar Menu
  sidenavClose(){
    this.sidenav.close();
  }

  openPerfilDialog() {
    this.sidenavToggle();//Toggle menu
    this.dialogRef.open(EditUserDialogComponent, {
      height: '400px',
      width: '600px',
      data: { isPerfil: true, user: undefined }
    }).afterClosed().subscribe(x => {
      this.sidenavToggle();//Quando eu fecho modal me abre menu novamente Toggle
    });
  }

  logout() {
    this.sidenavClose();//Fecha menu
    this.authService.logout();
  }
}
