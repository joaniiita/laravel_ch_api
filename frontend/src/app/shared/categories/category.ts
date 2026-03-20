import {inject, Injectable, signal} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Category} from '../../models/category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private basePath = 'http://127.0.0.1:8000/api/admin';
  private http = inject(HttpClient);

  private readonly _categories = signal<Category[]>([]);
  readonly categories = this._categories.asReadonly();

  index():Observable<any>{
    return this.http.get(`${this.basePath}/categories`);
  }

  getCategories() : void {
    this.http.get<Category[]>(`${this.basePath}/categories`).subscribe({
      next: (response) => this._categories.set(response),
    });
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
