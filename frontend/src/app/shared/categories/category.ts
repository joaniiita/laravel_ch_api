import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private basePath = 'http://127.0.0.1:8000/api';
  private http = inject(HttpClient);

  index():Observable<any>{
    return this.http.get(`${this.basePath}/admin/categories`);
  }
}
