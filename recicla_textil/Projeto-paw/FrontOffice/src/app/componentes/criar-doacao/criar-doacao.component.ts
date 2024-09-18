import { Component, OnInit } from '@angular/core';
import { HeaderUserComponent } from '../header-user/header-user.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';
import { EntityService } from '../../services/entity-service.service';
import { DoacaoService } from '../../services/doacao.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-criar-doacao',
  standalone: true,
  imports: [HeaderUserComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './criar-doacao.component.html',
  styleUrls: ['./criar-doacao.component.css'],
})
export class CriarDoacaoComponent implements OnInit {
  doacaoForm!: FormGroup;
  imageUrl!: string | ArrayBuffer | null;
  imageFile!: File;
  entidades: any[] = [];
  nomeEntidadeParam: string = '';
  minDate: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private entityService: EntityService,
    private doacaoService: DoacaoService,
    private authService: AuthService
  ) {

    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);
    this.minDate = `${year}-${month}-${day}`;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.nomeEntidadeParam = params['nomeEntidade'];
      this.initializeForm();
    });

    this.entityService.getEntities().subscribe((data) => {
      this.entidades = data.entidades;
    });
  }

  initializeForm(): void {
    this.doacaoForm = this.fb.group({
      entidade: [this.nomeEntidadeParam || '', Validators.required],
      pecasCrianca: [0, [Validators.required, Validators.min(0)]],
      pecasAdolescente: [0, [Validators.required, Validators.min(0)]],
      pecasAdulto: [0, [Validators.required, Validators.min(0)]],
      pecasTipoInterior: [0, [Validators.required, Validators.min(0)]],
      pecasTipoTronco: [0, [Validators.required, Validators.min(0)]],
      pecasTipoInferior: [0, [Validators.required, Validators.min(0)]],
      pecasTipoCalcado: [0, [Validators.required, Validators.min(0)]],
      estadoRoupa: ['Usado', Validators.required],
      kilos: [0, [Validators.required, Validators.min(0)]],
      data: [Date.now(), [Validators.required]],
      fotos: ['', Validators.required],
    });
  }

  onFileSelected(event: any): void {
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

  onSubmit(): void {
    console.log('entrei em onSubmit');

    if (this.doacaoForm.invalid) {
      console.log('Formulário inválido:', this.doacaoForm);
      return;
    }

    console.log('entrei em onSubmit2');
    const formData = new FormData();
    Object.keys(this.doacaoForm.controls).forEach((key) => {
      formData.append(key, this.doacaoForm.get(key)!.value);
    });

    if (this.imageFile) {
      formData.append('fotos', this.imageFile);
    }

    //console.log('Form Data:', Array.from(formData.entries()));

    this.doacaoService.postDonation(formData).subscribe(
      (res: any) => {
        console.log('entrei no post request');
        this.openDialog('Pedido realizado com sucesso');
        this.router.navigate(['/user']);
      },
      (error) => {
        console.error('Erro ao criar doação', error);
        let errorMessage = 'Erro ao criar doação';
        if (error.error && error.error.error) {
          errorMessage = error.error.error;
        } else if (error.status === 500) {
          errorMessage = 'Ocorreu um erro no servidor';
        }
      }
    );
  }

  openDialog(message: string): void {
    this.dialog.open(MessageDialogComponent, {
      data: { message: message },
    });
  }

  getEntidade() {
    return this.doacaoForm.get('entidade')!;
  }

  getPecasCrianca() {
    return this.doacaoForm.get('pecasCrianca')!;
  }

  getPecasAdolescente() {
    return this.doacaoForm.get('pecasAdolescente')!;
  }

  getPecasAdulto() {
    return this.doacaoForm.get('pecasAdulto')!;
  }
  getPecasTipoInterior() {
    return this.doacaoForm.get('pecasTipoInterior')!;
  }

  getPecasTipoTronco() {
    return this.doacaoForm.get('pecasTipoTronco')!;
  }

  getPecasTipoInferior() {
    return this.doacaoForm.get('pecasTipoInferior')!;
  }

  getPecasTipoCalcado() {
    return this.doacaoForm.get('pecasTipoCalcado')!;
  }

  getEstadoRoupa() {
    return this.doacaoForm.get('estadoRoupa')!;
  }

  getKilos() {
    return this.doacaoForm.get('kilos')!;
  }

  getCodigoAngariador() {
    return this.doacaoForm.get('codigoAngariador')!;
  }

  getData() {
    return this.doacaoForm.get('data')!;
  }

  getFotos() {
    return this.doacaoForm.get('fotos')!;
  }

  getParamNomeEntidade() {
    return this.nomeEntidadeParam;
  }
  getEntidadesDataBase() {
    return this.entidades;
  }

  checkDonation() {
    if (
      this.checkDonationExistance() === 1 &&
      this.checkDonationMath() === 1 &&
      this.checkKilos() === 1
    ) {
      return 1;
    }
    return 0;
  }

  checkDonationExistance() {
    const pecasCrianca = this.getPecasCrianca().value || 0;
    const pecasAdolescente = this.getPecasAdolescente().value || 0;
    const pecasAdulto = this.getPecasAdulto().value || 0;
    const pecasTipoInterior = this.getPecasTipoInterior().value || 0;
    const pecasTipoTronco = this.getPecasTipoTronco().value || 0;
    const pecasTipoInferior = this.getPecasTipoInferior().value || 0;
    const pecasTipoCalcado = this.getPecasTipoCalcado().value || 0;

    if (
      pecasCrianca === 0 &&
      pecasAdolescente === 0 &&
      pecasAdulto === 0 &&
      pecasTipoInterior === 0 &&
      pecasTipoTronco === 0 &&
      pecasTipoInferior === 0 &&
      pecasTipoCalcado === 0
    ) {
      return 0;
    }
    return 1;
  }

  checkDonationMath(): number {
    const totalPecasEtaria =
      this.getPecasCrianca().value +
      this.getPecasAdolescente().value +
      this.getPecasAdulto().value;
    const totalPecasTipo =
      this.getPecasTipoInterior().value +
      this.getPecasTipoTronco().value +
      this.getPecasTipoInferior().value +
      this.getPecasTipoCalcado().value;

    return totalPecasEtaria === totalPecasTipo ? 1 : 0;
  }

  checkKilos() {
    const kilos = this.getKilos().value || 0;

    if (kilos === 0) {
      return 0;
    }
    return 1;
  }

  minDateValidator() {
    return (control: AbstractControl) => {
      const selectedDate = new Date(control.value);
      const min = new Date();
      return selectedDate >= min ? null : { minDate: true };
    };
  }
}
