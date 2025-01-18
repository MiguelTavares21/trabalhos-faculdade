/**
 * Guarda de navegação que verifica se o utilizador tem um grupo selecionado válido antes de permitir o acesso a uma rota.
 *
 * Este guard é útil quando é necessário garantir que o utilizador tenha um grupo selecionado antes de acessar páginas
 * que exigem informações específicas sobre um grupo.
 */
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { Observable, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

/**
 * A função selectedGroupGuard é uma função do tipo CanActivateFn que verifica se o user possui um grupo selecionado
 * e se esse grupo está associado ao user. Se um grupo válido for encontrado, a navegação é permitida; caso contrário,
 * o utilizador é redirecionado para a página inicial (/home).
 *
 * Este guard é ideal para rotas que dependem de um grupo selecionado e onde é necessário validar se o grupo está presente
 * e é válido para o user antes de permitir a navegação.
 */
export const selectedGroupGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userService = inject(UserService);

  // Verifica se existe um 'selectedGroupId' no localStorage
  const selectedGroupId = localStorage.getItem('selectedGroupId');
  if (selectedGroupId === null) {
    // Redirecionar se não existir 'selectedGroupId'
    router.navigate(['/home']);
    return of(false); // Retorna um Observable com 'false' para bloquear navegação
  }

  // Caso contrário, obtemos os grupos do utilizador
  return userService.getUserGroups().pipe(
    switchMap((groups) => {
      const groupId = parseInt(selectedGroupId, 10);
      const group = groups.find((g) => g.id === groupId);

      if (group) {
        // Se o grupo for encontrado, permite navegação
        return of(true);
      } else {
        // Se o grupo não for encontrado, redireciona e bloqueia navegação
        router.navigate(['/home']);
        return of(false);
      }
    }),
    catchError(() => {
      // Caso ocorra erro ao ir buscar os grupos, redireciona e bloqueia navegação
      router.navigate(['/home']);
      return of(false); // Bloqueia a navegação
    })
  );
};
