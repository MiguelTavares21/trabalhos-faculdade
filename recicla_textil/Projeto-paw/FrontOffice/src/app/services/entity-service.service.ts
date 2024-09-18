import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EntityService {

  constructor(private http: HttpClient) {}

  getEntities(): Observable<any> {
    return this.http.get<any>('http://localhost:3000/users2/ver_todas_entidades2');
  }

  getEntity(): Observable<any> {
    return this.http.get<any>('http://localhost:3000/users2/getEntity');
  } 

  updateEntity(formData: FormData): Observable<any> {
    return this.http.put<any>('http://localhost:3000/users2/updateEntity', formData);
  } 

}
