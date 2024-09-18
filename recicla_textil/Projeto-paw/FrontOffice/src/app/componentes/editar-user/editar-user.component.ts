import { Component } from '@angular/core';
import { HeaderUserComponent } from '../header-user/header-user.component';
import { OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-editar-user',
  standalone: true,
  imports: [HeaderUserComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './editar-user.component.html',
  styleUrl: './editar-user.component.css',
})
export class EditarUserComponent implements OnInit {
  doadorForm!: FormGroup;
  imageUrl!: string | ArrayBuffer | null;
  imageFile!: File;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.doadorForm = this.fb.group({
      nome: ['', Validators.required],
      apelido: ['', Validators.required],
      email: [''],
      passwordAtual: [''],
      passwordNova: [''],
      nif: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      morada: ['', Validators.required],
      contacto: ['', [Validators.pattern('^[9][0-9]{8}$')]],
      fotoPerfil: [''],
      numeroPontos: [0],
      numeroDoacoes: [0],
      codigoAngariador: [''],
    });
    this.loadUserData();
  }

  loadUserData(): void {
    this.userService.getUser().subscribe(
      (res: any) => {
        console.log(res);
        this.doadorForm.patchValue({
          nome: res.nome,
          apelido: res.apelido,
          email: res.email,
          nif: res.nif,
          morada: res.morada,
          contacto: res.contacto,
          numeroPontos: res.numeroPontos,
          numeroDoacoes: res.numeroDoacoes,
          codigoAngariador: res.codigoAngariador,
        });
        this.imageUrl = this.constructImageUrl(res.fotoPerfil);
      },
      (error) => {
        let errorMessage = 'Ocorreu um erro desconhecido.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        this.openDialog(errorMessage);
      }
    );
  }

  constructImageUrl(fotoPerfilPath: string): string {
    const baseUrl = 'http://localhost:3000';
    return `${baseUrl}/${fotoPerfilPath}`;
  }

  getName() {
    return this.doadorForm.get('nome')!;
  }

  getApelido() {
    return this.doadorForm.get('apelido')!;
  }

  getNif() {
    return this.doadorForm.get('nif')!;
  }

  getMorada() {
    return this.doadorForm.get('morada')!;
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
      if (!['email', 'numeroPontos', 'numeroDoacoes'].includes(key)) {
        formData.append(key, this.doadorForm.get(key)!.value);
      }
    });

    if (this.imageFile) {
      formData.append('fotoPerfil', this.imageFile);
    }

    this.userService.editarDoador(formData).subscribe(
      (res: any) => {
        this.openDialog('Conta editada com sucesso!');
      },
      (error) => {
        console.error('Erro ao editar doador', error);
        let errorMessage = 'Erro ao editar doador';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
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
}
