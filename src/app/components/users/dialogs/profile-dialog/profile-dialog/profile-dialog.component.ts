import { AuthService } from './../../../../../shared/services/auth-service/auth.service';
import { ApiService } from './../../../../../shared/services/api-service/api.service';
import { NotificationService } from './../../../../../shared/services/notification-service/notification.service';
import { User, AuthUser } from './../../../../../shared/models/user';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile-dialog',
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.scss']
})
export class ProfileDialogComponent implements OnInit {
  public changePassword: boolean = false;
  public newPassword!: string;
  public confirmNewPassword!: string;
  public loggedUserIsAdmin: boolean = false;
  public loggedUser!: AuthUser;
  public user!: User;
  @ViewChild("form", { static: true })
  private form!: NgForm;
  public addCusForm!: FormGroup;
  wasFormChanged = false;
  public breakpoint!: number;

  constructor(
    private dialogRef: MatDialogRef<ProfileDialogComponent>,
    private fb: FormBuilder,
    private alertService: NotificationService, 
    private apiService: ApiService,
    private authService: AuthService) {
      this.loggedUserIsAdmin = this.authService.isAdmin;
      this.loggedUser = this.authService.loggedUser;
    }

  async ngOnInit() {
    await this.loadUserPerfil();
  }

  async loadUserPerfil() {
    //Carrega usuário
    await this.apiService.getUserById(this.loggedUser.id).subscribe(user => {
      this.user = user;
      return;
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  saveProfile() {
    if(this.newPassword != this.confirmNewPassword){
      this.alertService.alert("Nova senha e confirmação não são iguais!");
      return;
    }

    //Nova senha
    this.user.password = this.newPassword;

    let request: Observable<any>;
    let successMessage: string;
    let errorMessage: string;

    request = this.apiService.putUser(this.user);
    successMessage = "Senha alterada com sucesso!";
    errorMessage = "Houve um erro ao alterar senha de usuário: ";

    request
      .subscribe(id => {
        this.dialogRef.close(true);
        this.alertService.success(successMessage);
      },
      error => {
        this.alertService.error(`${errorMessage}${error}`);
      });
  }
}
