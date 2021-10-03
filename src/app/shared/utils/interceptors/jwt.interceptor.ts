import { AuthService } from './../../services/auth-service/auth.service';
import { environment } from './../../../../environments/environment';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //add auth header with jwt if user is logged in and request is to the api url
    const loggedUser = this.authService.loggedUser;
    const isLoggedIn = loggedUser && loggedUser.token;
    const isApiUrl = request.url.startsWith(environment.apiUrl);
    if (isLoggedIn && isApiUrl && !request.url.endsWith("/users")) {
        request = request.clone({
            setHeaders: {
                Authorization: `Bearer ${loggedUser.token}`
            }
        });
    }

    return next.handle(request);
  }
}
