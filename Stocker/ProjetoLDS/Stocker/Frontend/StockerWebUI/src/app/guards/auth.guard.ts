/**
 * Guarda de autenticação que verifica se o utilizador está autenticado antes de acessar uma rota.
 *
 * Caso o user não possua um token válido (indicando que não está autenticado),
 * ele será redirecionado para a página de login.
 *
 * Este guard é utilizado em rotas que devem ser acessadas apenas por utilizadores autenticados.
 */
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * A classe AuthGuard implementa a interface CanActivate para garantir que o utilizador tenha
 * um token válido antes de acessar a rota. Caso contrário, o utilizador será redirecionado para a página de login.
 *
 * A injeção de dependências inclui os serviços `AuthService` (para verificar se o utilizador está autenticado)
 * e `Router` (para redirecionar o utilizador quando necessário).
 */
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  /**
   * Construtor da classe AuthGuard. Recebe os serviços necessários como dependências.
   *
   * @param authService Serviço responsável pela autenticação do user.
   * @param router Serviço responsável pela navegação de rotas.
   */
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Método canActivate que é chamado antes de acessar a rota. Verifica se o utilizador possui um token de autenticação.
   * Se o token for encontrado, a navegação para a rota é permitida. Caso contrário, o utilizador é redirecionado para a página de login.
   *
   * @returns `true` se o utilizador estiver autenticado (possuir token), caso contrário retorna `false` e redireciona para o login.
   */
  canActivate(): boolean {
    if (this.authService.getToken()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
