import { AuthService } from './../../services/auth-service/auth.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private router: Router, private authService: AuthService) {}
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const loggedUserAuthorized = this.authService.loggedUser;
    if (loggedUserAuthorized) {
        //autorizado return true
        return true;
    }

    //Não autorizado, redireciona pro login
    this.router.navigate(['/'], { queryParams: { returnUrl: state.url }});
    return false;
  }
}
