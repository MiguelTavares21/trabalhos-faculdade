/**
 * `AuthService` é um serviço responsável por gerenciar a autenticação de utilizadores na aplicação.
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { jwtDecode } from 'jwt-decode';
import { customJwtPayload } from '../models/customJwtPayload';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Método responsável por autenticar o utilizador e obter um token de acesso.
   *
   * @param credentials - Um objeto contendo as credenciais do utilizador (email e password).
   * @returns Observable<any> - Um Observable que emite a resposta do backend com o token de autenticação.
   */
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/Users/login`, credentials);
  }

  /**
   * Método responsável por registrar um novo utilizador na aplicação.
   *
   * @param credentials - Um objeto contendo as credenciais do utilizador (email, password, nome, e confirmação de password).
   * @returns Observable<any> - Um Observable que emite a resposta do backend após o registro do utilizador.
   */
  register(credentials: {
    email: string;
    password: string;
    name: string;
    passwordConfirmation: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/Users/register`, credentials);
  }

  /**
   * Método responsável por realizar o logout do utilizador, removendo o token e outras informações do `localStorage`.
   *
   * @returns boolean | null - Retorna `true` se o logout foi bem-sucedido, ou `null` caso haja algum erro.
   */
  logout() {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('selectedGroupId');
      return true;
    } catch (error) {
      return null;
    }
  }

    /**
   * Método para definir o token JWT no `localStorage`.
   * 
   * @param token - O token JWT a ser armazenado.
   */
  setToken(token: string) {
    localStorage.setItem('token', token);
  }

    /**
   * Método para obter o token JWT armazenado no `localStorage`.
   * 
   * @returns string | null - Retorna o token se estiver armazenado, ou `null` caso contrário.
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Método para verificar se o token JWT está expirado.
   * 
   * @param decoded - O payload decodificado do token JWT.
   * @returns boolean - Retorna `true` se o token estiver expirado, ou `false` caso contrário.
   */
  isTokenExpired(decoded: any) {
    if (decoded === null) {
      return true;
    }

    try {
      const expiration = (decoded as any).exp;
      const now = Date.now() / 1000;
      return expiration < now;
    } catch (error) {
      return true;
    }
  }

   /**
   * Método para obter o ID do utilizador a partir do token JWT.
   * 
   * @returns string | null - Retorna o ID do utilizador decodificado do token, ou `null` caso o token não seja válido ou expirado.
   */
  getUserId() {
    const token = this.getToken();
    if (token === null) {
      return null;
    }

    try {
      const decoded = jwtDecode<customJwtPayload>(token);
      if (this.isTokenExpired(decoded)) {
        this.logout();
        return null;
      }

      return (
        decoded[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
        ] || null
      );
    } catch (error) {
      return null;
    }
  }
}
