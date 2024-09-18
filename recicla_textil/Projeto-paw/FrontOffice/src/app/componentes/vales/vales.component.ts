import { Component } from '@angular/core';
import { HeaderUserComponent } from '../header-user/header-user.component';
import { ValesService } from '../../services/vales.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';

@Component({
  selector: 'app-vales',
  standalone: true,
  imports: [HeaderUserComponent, CommonModule, FormsModule],
  templateUrl: './vales.component.html',
  styleUrl: './vales.component.css',
})
export class ValesComponent {
  vales: any[] = [];
  filteredVales: any[] = [];
  searchTerm: string = '';
  valesExistance: any;
  selectedVale: any = null;
  modalVisible: boolean = false;

  constructor(
    private valesService: ValesService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.valesService.getVales().subscribe((data) => {
      this.vales = data.vales;
      if (this.vales.length !== 0) {
        this.valesExistance = true;
      } else {
        this.valesExistance = false;
      }
      this.filterVales();
    });
  }

  getImage(vale: any): string {
    return this.constructImageUrl(vale.fotos);
  }

  constructImageUrl(fotoDoacaoPath: string): string {
    const baseUrl = 'http://localhost:3000';
    return `${baseUrl}/${fotoDoacaoPath}`;
  }

  filterVales(): void {
    if (!this.searchTerm) {
      this.filteredVales = this.vales;
    } else {
      this.filteredVales = this.vales.filter((vale) =>
        vale.empresa.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  abrirModalDetalhes(vale: any): void {
    this.selectedVale = vale;
    this.modalVisible = true;
  }

  fecharModal(): void {
    this.modalVisible = false;
  }

  resgatarVale(vale: string): void {
    this.fecharModal();
    this.valesService.resgatarVale(vale).subscribe(
      (res: any) => {
        console.log('entrei no put request');
        this.openDialog(
          'Vale resgatado com sucesso, este é o seu código: 123'
        );
        this.router.navigate(['user/vales']);
      },
      (error) => {
        console.error('Erro ao resgatar vale', error);
        this.openDialog(error.error.error);
        let errorMessage = 'Erro ao resgatar vale';
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
}
