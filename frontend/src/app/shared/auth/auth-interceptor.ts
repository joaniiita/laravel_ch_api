import {Injectable} from '@angular/core';
import {HttpInterceptorFn, HttpErrorResponse} from '@angular/common/http';

import {inject} from '@angular/core';
import {AuthService} from './auth';
import {catchError, switchMap, throwError, of} from 'rxjs';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getAccessToken();

  let request = req;

  if (token) {
    request = req.clone({
      setHeaders: {Authorization: `Bearer ${token}`}
    });
  }

  return next(request).pipe(
    catchError((err: HttpErrorResponse) => {

      if (req.url.includes('/login') && err.status === 401) return throwError(() => err);

      if (req.url.includes('/refresh')){
        auth.logout();
        return throwError(() => err);
      }

      if (err.status === 401) {
        return auth.refreshToken().pipe(
          switchMap((res : any) => {
            localStorage.setItem('token', res.access_token);

            const newReq = req.clone({
              setHeaders: { Authorization: `Bearer ${res.access_token}`}
            });
            return next(newReq);
          }),
          catchError((refreshErr) => {
            auth.logout();
            return throwError(() => refreshErr);
          })
        )

      }

      return throwError(err);
    })
  )
};
