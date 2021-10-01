import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  public returnUrl!: string;
  public hidePwd: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService
  ) { 
    //Redireciona para home se logou
    if (this.authService.userValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    //get retorna url para rota parametro ou padrão '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  //get fácil acesso form fields
  get field() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    //Validação form inválido
    if (this.loginForm.invalid) {
        return;
    }

    this.loading = true;
    this.authService.login(this.field.username.value, this.field.password.value)
      .pipe(first())
      .subscribe(
          data => {
              this.router.navigate([this.returnUrl]);
          },
          error => {
              this.notificationService.error(error);
              this.loading = false;
          });
  }
}
