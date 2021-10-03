import { AuthService } from './../../../../shared/services/auth-service/auth.service';
import { NotificationService } from './../../../../shared/services/notification-service/notification.service';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Role, User, AuthorizationUser } from './../../../../shared/models/user';
import { ApiService } from './../../../../shared/services/api-service/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';

interface SelectRole {
  value: Role;
  name: string;
  disabled: boolean;
}

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: ['./edit-user-dialog.component.scss']
})
export class EditUserDialogComponent implements OnInit {
  public isNew: boolean;
  public loggedUserIsAdmin: boolean = false;
  public loggedUser!: AuthorizationUser;
  public isPerfil: boolean = false;
  public user!: User;
  @ViewChild("form", { static: true })
  private form!: NgForm;
  public addCusForm!: FormGroup;
  wasFormChanged = false;
  public breakpoint!: number;

  roles: SelectRole[] = [
    { value: Role.ADMIN, name: 'Admin', disabled: true },
    { value: Role.USER, name: 'Usuário', disabled: false }
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<EditUserDialogComponent>,
    private fb: FormBuilder,
    private alertService: NotificationService, 
    private apiService: ApiService,
    private authService: AuthService) 
  { 
    this.loggedUserIsAdmin = this.authService.isAdmin;
    this.loggedUser = this.authService.loggedUser;

    if (data) {
      this.isPerfil = data["isPerfil"];
      this.user = data["user"];
    }

    if (this.user) {
      this.isNew = false;
    } else {
      this.isNew = true;
    }
  }

  ngOnInit(): void {
    //#region Form Control - inicia o que precisar e carrega o form
    this.addCusForm = this.fb.group({
      id: new FormControl({ value: (this.user ? this.user.id : null)}),
      name: new FormControl({ value: (this.user ? this.user.name : null), disabled: !this.canEditField() }, [Validators.required, Validators.pattern('[a-zA-Z]+([a-zA-Z ]+)*')]),
      lastName: new FormControl({ value: (this.user ? this.user.lastName : null), disabled: !this.canEditField() }, [Validators.required, Validators.pattern('[a-zA-Z]+([a-zA-Z ]+)*')]),
      role: new FormControl({ value: (this.user ? this.user.role : null), disabled: !this.canEditRole() }, [Validators.required]),
      email: new FormControl({ value: (this.user ? this.user.email : null), disabled: !this.canEditField() }, [Validators.required, Validators.email]),
      password: new FormControl({ value: (this.user ? this.user.password : null), disabled: !this.canEditField(true) }, [Validators.required]),
      token: new FormControl({ value: (this.user ? this.user.token : null)})
    });
    this.breakpoint = window.innerWidth <= 600 ? 1 : 2; // Breakpoint observer code
    //#endregion
  }

  // loadUserPerfil(): User {
  //   this.apiService.getUserById(this.loggedUser.id).subscribe(u => {return u;});
  // }

  canEditField(isPassword: boolean = false): boolean{
    //Admin, perfil com senha, e novo usuário não perfil libera campo edição
    if(this.loggedUserIsAdmin || 
      (this.isPerfil && isPassword) ||
      (!this.isPerfil && this.isNew)){
      return true;
    }

    return false;
  }

  canEditRole(): boolean{
    /*Somente o admin edita usuários
    * Por consequencia não permite editar um mesmo usuário == usuário logado
    * Admin não pode mudar papel como ele vai editar usuários depois?? fica fixo admin
    */
    if(this.loggedUserIsAdmin && this.loggedUser?.id != this.user?.id){
      return true;
    }

    return false;
  }

  cancel() {
    this.dialogRef.close();
  }

  saveUser() {
    if (this.form.invalid) {
      this.alertService.alert("Preencha o formulários corretamente!");
      return;
    }

    let request: Observable<any>;
    let successMessage: string;
    let errorMessage: string;

    //Criar usuário
    if (this.isNew) {
      request = this.apiService.postUser(this.user);
      successMessage = "Usuário criado com sucesso!";
      errorMessage = "Houve um erro ao criar o usuário: ";
    }
    //Editar usuário
    else {
      request = this.apiService.putUser(this.user);
      successMessage = "Usuário criado com sucesso!";
      errorMessage = "Houve um erro ao criar o usuário: ";
    }

    request
      .subscribe(id => {
        if (id && this.isNew) {
          this.user.id = id;
        }
        this.dialogRef.close();
        this.alertService.success(successMessage);
      },
      error => {
        this.alertService.error(`${errorMessage}${error}`);
      });
  }

  //#region Form
  public onAddCus(): void {
    this.markAsDirty(this.addCusForm);
  }

  // tslint:disable-next-line:no-any
  public onResize(event: any): void {
    this.breakpoint = event.target.innerWidth <= 600 ? 1 : 2;
  }

  private markAsDirty(group: FormGroup): void {
    group.markAsDirty();
    // tslint:disable-next-line:forin
    for (const i in group.controls) {
      group.controls[i].markAsDirty();
    }
  }

  formChanged() {
    this.wasFormChanged = true;
  }
  //#endregion
}
