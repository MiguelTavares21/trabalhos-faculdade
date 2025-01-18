import { Component } from '@angular/core';
import { JoinGroupComponent } from '../join-group/join-group.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

/**
 * Componente responsável por exibir a página inicial da aplicação.
 * Oferece opções para criar ou ingressar num grupo.
 */
@Component({
  selector: 'app-initial-page',
  standalone: true,
  imports: [JoinGroupComponent, CommonModule],
  templateUrl: './initial-page.component.html',
  styleUrl: './initial-page.component.css',
})
export class InitialPageComponent {
  /**
   * Indica se o popup para ingressar em um grupo está aberto.
   */
  isPopupOpen = false;

  /**
   * @param router Serviço de roteamento para navegação entre páginas.
   */
  constructor(private router: Router) {}

  /**
   * Abre o popup para permitir que o utilizador insira um código e se junte a um grupo.
   */
  openPopup() {
    this.isPopupOpen = true;
  }

  /**
   * Fecha o popup que permite que o utilizador se junte a um grupo.
   */
  closePopup() {
    this.isPopupOpen = false;
  }

  /**
   * Navega para a página de criação de um novo grupo.
   */
  goToCreateGroup() {
    this.router.navigate(['/createGroup']);
  }
}
