import { ApiService } from './../../shared/services/api-service/api.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { NotificationService } from './../../shared/services/notification-service/notification.service';
import { AuthService } from './../../shared/services/auth-service/auth.service';

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

  async onSubmit(){
    this.submitted = true;

    //Validação form inválido
    if (this.loginForm.invalid) {
      return;
    }

    //Verifica se existe de fato este usuário no banco
    await this.apiService.getLoggedUserByAuthentication(this.field.username.value, this.field.password.value).pipe(first()).subscribe(
      user => {
        if(user){
          //Achou nosso usuário carrego ele pra localstorage
          localStorage.setItem('dbUser', JSON.stringify(user));
          this.login();
        }
        else{
          this.notificationService.error("Nenhum usuário localizado para email e senha informados!");
        }
      },
      error => {
        console.log(error);
        this.notificationService.error("Houve um erro ao buscar usuário para email e senha informados!");
        return;
      });
  }

  login() {
    this.loading = true;
    this.authService.login(this.field.username.value, this.field.password.value)
      .pipe(first())
      .subscribe(
        data => {
          this.notificationService.success(`Bem vindo ${data.name} ${data.lastName}, logado com sucesso!`);
          this.router.navigate(['/dashboard']);
        },
        error => {
          console.log(error);
          this.notificationService.error(error);
          this.loading = false;
        });
  }
}
