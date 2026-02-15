import {Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, catchError, finalize, of, tap} from 'rxjs';
import {LoginResponse} from './auth.model';
import {User} from '../../models/user';

@Injectable({providedIn: 'root'})

export class AuthService {
  private api = 'http://localhost:8000/api/auth';
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  isLoggedIn = signal<boolean>(!!localStorage.getItem('access_token'));
  currentUser = signal<any>(null);


  constructor(private http: HttpClient) {
  }

  login(credentials: { email: string; password: string }) {
    return this.http
      .post<LoginResponse>(`${this.api}/login`, credentials)
      .pipe(tap(res => {
        this.storeTokens(res)
        this.userSubject.next(res.user);
      }));
  }

  register(data: FormData) {
    return this.http.post(`${this.api}/register`, data);
  }

  /*
  logout() {
  return this.http.post(`${this.api}/logout`, {}).pipe(
  tap(() => this.clearTokens())
  );
  }
  */
  logout() {
    return this.http.post(`${this.api}/logout`, {}).pipe(
      catchError(error => {
        // Si Laravel da 401, ignoramos el error porque el objetivo es salir de todos modos
        console.warn('El servidor ya había invalidado el token o no se envió.');
        return of(null); // Devuelve un observable exitoso vacío
      }),
      finalize(() => this.clearTokens())
    );
  }


  getcurrentUserValue(): User | null {
    return this.userSubject.value;
  }

  getProfile() {
    return this.http
      .get<User>(`${this.api}/me`)
      .pipe(tap(user => this.userSubject.next(user)));
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  private storeTokens(res: LoginResponse) {
    localStorage.setItem('access_token', res.access_token);
    this.isLoggedIn.set(true);

    if (res.user) {
      this.currentUser.set(res.user);
      localStorage.setItem('user_data', JSON.stringify(res.user));
    }
  }

  private clearTokens() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');

    this.isLoggedIn.set(false);
    this.currentUser.set(null);
  }

  getAccessToken() {
    return localStorage.getItem('access_token');
  }

  refreshToken() {
    return this.http.post<{ access_token: string }>(
      `${this.api}/refresh`,
      {}
    ).pipe(
      tap(res => {
        localStorage.setItem('access_token', res.access_token);
      })
    );
  }

  loadUserIfNeeded() {
    if (this.getAccessToken() && !this.userSubject.value) {
      this.getProfile().subscribe({
        error: () => this.clearTokens()
      });
    }
  }
}
