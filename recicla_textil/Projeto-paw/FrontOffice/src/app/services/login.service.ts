import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Doador } from '../Doador';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  login(email: string, password: string):Observable<any>{
    return this.http.post('http://localhost:3000/login2', { email, password });
  }

  criarDoador(doadorData: FormData): Observable<Doador> {
    return this.http.post<Doador>('http://localhost:3000/adicionar_doador2', doadorData);
  }

  criarEntidade(entidadeData: FormData): Observable<any> {
    return this.http.post<any>('http://localhost:3000/adicionar_entidade2', entidadeData);
  }

  
}
