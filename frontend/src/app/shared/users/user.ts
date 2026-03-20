import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../../models/user';

@Injectable({
  providedIn: 'root',
})
export class AdminUserService {
  private basePath = 'http://127.0.0.1:8000/api/admin';
  private http = inject(HttpClient);

  private readonly _users = signal<User[]>([]);
  readonly users = this._users.asReadonly();

  index():Observable<any>{
    return this.http.get(`${this.basePath}/users`);
  }

  getUsers() : void {
    this.http.get<User[]>(`${this.basePath}/users`).subscribe({
      next: (response) => this._users.set(response),
      error: (error) => console.error('Error al obtener los usuarios:', error),
    });
  }

  find(id: number):Observable<any>{
    return this.http.get(`${this.basePath}/user/${id}`);
  }

  create(data: FormData):Observable<any>{
    return this.http.post(`${this.basePath}/user`, data);
  }

  update(id: number, data: FormData):Observable<any>{
    return this.http.post(`${this.basePath}/user/${id}`, data);
  }

  delete(id: number):Observable<any>{
    return this.http.delete(`${this.basePath}/user/${id}`);
  }
}
