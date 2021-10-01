import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';


// array in local storage for registered users
let users = JSON.parse(localStorage.getItem('dbUser') || '{}');

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;
        // wrap in delayed observable to simulate server api call
        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(delay(500))
            .pipe(dematerialize());

        function handleRoute() {
            switch (true) {
                case url.endsWith('/users/authenticate') && method === 'POST':
                    return authenticate();
                case url.endsWith('/users/register') && method === 'POST':
                    return register();
                case url.endsWith('/users/loggedUser') && method === 'GET':
                    return getLoggedUser();
                case url.endsWith('/users') && method === 'GET':
                    return getUsers();
                case url.match(/\/users\/\d+$/) && method === 'GET':
                    return getUserById();
                case url.match(/\/users\/\d+$/) && method === 'PUT':
                    return updateUser();
                case url.match(/\/users\/\d+$/) && method === 'DELETE':
                    return deleteUser();
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }    
        }

        // route functions

        function authenticate() {
            
            users = JSON.parse(localStorage.getItem('dbUser') || '{}');
            const { email, password } = body;
            const user = users.find((x: { email: any; password: any; }) => x.email === email && x.password === password);
            if (!user) return error('Usuário ou senha incorretos!');
            return ok({
                id: user.id,
                name: user.name,
                lastName: user.lastName,
                role: user.role,
                email: user.email,
                password: user.password,
                token: 'fake-jwt-token'
            })
        }

        function getLoggedUser() {
            
            //Tem token tá logado, pq teria mais usuários com token se um ta logado??
            const user = users.find((x: { token: any; }) => x.token !== '');
            if (!user){ return unauthorized() } //Vai deslogar o cara retorna 401 unauthorized
            return ok(user);
        }

        function register() {
            const user = body

            if (users.find((x: { email: any; }) => x.email === user.email)) {
                return error('Email "' + user.email + '" já está em uso!')
            }

            user.id = users.length ? Math.max(...users.map((x: { id: any; }) => x.id)) + 1 : 1;
            users.push(user);
            localStorage.setItem('users', JSON.stringify(users));
            return ok();
        }

        function getUsers() {
            if (!isLoggedIn()) return unauthorized();
            return ok(users);
        }

        function getUserById() {
            if (!isLoggedIn()) return unauthorized();

            const user = users.find((x: { id: number; }) => x.id === idFromUrl());
            return ok(user);
        }

        function updateUser() {
            if (!isLoggedIn()) return unauthorized();

            let params = body;
            let user = users.find((x: { id: number; }) => x.id === idFromUrl());

            // only update password if entered
            if (!params.password) {
                delete params.password;
            }

            // update and save user
            Object.assign(user, params);
            localStorage.setItem('dbUser', JSON.stringify(users));

            return ok();
        }

        function deleteUser() {
            if (!isLoggedIn()) return unauthorized();

            users = users.filter((x: { id: number; }) => x.id !== idFromUrl());
            localStorage.setItem('dbUser', JSON.stringify(users));
            return ok();
        }

        // helper functions

        function ok(body?: { id: any; name: any; lastName: any; role: any; email: any; password: any; token: string; } | undefined) {
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

        function idFromUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }
    }
}

export const fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};