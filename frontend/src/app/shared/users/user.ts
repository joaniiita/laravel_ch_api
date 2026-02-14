import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminUserService {
  private basePath = 'http://127.0.0.1:8000/api/admin';
  private http = inject(HttpClient);

  index():Observable<any>{
    return this.http.get(`${this.basePath}/users`);
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
