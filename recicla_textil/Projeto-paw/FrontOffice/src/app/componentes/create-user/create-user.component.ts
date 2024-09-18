import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css',
})
export class CreateUserComponent implements OnInit {
  doadorForm!: FormGroup;
  imageUrl!: string | ArrayBuffer | null;
  imageFile!: File;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.doadorForm = this.fb.group({
      nome: ['', Validators.required],
      apelido: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
        ],
      ],
      password: ['', Validators.required],
      nif: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      morada: ['', Validators.required],
      codigoAngariador: ['', Validators.required],
      codigoAngariadorConvidado: [''],
      contacto: ['', [Validators.pattern('^[9][0-9]{8}$')]],
      fotoPerfil: [''],
    });
  }

  getName() {
    return this.doadorForm.get('nome')!;
  }

  getApelido() {
    return this.doadorForm.get('apelido')!;
  }

  getEmail() {
    return this.doadorForm.get('email')!;
  }

  getPassword() {
    return this.doadorForm.get('password')!;
  }

  getNif() {
    return this.doadorForm.get('nif')!;
  }

  getMorada() {
    return this.doadorForm.get('morada')!;
  }

  getCodigoAngariador() {
    return this.doadorForm.get('codigoAngariador')!;
  }

  getcodigoAngariadorConvidado() {
    return this.doadorForm.get('codigoAngariadorConvidado');
  }

  getContacto() {
    return this.doadorForm.get('contacto')!;
  }

  onSubmit(): void {
    if (this.doadorForm.invalid) {
      return;
    }

    const formData = new FormData();
    Object.keys(this.doadorForm.controls).forEach((key) => {
      formData.append(key, this.doadorForm.get(key)!.value);
    });

    if (this.imageFile) {
      formData.append('fotoPerfil', this.imageFile);
    }

    this.loginService.criarDoador(formData).subscribe(
      (res: any) => {
        console.log(res);
        if (res.message === 'Doador criado com sucesso') {
          this.openDialog('Doador criado com sucesso');
          this.router.navigate(['/login']);
        }
      },
      (error) => {
        console.error('Erro ao criar doador', error);
        let errorMessage = 'Erro ao criar doador';
        if (error.error && error.error.error) {
          errorMessage = error.error.error;
        } else if (error.status === 500) {
          errorMessage = 'Ocorreu um erro no servidor';
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

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.imageFile = file;

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageUrl = reader.result;
      };
    }
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