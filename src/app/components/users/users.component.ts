import { AuthService } from './../../shared/services/auth-service/auth.service';
import { Role, User } from './../../shared/models/user';
import { EditUserDialogComponent } from './dialogs/edit-user-dialog/edit-user-dialog.component';
import { ApiService } from './../../shared/services/api-service/api.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  public users!: User[];
  public loggedUserIsAdmin: boolean = false;

  constructor(
    private apiService: ApiService, 
    private dialogRef: MatDialog,
    private authService: AuthService
  ) { 
    //É o administrador logado?
    this.loggedUserIsAdmin = this.authService.isAdmin();
  }

  ngOnInit(): void {
  }

  addUser(){
    this.openEditUserDialog();
  }

  editUser(user?: User){
    //Teste editar capar fora depois
    user = new User();
    user.id = 1;
    user.name = "teste";
    user.lastName = "teste";
    user.role = Role.ADMIN;
    user.email ="teste@teste.com";
    user.password = "123456";

    this.openEditUserDialog(user);
  }

  openEditUserDialog(user?: User){
    this.dialogRef.open(EditUserDialogComponent, {
      height: '400px',
      width: '600px',
      data: { isPerfil: false, user: user }
    }).afterClosed();
  }
}
