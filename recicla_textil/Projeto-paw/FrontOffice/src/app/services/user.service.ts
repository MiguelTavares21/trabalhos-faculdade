import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { authGuard } from '../guards/auth.guard';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

 
  getUser(): Observable<any> {
    return this.http.get<any>('http://localhost:3000/users2/getUser');
  }

  editarDoador(formData: FormData):Observable<any> {
    return this.http.put<any>('http://localhost:3000/users2/editarUser', formData);
  }

}
