import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private basePath = 'http://127.0.0.1:8000/api/admin';
  private http = inject(HttpClient);

  index():Observable<any>{
    return this.http.get(`${this.basePath}/categories`);
  }

  find(id: number):Observable<any>{
    return this.http.get(`${this.basePath}/category/${id}`);
  }

  create(data: FormData):Observable<any>{
    return this.http.post(`${this.basePath}/category`, data);
  }

  update(id: number, data: FormData):Observable<any>{
    return this.http.post(`${this.basePath}/category/${id}`, data);
  }

  delete(id: number):Observable<any>{
    return this.http.delete(`${this.basePath}/category/${id}`);
  }
}
