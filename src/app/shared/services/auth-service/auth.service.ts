import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Role, User } from './../../models/user';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user: Observable<User>;
  private userSubject: BehaviorSubject<User>;
  
  constructor(private router: Router, private http: HttpClient) 
  { 
    
    this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('dbUser') || '{}'));
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User {
    return this.userSubject.value;
  }

  public set nextUserSubject(user: any) {
    this.userSubject.next(user);
  }

  login(email: string, password: string) {
    return this.http.post<User>(`${environment.apiUrl}users/authenticate`, { email, password })
    .pipe(map(user => {
      //Guarda detalhes do usuário jwt token em local storage para o usuário logado e reload das páginas depois
      localStorage.setItem('dbUser', JSON.stringify(user));
      this.userSubject.next(user);
      return user;
    }));
  }

  logout() {
    //Remove o usuário logado do local storage e redireciona pra login
    localStorage.removeItem('dbUser');
    this.userSubject.next(new User());
    this.router.navigate(['/auth/login']);
  }

  getLoggedUser(): User{
    const loggedUser = new User();
    let request = this.http.get<User>(`${environment.apiUrl}users/loggedUser`);

    if(request){
      request.subscribe((user) => {
        if(user){
          loggedUser.id = user.id;
          loggedUser.name = user.name,
          loggedUser.lastName = user.lastName;
          loggedUser.role = user.role;
          loggedUser.email = user.email;
          loggedUser.password = user.password;
          loggedUser.token = user.token;
        }
      }).unsubscribe();
    }
    else{
      this.logout();
    }
    
    return loggedUser;
  }

  isAdmin(): boolean {
    const userLogged = this.getLoggedUser();
    if(userLogged){
      return userLogged.role == Role.ADMIN;
    }

    return false;
  }
}
