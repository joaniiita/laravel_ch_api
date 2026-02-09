import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PetitionService {
  private basePath = 'http://127.0.0.1:8000/api';
  private http = inject(HttpClient);

  // #petitions = signal<Petition[]>([]);
  // loading = signal<boolean>(false);
  //
  // allPetitions = this.#petitions.asReadonly();
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

  update(id: number, data: FormData): Observable<any>{
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

  // fetchPetitions(): Observable<Petition[]> {
  //   this.loading.set(true);
  //   return this.http.get<{ data: Petition[] }>(`${this.basePath}/petitions`).pipe(
  //     map(res => res.data),
  //     tap(data => {
  //       this.#petitions.set(data);
  //       this.loading.set(false);
  //     })
  //   )
  // }
  //
  // getById(id: number): Observable<Petition> {
  //   return this.http.get<{ data: Petition }>(`${this.basePath}/petition/${id}`).pipe(
  //     map(res => res.data)
  //   )
  // }
  //
  // create(formData: FormData): Observable<any> {
  //   return this.http.post<{ data: Petition }>(`${this.basePath}/petition`, formData).pipe(
  //     tap(res => {
  //       this.#petitions.update(list => [res.data, ...list]);
  //     })
  //   )
  // }
  //
  // update(id: number, formData: FormData): Observable<any> {
  //   formData.append('_method', 'PUT');
  //
  //   return this.http.post<{data : Petition}>(`${this.basePath}/petition/${id}`, formData).pipe(
  //     tap( res => {
  //       this.#petitions.update(list => list.map(item => item.id === id ? res.data : item));
  //     })
  //   )
  // }
  //
  //
  //
  // delete(id: number): Observable<any> {
  //   return this.http.delete(`${this.basePath}/petition/${id}`).pipe(
  //     tap(() => this.#petitions.update(list => list.filter(item => item.id !== id)))
  //   )
  // }
  //
  // sign(id:number){
  //   return this.http.post<{ success: boolean, message: string }>(
  //     `${this.basePath}/petition/${id}/sign`,
  //     {}
  //   )
  // }

}
