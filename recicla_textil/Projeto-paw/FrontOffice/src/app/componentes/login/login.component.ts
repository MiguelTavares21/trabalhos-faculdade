import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  momentForm!: FormGroup;
  modalVisible: boolean = false;

  constructor(
    private loginService: LoginService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.momentForm = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  getEmail() {
    return this.momentForm.get('email')!;
  }

  getPassword() {
    return this.momentForm.get('password')!;
  }

  onLogin() {
    if (this.momentForm.invalid) {
      return;
    }

    const email = this.getEmail().value;
    const password = this.getPassword().value;

    this.loginService.login(email, password).subscribe(
      (res: any) => {
        if (res.result) {
          this.authService.setToken(res.token);
          if (this.authService.getRole() === 'doador') {
            this.router.navigate(['/user']);
          } else if (this.authService.getRole() === 'entidade') {
            if (res.isAccepted === 'aceite') {
              this.router.navigate(['/entidade']);
            } else {
              this.openDialog(
                'A sua conta ainda não foi aceite. Por favor, aguarde a aprovação.'
              );
            }
          } else {
            this.openDialog(
              'Esta conta só tem acesso ao <a href="http://localhost:3000/login">Backoffice</a>'
            );
          }
        }
      },
      (error) => {
        let errorMessage = 'Ocorreu um erro desconhecido.';
        if (error.status === 404) {
          errorMessage = 'Email não encontrado';
        } else if (error.status === 401) {
          errorMessage = 'Password incorreta';
        } else if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        this.openDialog(errorMessage);
      }
    );
  }

  openDialog(message: string): void {
    this.dialog.open(MessageDialogComponent, {
      data: { message: message },
    });
  }

  openAccountTypeModal(): void {
    this.modalVisible = true;
  }

  closeAccountTypeModal(): void {
    this.modalVisible = false;
  }

  createUserAccount(): void {
    this.router.navigate(['/createUser']);
    this.closeAccountTypeModal();
  }

  createEntityAccount(): void {
    this.router.navigate(['/createEntity']);
    this.closeAccountTypeModal();
  }

  togglePasswordVisibility(): void {
    const passwordInput = document.getElementById(
      'passwordInput'
    ) as HTMLInputElement;
    const togglePasswordIcon = document.getElementById(
      'togglePasswordIcon'
    ) as HTMLElement;

    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      togglePasswordIcon.classList.remove('fa-eye');
      togglePasswordIcon.classList.add('fa-eye-slash');
    } else {
      passwordInput.type = 'password';
      togglePasswordIcon.classList.remove('fa-eye-slash');
      togglePasswordIcon.classList.add('fa-eye');
    }
  }
}