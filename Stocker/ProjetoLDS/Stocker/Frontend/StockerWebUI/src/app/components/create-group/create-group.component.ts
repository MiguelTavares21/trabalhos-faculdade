import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { GroupService } from '../../services/group.service';
import { AlertComponent } from '../alert/alert.component';

/**
Componente responsável pela criação de grupos.
Oferece um formulário para preencher os detalhes do grupo,
valida os dados e envia a requisição ao backend.
 */
@Component({
  selector: 'app-create-group',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, AlertComponent],
  templateUrl: './create-group.component.html',
  styleUrl: './create-group.component.css',
})
export class CreateGroupComponent {
  /**
   *Formulário reativo para capturar os detalhes do grupo.
    Contém os seguintes campos:
    - `name` (obrigatório): Nome do grupo.
    - `description` (opcional): Descrição do grupo.
    - `budget` (obrigatório): Orçamento do grupo, deve ser maior que 0.01.
   */
  createGroupForm!: FormGroup;

  /**
   *  Lista de mensagens de alerta para exibir ao usuário.
   */
  alerts: string[] = [];

  /**
   * @param groupService Serviço para realizar operações relacionadas aos grupos.
   * @param router Serviço para navegação entre páginas.
   * @param location Serviço para manipular o histórico de navegação.
   */
  constructor(
    private groupService: GroupService,
    private router: Router,
    private location: Location
  ) {}

  /**
   * Inicializa o formulário do componente com validações apropriadas.
   * Executado automaticamente quando o componente é inicializado.
   */
  ngOnInit(): void {
    this.createGroupForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      budget: new FormControl('', [Validators.required, Validators.min(0.01)]),
    });
  }

  /**
   * Método chamado ao enviar o formulário de criação de grupo.
   * Verifica se o formulário é válido, envia os dados ao serviço
   * `GroupService` e navega para a página inicial em caso de sucesso.
   * Caso contrário, exibe mensagens de erro.
   */
  onCreateGroup(): void {
    if (this.createGroupForm.valid) {
      const groupDetails = this.createGroupForm.value;
      this.groupService.createGroup(groupDetails).subscribe({
        next: (response) => {
          this.router.navigate(['/home']);
        },
        error: (error) => {
          this.addAlert('Erro ao criar o grupo. Tente novamente!');
        },
      });
    } else {
      this.addAlert('Por favor, preencha todos os campos obrigatórios!');
    }
  }

  /**
   * Adiciona uma mensagem de alerta à lista de alertas, caso ainda não exista.
   * @param message Mensagem de alerta a ser exibida.
   */
  addAlert(message: string) {
    if (!this.alerts.includes(message)) {
      this.alerts.push(message);
    }
  }

  /**
   * Remove uma mensagem de alerta da lista de alertas.
   * @param alert Mensagem de alerta a ser removida.
   */
  removeAlert(alert: string) {
    this.alerts = this.alerts.filter((a) => a !== alert);
  }

  /**
   * Fecha o formulário de criação de grupo e retorna à página anterior.
   */
  close() {
    this.location.back();
  }
}
