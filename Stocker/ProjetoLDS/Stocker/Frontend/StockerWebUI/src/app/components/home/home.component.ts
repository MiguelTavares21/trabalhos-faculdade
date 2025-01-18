import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

/**
 * Componente responsável por exibir a lista de grupos do utilizador autenticado.
 * Permite a navegação para os detalhes de um grupo específico ou para a página inicial.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  /**
   * Lista de grupos associados ao utilizador autenticado.
   */
  groups: any[] = [];

  /**
   * @param userService Serviço para obter dados do utilizador, incluindo os grupos.
   * @param router Serviço de roteamento para navegação entre páginas.
   */
  constructor(private userService: UserService, private router: Router) {}

  /**
   * - Carrega os grupos do utilizador utilizando o serviço `UserService`, quando o componente é inicializado.
   */
  ngOnInit(): void {
    this.userService.getUserGroups().subscribe({
      next: (groups) => {
        this.groups = groups;
      },
      error: (error) => {
        console.error('Erro ao carregar os grupos:', error);
      },
    });
  }

  /**
   * Navega para a página de detalhes de um grupo específico.
   * - O ID do grupo selecionado é armazenado no `localStorage`.
   * - Em seguida, redireciona o utilizador para a rota de detalhes do grupo.
   *
   * @param groupId O identificador do grupo para o qual o utilizador deseja navegar.
   */
  navigateToGroup(groupId: string): void {
    localStorage.setItem('selectedGroupId', groupId);

    this.router.navigate(['/group']);
  }

  /**
   * Navega para a página inicial da aplicação.
   */
  navigateToInitialPage() {
    this.router.navigate(['/initialPage']);
  }
}
