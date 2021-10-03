import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';


//local storage for registered user
let user = JSON.parse(localStorage.getItem('dbUser') || '{}');

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;
        // wrap in delayed observable to simulate server api call
        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize())//call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(delay(500))
            .pipe(dematerialize());

        function handleRoute() {
            switch (true) {
                case url.endsWith('/user/authenticate') && method === 'POST':
                    return authenticate();
                case url.endsWith('/user') && method === 'GET':
                    return getUsers();
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }    
        }

        // route functions
        function authenticate() {
            debugger;
            user = JSON.parse(localStorage.getItem('dbUser') || '{}');
            const { email, password } = body;
            const localUser = user.find((x: { email: any; password: any; }) => x.email === email && x.password === password);
            if (!localUser) return error('Usuário ou senha incorretos!');
            return ok({
                id: localUser.id,
                name: localUser.name,
                lastName: localUser.lastName,
                role: localUser.role,
                token: 'fake-jwt-token'
            })
        }

        function getUsers() {
            if (!isLoggedIn()) return unauthorized();
            return ok(user);
        }

        // helper functions

        function ok(body?: { id: any; name: any; lastName: any; role: any; token: string; } | undefined) {
            return of(new HttpResponse({ status: 200, body }))
        }

        function error(message: string) {
            return throwError({ error: { message } });
        }

        function unauthorized() {
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
        }

        function isLoggedIn() {
            return headers.get('Authorization') === 'Bearer fake-jwt-token';
        }
    }
}

export const fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};