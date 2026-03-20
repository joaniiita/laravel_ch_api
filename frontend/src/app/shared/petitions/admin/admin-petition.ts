import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Petition} from '../../../models/petition';

@Injectable({
  providedIn: 'root',
})
export class AdminPetitionService {
  private basePath = 'http://127.0.0.1:8000/api/admin';
  private http = inject(HttpClient);

  private readonly _petitions = signal<Petition[]>([]);
  petitions = this._petitions.asReadonly();

  constructor() {
  }

  index(): Observable<any>{
    return this.http.get(`${this.basePath}/petitions`);
  }

  getPetition() : void {
    this.http.get<Petition[]>(`${this.basePath}/petitions`).subscribe({
      next: (response ) => {
        this._petitions.set(response);
      },
      error: (error) => {
        console.error('Error al obtener las peticiones:', error);
      },
    });
  }

  find(id: number): Observable<any>{
    return this.http.get(`${this.basePath}/petition/${id}`);
  }

  changeStatus(id: number, data: any): Observable<any>{
    return this.http.post(`${this.basePath}/petition/${id}/change`, data);
  }

  update(id: number, data:  FormData): Observable<any>{
    return this.http.post(`${this.basePath}/petition/${id}`, data);
  }

  delete(id: number): Observable<any>{
    return this.http.delete(`${this.basePath}/petition/${id}`);
  }

  create(data: FormData): Observable<any>{
    return this.http.post(`${this.basePath}/petition`, data);
  }
}
