import { AuthService } from './../../services/auth-service/auth.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ElevationGuard implements CanActivate {
  
  constructor(private authService: AuthService){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    const loggedUserAuthorized = this.authService.loggedUserHasAuthorized;

    //Se Admin autorizado
    if(loggedUserAuthorized && this.authService.isAdmin){
      return true;
    }

    return false;
  }
}
