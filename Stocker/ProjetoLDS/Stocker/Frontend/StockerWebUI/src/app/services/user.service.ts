/**
 * `UserService` é um serviço responsável por gerenciar as operações relacionadas ao utilizador.
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { User } from '../models/user';
import { Group } from '../models/group';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Método responsável por obter os grupos aos quais o utilizadores pertence.
   * Realiza uma requisição GET para buscar os grupos.
   *
   * @returns Observable<Group[]> - Um Observable que emite uma lista de objetos `Group`
   */
  getUserGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.apiUrl}/Users/getGroups`);
  }

  /**
   * Método responsável por obter os detalhes de um utilizador baseado no seu ID.
   * Realiza uma requisição GET para buscar os dados do utilizador.
   *
   * @param id - O ID do utilizador a ser buscado.
   * @returns Observable<User> - Um Observable que emite um objeto `User` com os detalhes do utilizador
   */
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/Users/${id}`);
  }

  /**
   * Método responsável por permitir que o utilizador entre em um grupo utilizando um código de acesso.
   * Realiza uma requisição POST com o código de acesso para o backend.
   *
   * @param accessCode - O código de acesso necessário para entrar no grupo.
   * @returns Observable<any> - Um Observable que emite a resposta do backend após a tentativa de entrar no grupo.
   */
  joinGroup(accessCode: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/Users/join-group`,
      JSON.stringify(accessCode),
      {
        headers: { 'Content-Type': 'application/json' },
        responseType: 'text',
      }
    );
  }

  /**
   * Método responsável por editar as informações do perfil de um utilizador.
   * Realiza uma requisição PUT para atualizar os dados do utilizador no backend.
   * 
   * @param account - Um objeto contendo os dados atualizados do utilizador
   * @returns Observable<User> - Um Observable que emite os dados atualizados do utilizador
   */
  editAccount(account: {
    name: string;
    email: string;
    notifications: boolean;
  }): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/Users/edit-account`, account);
  }

    /**
   * Método responsável por alterar a password do utilizador.
   * Realiza uma requisição PUT com as passes atuais e novas para o backend.
   * 
   * @param passes - Um objeto contendo a pass atual e a nova pass a ser configurada
   * @returns Observable<any> - Um Observable que emite a resposta do backend após a tentativa de alterar a pass
   */
  changePass(passes: { passAtual: string; novaPass: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/Users/change-password`, passes);
  }
}
