import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LoginService } from '../../services/login.service';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-entity',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-entity.component.html',
  styleUrls: ['./create-entity.component.css']
})
export class CreateEntityComponent implements OnInit {
  entidadeForm!: FormGroup;
  imageUrl!: string | ArrayBuffer | null;
  imageFile!: File; 
  multipleImages: string[] = [];
  multipleFiles: File[] = [];

  constructor(private fb: FormBuilder, private loginService: LoginService, private router: Router, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.entidadeForm = this.fb.group({
      nome: ['', Validators.required],
      descricao: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
      password: ['', Validators.required],
      contacto: ['',[Validators.pattern('^[9][0-9]{8}$'), Validators.required]],
      morada: ['', Validators.required],
      fotoPerfil: ['', Validators.required]
    });
  }

  getName() {
    return this.entidadeForm.get('nome')!;
  }

  getDescricao() {
    return this.entidadeForm.get('descricao')!;
  }

  getEmail() {
    return this.entidadeForm.get('email')!;
  }

  getPassword() {
    return this.entidadeForm.get('password')!;
  }

  getContacto() {
    return this.entidadeForm.get('contacto')!;
  }

  getMorada() {
    return this.entidadeForm.get('morada')!;
  }

  getFotoPerfil(){
    return this.entidadeForm.get('fotoPerfil')!;
  }

  onSubmit(): void {
    if (this.entidadeForm.invalid) {
      return;
    }
  
    const formData = new FormData();
    Object.keys(this.entidadeForm.controls).forEach(key => {
      formData.append(key, this.entidadeForm.get(key)!.value);
    });
  
    if (this.imageFile) {
      formData.append('fotoPerfil', this.imageFile);
    }

    this.multipleFiles.forEach((file, index) => {
      formData.append(`fotos`, file, file.name);
    });
  
    this.loginService.criarEntidade(formData).subscribe(
      (res: any) => {
        console.log(res);
        if (res.message === 'Entidade criada com sucesso') {
          this.openDialog('Entidade criada com sucesso');
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
      data: { message: message }
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

  onMultipleFilesSelected(event: any) {
    const files: FileList = event.target.files;
    this.multipleFiles = [];
    this.multipleImages = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.multipleFiles.push(file);
      
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.multipleImages.push(reader.result as string);
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
