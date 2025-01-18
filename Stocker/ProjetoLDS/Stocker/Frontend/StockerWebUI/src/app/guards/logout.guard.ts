/**
 * Guarda de logout que realiza a ação de desautenticar o utilizador e, em seguida, permite o acesso à rota.
 * 
 * Este guard é útil quando queremos garantir que o utilizador seja desautenticado antes de acessar uma rota específica,
 * como ao tentar acessar a página de login ou de logout.
 */
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

/**
 * A função logoutGuard é uma função do tipo CanActivateFn que impede o acesso a rotas sem antes desautenticar o utilizador.
 * Ela chama o método `logout()` do serviço de autenticação e, após realizar o logout, permite o acesso à rota.
 * 
 * Este guard é utilizado quando o utilizador precisa ser desautenticado (logout) antes de acessar certas páginas,
 * como, por exemplo, páginas de login ou uma rota específica de saída.
 * 
 * A injeção de dependência é feita usando a função `inject()` para obter o serviço `AuthService`.
 */
export const logoutGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);

  authService.logout();
  return true;
};
