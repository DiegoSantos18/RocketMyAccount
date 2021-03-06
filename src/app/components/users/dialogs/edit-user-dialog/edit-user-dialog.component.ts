import { AuthService } from './../../../../shared/services/auth-service/auth.service';
import { NotificationService } from './../../../../shared/services/notification-service/notification.service';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Role, User, AuthUser } from './../../../../shared/models/user';
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
  public loggedUser!: AuthUser;
  public user!: User;
  @ViewChild("form", { static: true })
  private form!: NgForm;
  public addCusForm!: FormGroup;
  wasFormChanged = false;
  public breakpoint!: number;

  roles: SelectRole[] = [
    { value: Role.ADMIN, name: 'Admin', disabled: true },
    { value: Role.USER, name: 'Comum', disabled: false }
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
      this.user = data["user"];
    }

    if (this.user) {
      this.isNew = false;
    } else {
      this.isNew = true;
      this.user = new User();
    }
  }

  ngOnInit(): void {
    //#region Form Control - inicia o que precisar e carrega o form
    this.addCusForm = this.fb.group({
      id: new FormControl({ value: (this.user ? this.user.id : null)}),
      name: new FormControl({ value: (this.user ? this.user.name : null), disabled: !this.canEditField() }, [Validators.required, Validators.pattern('[a-zA-Z]+([a-zA-Z ]+)*')]),
      lastName: new FormControl({ value: (this.user ? this.user.lastName : null), disabled: !this.canEditField() }, [Validators.required, Validators.pattern('[a-zA-Z]+([a-zA-Z ]+)*')]),
      role: new FormControl({ value: (this.user ? this.user.role : null), disabled: !this.canEditField(true) }, [Validators.required]),
      email: new FormControl({ value: (this.user ? this.user.email : null), disabled: !this.canEditField() }, [Validators.required, Validators.email]),
      password: new FormControl({ value: (this.user ? this.user.password : null), disabled: !this.canEditField() }, [Validators.required]),
      token: new FormControl({ value: (this.user ? this.user.token : null)})
    });
    this.breakpoint = window.innerWidth <= 600 ? 1 : 2; // Breakpoint observer code
    //#endregion
  }

  loadFormGroup(){
    
  }

  canEditField(isRole: boolean = false): boolean{
    /*S?? admin edita usu??rios 
    * No caso do admin editar ele mesmo n??o pode mudar o campo papel, sen??o ee pede os acessos*/
    if(!this.loggedUserIsAdmin || (isRole && this.user.role == Role.ADMIN)){
      return false;
    }

    return true;
  }

  cancel() {
    this.dialogRef.close();
  }

  async saveUser() {
    if (this.form.invalid) {
      this.alertService.alert("Preencha o formul??rios corretamente!");
      return;
    }

    let request: Observable<any>;
    let successMessage: string;
    let errorMessage: string;

    //Criar usu??rio
    if (this.isNew) {
      request = this.apiService.postUser(this.user);
      successMessage = "Usu??rio criado com sucesso!";
      errorMessage = "Houve um erro ao criar o usu??rio: ";
    }
    //Editar usu??rio
    else {
      request = this.apiService.putUser(this.user);
      successMessage = "Usu??rio editado com sucesso!";
      errorMessage = "Houve um erro ao editar o usu??rio: ";
    }

    request
      .subscribe(id => {
        if (id && this.isNew) {
          this.user.id = id;
        }
        this.dialogRef.close(true);
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
