import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

/**
 * Componente responsável por permitir que um utilizador insira um código de acesso para ingressar em um grupo.
 */
@Component({
  selector: 'app-join-group',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './join-group.component.html',
  styleUrl: './join-group.component.css',
})
export class JoinGroupComponent {
  /**
   * Evento emitido ao fechar o popup.
   */
  @Output() close = new EventEmitter<void>();

  /**
   * Código de acesso inserido pelo utilizador para ingressar no grupo.
   */
  accessCode: string = '';

  /**
   * Mensagem de erro exibida ao utilizador, caso ocorra um problema ao ingressar no grupo.
   */
  errorMessage: string = '';

  /**
   * @param userService Serviço utilizado para gerenciar as interações relacionadas ao utilizador, incluindo o ingresso em grupos.
   * @param router Serviço de roteamento para redirecionar o utilizador após ingressar no grupo.
   */
  constructor(private userService: UserService, private router: Router) {}

  /**
   * Método responsável por validar e processar a tentativa de ingresso em um grupo.
   * - Caso o código de acesso seja válido, o utilizador é redirecionado para a página principal.
   * - Caso contrário, uma mensagem de erro é exibida.
   */
  joinGroup() {
    if (!this.accessCode.trim()) {
      console.error('Código de acesso é obrigatório.');
      this.errorMessage = 'Código de acesso é obrigatório.';
      return;
    }

    this.userService.joinGroup(this.accessCode).subscribe({
      next: (response) => {
        console.log('Sucesso:', response);
        this.router.navigate(['/home']);
        this.closePopup();
      },
      error: (error) => {
        if (error.status === 400) {
          this.errorMessage = error.error;
        } else {
          this.errorMessage = 'Código inválido. Por favor, tente novamente.';
        }
      },
    });
    console.log('Código inserido:', this.accessCode);
  }

  /**
   * Método responsável por fechar o popup de ingresso no grupo.
   * - Emite o evento `close` para notificar o componente pai.
   */
  closePopup() {
    this.close.emit();
  }
}
