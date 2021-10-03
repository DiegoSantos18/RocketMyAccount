import { NotificationService } from './../../shared/services/notification-service/notification.service';
import { FormControl } from '@angular/forms';
import { HeaderService } from './../template/header/header.service';
import { AuthService } from './../../shared/services/auth-service/auth.service';
import { User } from './../../shared/models/user';
import { EditUserDialogComponent } from './dialogs/edit-user-dialog/edit-user-dialog.component';
import { ApiService } from './../../shared/services/api-service/api.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  public users: User[] = [];
  public loggedUserIsAdmin: boolean = false;
  
  displayedColumns: string[] = ['name', 'lastName', 'role', 'email', 'actions'];
  dataSource = new MatTableDataSource<User>();
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;

  constructor(
    private apiService: ApiService, 
    private dialogRef: MatDialog,
    private authService: AuthService,
    private headerService: HeaderService,
    private alertService: NotificationService
  ) { 
    this.loggedUserIsAdmin = this.authService.isAdmin;
    headerService.headerData = {
      title: 'Usuários',
      icon: 'people',
      routeUrl: '/users'
    };

    this.loadUsersDataSource();
  }
  

  ngOnInit(){
    this.paginator._intl.itemsPerPageLabel="Usuários por página";
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  async loadUsersDataSource(){
    //Carrega usuários
    await this.apiService.getAllUsers().subscribe(users => {
      this.users = users;
      this.dataSource.data = this.users;
    });
  }

  addUser(){
    this.openEditUserDialog();
  }

  editUser(user: User){
    this.openEditUserDialog(user);
  }

  deleteUser(id: number){
    this.apiService.deleteUser(id).subscribe(() => {
      this.alertService.success("Usuário deletado com sucesso!");
      this.loadUsersDataSource();
    });
  }

  openEditUserDialog(user?: User){
    this.dialogRef.open(EditUserDialogComponent, {
      height: '400px',
      width: '600px',
      data: { user: user }
    }).afterClosed().subscribe(ok => {
      if(ok){
        this.loadUsersDataSource();
      }
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filter);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

