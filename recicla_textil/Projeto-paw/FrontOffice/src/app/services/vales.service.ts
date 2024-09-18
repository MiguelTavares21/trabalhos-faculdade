import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ValesService {
  constructor(private http: HttpClient) {}

  getVales(): Observable<any> {
    return this.http.get<any>('http://localhost:3000/vales2/verVales2');
  }

  resgatarVale(idVale: string): Observable<any> {
    return this.http.put<any>('http://localhost:3000/vales2/resgatarVales2', {idVale});
  }
}
