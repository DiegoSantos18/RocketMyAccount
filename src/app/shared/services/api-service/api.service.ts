import { environment } from './../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../models/user';
import { ApiEntityType } from '../../utils/enums/apiEntityType';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  //Criar usuário
  postUser(user: User): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}${ApiEntityType.Users}`, user);
  }

  //Atualizar usuário
  putUser(user: User): Observable<User> {
    return this.http.put<User>(`${environment.apiUrl}${ApiEntityType.Users}/${user.id}`, user);
  }

  //Get todos usuários
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}${ApiEntityType.Users}`);
  }

  //Get usuário by Id
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}${ApiEntityType.Users}/${id}`);
  }

   //Get Logged User
   getLoggedUserByAuthentication(email: string, password: string): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}${ApiEntityType.Users}?email=${email}&password=${password}&_limit=1`);
  }
}
