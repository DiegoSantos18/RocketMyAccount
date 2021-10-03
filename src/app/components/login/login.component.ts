import { ApiService } from './../../shared/services/api-service/api.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { NotificationService } from './../../shared/services/notification-service/notification.service';
import { AuthService } from './../../shared/services/auth-service/auth.service';
import { User } from './../../shared/models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;
  public loading = false;
  public submitted = false;
  public hidePwd: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private apiService: ApiService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required, Validators.email],
      password: ['', Validators.required]
    });
  }

  //get fácil acesso form fields
  get field() { return this.loginForm.controls; }

  async login() {
    this.submitted = true;

    //Validação form inválido
    if (this.loginForm.invalid) {
        return;
    }

    this.loading = true;
    const authUser = await this.authService.login(this.field.username.value, this.field.password.value);
    if(authUser){
      authUser.pipe(first())
      .subscribe(
        data => {
          this.notificationService.success(`Usuário ${data.name} ${data.lastName} logado com sucesso!`);
          this.router.navigate(['/dashboard']);
        },
        error => {
          this.notificationService.error(error);
          this.loading = false;
        });
    }
    else{
      this.notificationService.error(`Erro durante a autenticação!`);
    }
  }
}
