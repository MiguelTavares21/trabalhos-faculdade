import { AuthService } from './../../services/auth.service';
import { GroupService } from './../../services/group.service';
import { Component, OnInit } from '@angular/core';
import { Group } from '../../models/group';
import { CommonModule } from '@angular/common';
import { Role, UserInGroup } from '../../models/userInGroup';
import { Router } from '@angular/router';

/**
 * Componente responsável por exibir os detalhes de um grupo, gerenciar membros,
 * e realizar ações como sair do grupo, editar ou apagar o grupo.
 */
@Component({
  selector: 'app-group',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './group.component.html',
  styleUrl: './group.component.css',
})
export class GroupComponent implements OnInit {
  /**
   * Dados do grupo carregado.
   */
  group!: Group;

  /**
   * Lista de utilizadores do grupo, incluindo roles.
   */
  users: UserInGroup[] = [];

  /**
   * Estado de carregamento da página.
   */
  loading: boolean = true;

  /**
   * Mensagem de erro em caso de falha nas operações.
   */
  error: string | null = null;

  /**
   * Papel do utilizador no grupo (e.g., Admin, User).
   */
  userRole: String = '';

  /**
   * Indica se o modal de confirmação está visível.
   */
  showModal = false;

  /**
   * Define o tipo de ação para o modal de confirmação: "leave" ou "delete".
   */
  modalType: 'leave' | 'delete' = 'leave';

  /**
   * ID do utilizador atual.
   */
  userId: number = 0;

  /**
   * @param groupService Serviço para operações relacionadas aos grupos.
   * @param authService Serviço de autenticação para obter o ID do utilizador.
   * @param router Serviço de roteamento para navegação entre páginas.
   */
  constructor(
    private groupService: GroupService,
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Inicializa o componente:
   * - Obtém o ID do grupo e do utilizador.
   * - Carrega os detalhes do grupo, os membros e o papel do utilizador no grupo.
   */
  ngOnInit(): void {
    const id = this.authService.getUserId();

    if (id) {
      this.userId = parseInt(id, 10);

      const groupId = localStorage.getItem('selectedGroupId');
      if (!groupId) {
        this.error = 'ID do grupo não encontrado em localStorage!';
        this.loading = false;
        return;
      }
      this.fetchGroupDetails(+groupId);
      this.fetchGroupUsers(+groupId);
      this.fetchUserRole(+groupId, this.userId);
    }
  }

  /**
   * Carrega os detalhes do grupo.
   * @param groupId ID do grupo a ser carregado.
   */
  fetchGroupDetails(groupId: number): void {
    this.groupService.getGroup(groupId).subscribe({
      next: (group: Group) => {
        this.group = group;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar informações do grupo.';
        console.error(err);
        this.loading = false;
      },
    });
  }

  /**
   * Carrega a lista de membros do grupo.
   * @param groupId ID do grupo cujos membros serão carregados.
   */
  fetchGroupUsers(groupId: number): void {
    this.groupService.getGroupUsers(groupId).subscribe({
      next: (users: UserInGroup[]) => {
        this.users = users;
      },
      error: (err) => {
        this.error = 'Erro ao carregar os membros do grupo.';
        console.error(err);
      },
    });
  }

  /**
   * Obtém o papel do utilizador atual no grupo.
   * @param groupId ID do grupo.
   * @param userId ID do utilizador.
   */
  fetchUserRole(groupId: number, userId: number): void {
    this.groupService.getUserRole(groupId, userId).subscribe({
      next: (response) => {
        this.userRole = response.role;
      },
      error: (err) => {
        this.error = 'Erro ao carregar o papel do utilizador no grupo.';
        console.error(err);
      },
    });
  }

  /**
   * Retorna uma descrição textual para o papel do utilizador.
   * @param role Papel do utilizador no grupo.
   * @returns Descrição textual do papel.
   */
  getRoleDescription(role: Role): string {
    switch (role) {
      case Role.Admin:
        return 'Administrador';
      case Role.User:
        return 'Utilizador';
      default:
        return 'Desconhecido';
    }
  }

  /**
   * Solicita ao serviço que o utilizador atual saia do grupo.
   */
  leaveGroup() {
    const groupId = localStorage.getItem('selectedGroupId');
    if (!groupId) {
      this.error = 'ID do grupo não encontrado em localStorage!';
      this.loading = false;
      return;
    } else {
      this.groupService.leaveGroup(+groupId).subscribe({
        next: (response) => {
          alert('Você saiu do grupo!');
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error('Erro ao sair do grupo:', err);
          alert('Não foi possível sair do grupo. Tente novamente.');
        },
      });
    }
  }

  /**
   * Solicita ao serviço que o grupo seja apagado.
   */
  deleteGroup() {
    const groupId = localStorage.getItem('selectedGroupId');
    if (!groupId) {
      this.error = 'ID do grupo não encontrado em localStorage!';
      this.loading = false;
      return;
    } else {
      this.groupService.deleteGroup(+groupId).subscribe({
        next: (response) => {
          alert('Você apagou o grupo.');
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error('Erro ao remover o grupo:', err);
          alert('Não foi possível remover o grupo. Tente novamente.');
        },
      });
    }
  }

  /**
   * Solicita ao serviço a alteração do papel de um membro no grupo.
   * @param userId ID do utilizador cujo papel será alterado.
   */
  changeRole(userId: number): void {
    const groupId = localStorage.getItem('selectedGroupId');
    if (!groupId) {
      this.error = 'ID do grupo não encontrado em localStorage!';
      this.loading = false;
      return;
    } else {
      this.groupService.changeRole(+groupId, userId).subscribe({
        next: (response) => {
          this.fetchGroupUsers(+groupId);
        },
        error: (err) => {
          console.log(err.error);
          alert('Não foi possível mudar a role. Tente novamente.');
        },
      });
    }
  }

  /**
   * Solicita ao serviço a remoção de um membro do grupo.
   * @param userId ID do membro a ser removido.
   */
  removeMember(userId: number): void {
    const groupId = localStorage.getItem('selectedGroupId');
    if (!groupId) {
      this.error = 'ID do grupo não encontrado em localStorage!';
      this.loading = false;
      return;
    } else {
      this.groupService.removeMember(+groupId, userId).subscribe({
        next: (response) => {
          this.fetchGroupUsers(+groupId);
        },
        error: (err) => {
          console.log(err.error);
          alert('Não foi possível remover o membro. Tente novamente.');
        },
      });
    }
  }

  /**
   * Abre o modal de confirmação para sair do grupo.
   */
  confirmLeaveGroup() {
    this.modalType = 'leave';
    this.showModal = true;
  }

  /**
   * Abre o modal de confirmação para excluir o grupo.
   */
  confirmDeleteGroup() {
    this.modalType = 'delete';
    this.showModal = true;
  }

  /**
   * Executa a ação de sair ou excluir o grupo, dependendo do tipo de ação confirmada.
   * @param confirm Indica se o utilizador confirmou a ação.
   */
  confirmAction(confirm: boolean) {
    this.showModal = false;
    if (confirm) {
      if (this.modalType === 'leave') {
        this.leaveGroup();
      } else if (this.modalType === 'delete') {
        this.deleteGroup();
      }
    }
  }

  /**
   * Redireciona o utilizador para a página de edição do grupo.
   */
  editGroup() {
    this.router.navigate(['/edit-group']);
  }
}
