import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { Group } from '../models/group';
import { UserInGroup } from '../models/userInGroup';

/**
 * `GroupService` é um serviço responsável por gerenciar as operações relacionadas aos grupos,
 */
@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Método responsável por criar um novo grupo.
   * Realiza uma requisição POST para o backend para criar o grupo com as informações fornecidas.
   *
   * @param group - Um objeto contendo o nome, descrição e orçamento do grupo.
   * @returns Observable<any> - Um Observable que emite a resposta do backend após a criação do grupo.
   */
  createGroup(group: {
    name: string;
    description: string;
    budget: number;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/Groups/create`, group);
  }

  /**
   * Método responsável por obter as informações de um grupo específico.
   * Realiza uma requisição GET para buscar os detalhes do grupo.
   *
   * @param groupId - O ID do grupo a ser buscado.
   * @returns Observable<Group> - Um Observable que emite o grupo com os detalhes.
   */
  getGroup(groupId: number): Observable<Group> {
    return this.http.get<Group>(`${this.apiUrl}/Groups/${groupId}`);
  }

  /**
   * Método responsável por obter os utilizadores de um grupo específico.
   * Realiza uma requisição GET para buscar os utilizadores do grupo.
   *
   * @param groupId - O ID do grupo.
   * @returns Observable<UserInGroup[]> - Um Observable que emite uma lista de utilizadores no grupo, incluindo o papel de cada um no grupo.
   */
  getGroupUsers(groupId: number): Observable<UserInGroup[]> {
    return this.http.get<UserInGroup[]>(
      `${this.apiUrl}/Groups/${groupId}/getUsers`
    );
  }

   /**
   * Método responsável por obter o papel (role) de um utilizador dentro de um grupo.
   * Realiza uma requisição GET para buscar o papel do utilizador no grupo.
   * 
   * @param groupId - O ID do grupo.
   * @param userId - O ID do utilizador.
   * @returns Observable<{ role: string }> - Um Observable que emite um objeto contendo o papel do utilizador no grupo.
   */
  getUserRole(groupId: number, userId: number): Observable<{ role: string }> {
    return this.http.get<{ role: string }>(
      `${this.apiUrl}/Groups/${groupId}/users/${userId}/role`
    );
  }

    /**
   * Método responsável por permitir que um utilizador saia de um grupo.
   * Realiza uma requisição DELETE para o backend para remover o utilizador do grupo.
   * 
   * @param groupId - O ID do grupo do qual o utilizador deseja sair.
   * @returns Observable<void> - Um Observable que emite um `void` após a remoção do utilizador.
   */
  leaveGroup(groupId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Groups/leave/${groupId}`);
  }

   /**
   * Método responsável por excluir um grupo.
   * Realiza uma requisição DELETE para o backend para remover o grupo.
   * 
   * @param groupId - O ID do grupo a ser excluído.
   * @returns Observable<void> - Um Observable que emite um `void` após a exclusão do grupo.
   */
  deleteGroup(groupId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/Groups/delete-group/${groupId}`
    );
  }


  /**
   * Método responsável por editar as informações de um grupo.
   * Realiza uma requisição PUT para atualizar os detalhes do grupo.
   * 
   * @param groupId - O ID do grupo a ser editado.
   * @param grupo - Um objeto contendo as novas informações do grupo (nome, descrição, orçamento).
   * @returns Observable<Group> - Um Observable que emite o grupo atualizado.
   */
  editGroup(
    groupId: number,
    grupo: { name: string; description: string; budget: number }
  ): Observable<Group> {
    return this.http.put<Group>(
      `${this.apiUrl}/Groups/edit-group/${groupId}`,
      grupo
    );
  }

   /**
   * Método responsável por mudar o papel (role) de um utilizador dentro de um grupo.
   * Realiza uma requisição PUT para atualizar o papel do utilizador.
   * 
   * @param groupId - O ID do grupo.
   * @param userId - O ID do utilizador.
   * @returns Observable<any> - Um Observable que emite a resposta do backend após a atualização do papel.
   */
  changeRole(groupId: number, userId: number): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/Groups/${groupId}/changeRole/${userId}`,
      {}
    );
  }

    /**
   * Método responsável por remover um membro de um grupo.
   * Realiza uma requisição DELETE para remover um utilizador do grupo.
   * 
   * @param groupId - O ID do grupo do qual o membro será removido.
   * @param userId - O ID do utilizador a ser removido.
   * @returns Observable<any> - Um Observable que emite a resposta do backend após a remoção do membro.
   */
  removeMember(groupId: number, userId: number): Observable<any> {
    return this.http.delete<any>(
      `${this.apiUrl}/Groups/${groupId}/remove-member/${userId}`
    );
  }
}
