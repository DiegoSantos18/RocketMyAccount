import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Role, User, AuthUser } from './../../models/user';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user: Observable<AuthUser>;
  private userSubject: BehaviorSubject<AuthUser>;
  
  constructor(private router: Router, private http: HttpClient) 
  { 
    
    this.userSubject = new BehaviorSubject<AuthUser>(JSON.parse(localStorage.getItem('authUser') || '{}'));
    this.user = this.userSubject.asObservable();
  }

  public get loggedUser(): AuthUser {
    return this.userSubject.value;
  }

  public set loggedUser(user: any) {
    this.userSubject.next(user);
  }

  login(email: string, password: string) {
    return this.http.post<AuthUser>(`${environment.apiUrl}user/authenticate`, { email, password })
    .pipe(map(authUser => {
      //Guarda detalhes do usuário jwt token em local storage para o usuário logado e reload das páginas depois
      localStorage.setItem('authUser', JSON.stringify(authUser));
      //Remove o usuário carregado não precisamos mais dele
      localStorage.removeItem('dbUser');
      this.loggedUser = authUser;
      return authUser;
    }));
  }

  logout() {
    //Remove o usuário logado do local storage e redireciona pra login
    localStorage.removeItem('dbUser');
    localStorage.removeItem('authUser');
    this.loggedUser = null;
    this.router.navigate(['/login']);
  }

  public get isAdmin(): boolean {
    const userLogged = this.loggedUser;
    if(userLogged){
      return userLogged.role == Role.ADMIN;
    }

    return false;
  }
}
