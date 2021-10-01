import { Role } from './../../models/user';
import { AuthService } from './../../services/auth-service/auth.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ElevationGuard implements CanActivate {
  
  constructor(private authService: AuthService){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    const userLogged = this.authService.getLoggedUser();

    //Se Admin autorizado
    if(userLogged && userLogged.role == Role.ADMIN){
      return true;
    }

    return false;
  }
}
