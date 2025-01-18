/**
 * Interceptor HTTP que adiciona o token de autenticação nas requisições HTTP e trata erros de autenticação (401).
 * 
 * Esse interceptor é responsável por interceptar as requisições HTTP antes que elas sejam enviadas para o servidor, 
 * incluindo o token de autenticação no cabeçalho da requisição. Caso uma resposta de erro 401 (não autorizado) 
 * seja recebida, o utilizador será redirecionado para a página de login.
 */
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

/**
 * Interceptor que adiciona o token de autenticação (se presente) ao cabeçalho das requisições HTTP e trata
 * erros de autenticação (status 401). Se um erro 401 for detectado, o utilizador é redirecionado para a página de login.
 * 
 * @param req - A requisição HTTP original.
 * @param next - A função que permite passar a requisição para o próximo interceptor ou para a execução da requisição.
 * @returns - A requisição com o cabeçalho de autorização modificado e o fluxo de resposta ou erro tratado.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const service = inject(AuthService);
  const router = inject(Router);

  const authToken = localStorage.getItem('token');

  // Clone the request and add the authorization header
  const authReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${authToken}`),
  });

  return next(authReq).pipe(
    catchError((error, caught) => {
      if (error.status === 401) {
        console.log('Error 401');
        router.navigate(['/login']);
      }

      return throwError(() => error);
    })
  );
};
