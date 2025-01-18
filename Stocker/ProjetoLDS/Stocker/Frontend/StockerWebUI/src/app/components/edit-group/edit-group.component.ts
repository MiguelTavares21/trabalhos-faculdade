import { Component, OnInit } from '@angular/core';
import { AlertComponent } from '../alert/alert.component';
import { Group } from '../../models/group';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { GroupService } from '../../services/group.service';

/**
 * Componente responsável pela edição de informações de um grupo existente.
 * Carrega os dados do grupo selecionado, permite edições e envia as alterações ao backend.
 */
@Component({
  selector: 'app-edit-group',
  standalone: true,
  imports: [AlertComponent, ReactiveFormsModule],
  templateUrl: './edit-group.component.html',
  styleUrl: '../my-account/my-account.component.css',
})
export class EditGroupComponent implements OnInit {
  /**
   * Guarda os dados do grupo carregado para ser editado.
   */
  grupo!: Group;

  /**
   * Formulário reativo utilizado para editar os detalhes do grupo.
   * Campos:
   * - `name` (obrigatório): Nome do grupo.
   * - `description` (opcional): Descrição do grupo.
   * - `budget` (obrigatório): Orçamento do grupo, valor mínimo de 0.01.
   */
  editForm!: FormGroup;

  /**
   * Lista de mensagens de alerta exibidas no componente.
   */
  alerts: string[] = [];

  /**
   * @param authService Serviço responsável por informações de autenticação.
   * @param groupService Serviço responsável por operações relacionadas aos grupos.
   * @param router Serviço utilizado para navegação entre páginas.
   */
  constructor(
    private authService: AuthService,
    private groupService: GroupService,
    private router: Router
  ) {}

  /**
   * Método chamado ao inicializar o componente.
   * Configura o formulário, obtém o ID do grupo selecionado e carrega os dados.
   * Exibe mensagens de erro caso falhe ao identificar ou carregar o grupo.
   */
  ngOnInit(): void {
    this.editForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      budget: new FormControl('', [Validators.required, Validators.min(0.01)]),
    });

    const groupId = this.getSelectedGroupId();
    if (!groupId) {
      this.addAlert('Ocorreu um erro! Não foi possível identificar o grupo.');
      return;
    }

    this.groupService.getGroup(groupId).subscribe({
      next: (group: Group) => {
        this.grupo = group;
        this.editForm.patchValue({
          name: group.name,
          description: group.description,
          budget: group.budget,
        });
      },
      error: () => {
        this.addAlert('Ocorreu um erro ao carregar as informações do grupo!');
      },
    });
  }

  /**
   * Confirma a edição do grupo.
   * Valida os dados do formulário e envia as alterações ao serviço `GroupService`.
   * Mostra mensagens de erro ou sucesso conforme o resultado.
   */
  confirmEditGroup(): void {
    if (this.editForm.valid) {
      const changes = this.editForm.value;
      const groupId = this.getSelectedGroupId();

      if (!groupId) {
        this.addAlert('Ocorreu um erro! Não foi possível identificar o grupo.');
        return;
      }

      this.groupService.editGroup(groupId, changes).subscribe({
        next: (updateGropu: Group) => {
          this.addAlert('Grupo atualizada com sucesso.');
        },
        error: (error) => {
          this.addAlert('Ocorreu um erro ao editar o grupo!');
        },
      });
    } else {
      this.addAlert('Preencha todos os campos obrigatórios!');
    }
  }

  /**
   * Obtém o ID do grupo selecionado para edição.
   * O ID é recuperado do `localStorage`.
   * @returns {number | null} ID do grupo ou `null` se não for encontrado.
   */
  getSelectedGroupId(): number | null {
    const groupId = localStorage.getItem('selectedGroupId');
    return groupId ? +groupId : null;
  }

  /**
   * Adiciona uma mensagem de alerta à lista, se ela ainda não estiver presente.
   * @param message Mensagem de alerta a ser adicionada.
   */
  addAlert(message: string) {
    if (!this.alerts.includes(message)) {
      this.alerts.push(message);
    }
  }

  /**
   * Remove uma mensagem de alerta da lista.
   * @param alert Mensagem de alerta a ser removida.
   */
  removeAlert(alert: string) {
    this.alerts = this.alerts.filter((a) => a !== alert);
  }
}
