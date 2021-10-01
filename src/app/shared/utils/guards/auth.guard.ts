import { AuthService } from './../../services/auth-service/auth.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private router: Router, private authService: AuthService) {}
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const loggedUser = this.authService.getLoggedUser();
    if (loggedUser) {
        //autorizado return true
        return true;
    }

    //Não autorizado, redireciona pro login
    this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url }});
    return false;
}
}
