import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { Group } from '../../models/group';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AlertComponent } from '../alert/alert.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

/**
 * Componente responsável por gerenciar as informações da conta do utilizador, incluindo detalhes pessoais
 * e atualização de password.
 */
@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [ReactiveFormsModule, AlertComponent, CommonModule],
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css'],
})
export class MyAccountComponent implements OnInit {
  /**
   * Dados do utilizador logado.
   */
  user!: User;

  /**
   * Total de grupos em que o utilizador participa.
   */
  totalGroups: number = 0;

  /**
   * Indica se o formulário de editar a password está visível.
   */
  showPasswordForm: boolean = false;

  /**
   * Formulário para edição de informações pessoais do utilizador.
   */
  editForm!: FormGroup;

  /**
   * Formulário para alteração de pass.
   */
  passwordForm!: FormGroup;

  /**
   * Lista de alertas exibidos no componente.
   */
  alerts: string[] = [];

  /**
   * @param authService Serviço responsável por informações de autenticação.
   * @param userService Serviço responsável por operações relacionadas aos utilizadores.
   * @param router Serviço utilizado para navegação entre páginas.
   */
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  /**
   * Inicializa os formulários, vai buscar os dados do utilizador e o total de grupos.
   */
  ngOnInit(): void {
    this.editForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      notifications: new FormControl(true, [Validators.required]),
    });

    this.passwordForm = new FormGroup({
      passAtual: new FormControl('', [Validators.required]),
      novaPass: new FormControl('', [Validators.required]),
      confirmPass: new FormControl('', [Validators.required]),
    });

    const id = this.authService.getUserId();
    if (id) {
      const userId = parseInt(id, 10);

      this.userService.getUserById(userId).subscribe((user: User) => {
        this.user = user;

        this.editForm.patchValue({
          name: user.name,
          email: user.email,
          notifications: !!user.notifications,
        });
      });

      this.userService.getUserGroups().subscribe((groups: Group[]) => {
        this.totalGroups = groups.length;
      });
    }
  }

  /**
   * Salva as alterações feitas nas informações pessoais do utilizador.
   * Redireciona para a página de login após o sucesso.
   */
  saveUserDetails() {
    if (this.editForm.valid) {
      const changes = this.editForm.value;
      this.userService.editAccount(changes).subscribe({
        next: (updateUser: User) => {
          this.addAlert('Conta atualizada com sucesso.');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.addAlert('Esse email já se encontra em uso!');
        },
      });
    } else {
      this.addAlert('Preencha todos os campos obrigatórios!');
    }
  }

  /**
   * Atualiza a pass do utilizador.
   * Verifica se as novas passes coincidem antes de enviar.
   */
  updatePassword() {
    if (this.passwordForm.valid) {
      if (
        this.passwordForm.value.novaPass !== this.passwordForm.value.confirmPass
      ) {
        this.addAlert('As passes não estão iguais!');
        return;
      }

      const credentials = {
        passAtual: this.passwordForm.value.passAtual,
        novaPass: this.passwordForm.value.novaPass,
      };
      this.userService.changePass(credentials).subscribe({
        next: (response) => {
          this.addAlert('Password atualizada com sucesso.');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.addAlert('A sua password atual está incorreta!');
        },
      });
    } else {
      this.addAlert('Erro a atualizar a password!');
    }
  }

  /**
   * Adiciona um alerta à lista de alertas exibidos.
   * @param message Mensagem do alerta.
   */
  addAlert(message: string) {
    if (!this.alerts.includes(message)) {
      this.alerts.push(message);
    }
  }

  /**
   * Remove um alerta da lista.
   * @param alert Mensagem do alerta a ser removida.
   */
  removeAlert(alert: string) {
    this.alerts = this.alerts.filter((a) => a !== alert);
  }

  /**
   * Alterna a visibilidade do formulário de alteração de pass.
   */
  togglePasswordForm() {
    this.showPasswordForm = !this.showPasswordForm;
  }

  /**
   * Confirma e salva os detalhes pessoais do utilizador.
   */
  confirmSaveDetails() {
    const confirmed = window.confirm(
      'Tem certeza de que deseja salvar as alterações?'
    );
    if (confirmed) {
      this.saveUserDetails();
    }
  }

  /**
   * Confirma e atualiza a password do utilizador.
   */
  confirmUpdatePassword() {
    const confirmed = window.confirm(
      'Tem certeza de que deseja atualizar a password?'
    );
    if (confirmed) {
      this.updatePassword();
    }
  }
}
