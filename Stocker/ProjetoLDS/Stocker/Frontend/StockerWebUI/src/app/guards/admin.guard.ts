/**
 * Guarda de rota que verifica se o utilizador tem permissão de Administrador para acessar a rota.
 *
 * Caso o utilizador não tenha a role de "Admin", ou se não for possível determinar o user logado
 * ou o grupo selecionado, o acesso à rota é negado, redirecionando o user para a página inicial ou de login.
 *
 * Este guard é utilizado em rotas que requerem a confirmação do papel de administrador do utilizador.
 *
 * Utiliza o serviço `GroupService` para obter a role do utilizador dentro de um grupo específico,
 * e o serviço `AuthService` para verificar se o utilizador está logado.
 */
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { GroupService } from '../services/group.service';
import { map, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Função que controla o acesso à rota, verificando se o user possui a role de "Admin"
 * dentro do grupo selecionado. Caso contrário, redireciona o user para a página inicial ou login.
 */
export const adminGuard: CanActivateFn = (route, state) => {
  // Injeção dos serviços necessários
  const router = inject(Router);
  const groupService = inject(GroupService);
  const authService = inject(AuthService);

   // Verifica se o ID do user está presente no serviço de autenticação
  const id = authService.getUserId();
  if (!id) {
    // Se não estiver logado, redireciona para a página inicial
    router.navigate(['/home']);
    return of(false);// Impede o acesso à rota
  }

  // Converte o ID do user para um número
  const userId = parseInt(id, 10);

  // Verifica se existe um grupo selecionado no localStorage
  const selectedGroupId = localStorage.getItem('selectedGroupId');
  if (selectedGroupId === null) {
    // Se não houver grupo selecionado, redireciona para a página inicial
    router.navigate(['/home']);
    return of(false);
  }

  const groupId = parseInt(selectedGroupId, 10);

   // Chama o método getUserRole do GroupService para verificar o papel do user no grupo selecionado
  return groupService.getUserRole(groupId, userId).pipe(
    map((response) => {
      if (response.role === 'Admin') {
        // Se a role do utilizador for 'Admin', permite o acesso à rota
        return true;
      } else {
        router.navigate(['/login']);
        return false; // Impede o acesso à rota
      }
    })
  );
};
