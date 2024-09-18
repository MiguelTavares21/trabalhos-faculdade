import { EntityService } from './../../services/entity-service.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';
import { HeaderEntityComponent } from '../header-entity/header-entity.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editar-entidade',
  standalone: true,
  imports: [HeaderEntityComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './editar-entidade.component.html',
  styleUrl: './editar-entidade.component.css'
})
export class EditarEntidadeComponent {
  entidadeForm!: FormGroup;
  imageUrl!: string | ArrayBuffer | null;
  imageFile!: File;
  multipleImages: { path: string, new: boolean }[] = [];
  multipleFiles: File[] = [];
  removedImages: string[] = [];

  constructor(private fb: FormBuilder, private entityService: EntityService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.entidadeForm = this.fb.group({
      nome: ['', Validators.required],
      descricao: ['', Validators.required],
      email: [''],
      passwordAtual: [''],
      passwordNova: [''],
      morada: ['', Validators.required],
      contacto: ['', [Validators.required, Validators.pattern('^[9][0-9]{8}$')]],
      fotoPerfil: [''],
      numeroDoacoes: [0],
    });
    this.loadUserData();
  }

  loadUserData(): void {
    this.entityService.getEntity().subscribe(
      (res: any) => {
        console.log(res);
        this.entidadeForm.patchValue({
          nome: res.nome,
          descricao: res.descricao,
          email: res.email,
          morada: res.morada,
          contacto: res.contacto,
          numeroDoacoes: res.numeroDoacoes,
        });
        this.imageUrl = this.constructImageUrl(res.fotoPerfil);
        this.multipleImages = res.fotos.map((foto: string) => ({
          path: this.constructImageUrl(foto),
          new: false
        }));
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

  onSubmit(): void {
    if (this.entidadeForm.invalid) {
      return;
    }

    const formData = new FormData();
    Object.keys(this.entidadeForm.controls).forEach(key => {
      if (key !== 'email' && key !== 'numeroDoacoes') {
        formData.append(key, this.entidadeForm.get(key)!.value);
      }
    });

    if (this.imageFile) {
      formData.append('fotoPerfil', this.imageFile);
    }

    this.multipleFiles.forEach((file, index) => {
      formData.append(`outrasFotos`, file);
    });

    formData.append('removedImages', JSON.stringify(this.removedImages));

    this.entityService.updateEntity(formData).subscribe(
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

  getName() {
    return this.entidadeForm.get('nome')!;
  }

  getDescricao() {
    return this.entidadeForm.get('descricao')!;
  }

  getMorada() {
    return this.entidadeForm.get('morada')!;
  }

  getContacto() {
    return this.entidadeForm.get('contacto')!;
  }

  constructImageUrl(fotoPerfilPath: string): string {
    const baseUrl = 'http://localhost:3000';
    return `${baseUrl}/${fotoPerfilPath}`;
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
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.multipleFiles.push(file);

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.multipleImages.push({ path: reader.result as string, new: true });
      };
    }
  }

  removeImage(index: number) {
    const image = this.multipleImages[index];
    if (!image.new) {
      this.removedImages.push(image.path);
    }
    this.multipleImages.splice(index, 1);
    if (image.new) {
      this.multipleFiles.splice(index - this.multipleImages.filter(img => !img.new).length, 1);
    }
  }
}
