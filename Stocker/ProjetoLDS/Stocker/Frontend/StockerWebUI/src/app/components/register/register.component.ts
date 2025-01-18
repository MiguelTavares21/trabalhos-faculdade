import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AlertComponent } from '../alert/alert.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, AlertComponent], // Importações necessárias para o funcionamento do componente
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css', '../login/login.component.css'],
})
export class RegisterComponent {
  /**
   * O formulário de registro que contém campos para o nome, email, senha e confirmação de senha.
   */
  registerForm!: FormGroup;

  /**
   * Lista de mensagens de alerta que podem ser exibidas no UI.
   */
  alerts: string[] = [];

  /**
   * Flag para controlar a visibilidade da senha no formulário.
   */
  passwordVisible: boolean = false;

  /**
   * Construtor que injeta os serviços necessários para o funcionamento do componente.
   * @param authService - Serviço de autenticação.
   * @param userService - Serviço de usuário.
   * @param router - Serviço de roteamento para navegar entre as páginas.
   */
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  /**
   * Inicializa o formulário com validações para os campos de entrada.
   */
  ngOnInit(): void {
    this.registerForm = new FormGroup({
      name: new FormControl('', [Validators.required]), // O campo nome é obrigatório
      email: new FormControl('', [Validators.required, Validators.email]), // O campo email é obrigatório e deve ser um email válido
      password: new FormControl('', [Validators.required]), // O campo senha é obrigatório
      passwordConfirmation: new FormControl('', [Validators.required]), // O campo de confirmação de senha é obrigatório
    });
  }

  /**
   * Método que lida com o envio do formulário de registro.
   */
  onRegister(): void {
    // Verifica se o formulário é válido
    if (this.registerForm.valid) {
      // Verifica se a senha e a confirmação de senha são iguais
      if (
        this.registerForm.value.password !==
        this.registerForm.value.passwordConfirmation
      ) {
        this.addAlert('Passwords do not match.'); // Exibe um alerta caso as senhas não coincidam
        return;
      }

      // Extrai as credenciais do formulário
      const credentials = this.registerForm.value;

      // Chama o serviço de autenticação para registrar o novo usuário
      this.authService.register(credentials).subscribe({
        next: (response) => {
          // Navega para a página de login após o registro bem-sucedido
          this.router.navigate(['/login']);
        },
        error: (error) => {
          // Exibe um alerta caso ocorra um erro no processo de registro
          this.addAlert('Error registering user.');
        },
      });
    }
  }

  /**
   * Adiciona uma mensagem de alerta à lista de alertas, se ainda não estiver presente.
   * @param message - A mensagem de alerta a ser adicionada.
   */
  addAlert(message: string) {
    if (!this.alerts.includes(message)) {
      this.alerts.push(message);
    }
  }

  /**
   * Remove uma mensagem de alerta da lista de alertas.
   * @param alert - A mensagem de alerta a ser removida.
   */
  removeAlert(alert: string) {
    this.alerts = this.alerts.filter((a) => a !== alert);
  }

  /**
   * Alterna a visibilidade da senha (de 'password' para 'text').
   */
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
    const passwordField: any = document.getElementById('password');
    passwordField.type = this.passwordVisible ? 'text' : 'password';
  }
}
