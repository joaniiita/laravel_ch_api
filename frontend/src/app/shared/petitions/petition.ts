import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Petition} from '../../models/petition';

@Injectable({
  providedIn: 'root',
})
export class PetitionService {
  private basePath = 'http://127.0.0.1:8000/api';
  private http = inject(HttpClient);
  constructor() {
  }

  index(): Observable<any>{
    return this.http.get(`${this.basePath}/petitions`);
  }

  find(id: number): Observable<any>{
    return this.http.get(`${this.basePath}/petition/${id}`);
  }

  create(data: FormData): Observable<any>{
    return this.http.post(`${this.basePath}/petition`, data);
  }

  update(id: number, data: Petition): Observable<any>{

    return this.http.put(`${this.basePath}/petition/${id}`, data);
  }

  delete(id: number): Observable<any>{
    return this.http.delete(`${this.basePath}/petition/${id}`);
  }

  signPetition(id: number, data: FormData): Observable<any>{
    return this.http.post(`${this.basePath}/petition/${id}/sign`, data);
  }

  myPetitions(): Observable<any>{
    return this.http.get(`${this.basePath}/mypetitions`);
  }

  signedPetitions(): Observable<any>{
    return this.http.get(`${this.basePath}/signedPetitions`);
  }

}
