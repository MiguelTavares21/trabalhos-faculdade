import { Component, OnInit } from '@angular/core';
import { HeaderUserComponent } from '../header-user/header-user.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';
import { EntityService } from '../../services/entity-service.service';
import { FormsModule } from '@angular/forms';

declare var PayPal: any;

@Component({
  selector: 'app-check-entitys',
  standalone: true,
  imports: [HeaderUserComponent, CommonModule, FormsModule],
  templateUrl: './check-entitys.component.html',
  styleUrls: ['./check-entitys.component.css'],
})
export class CheckEntitysComponent implements OnInit {
  entidades: any[] = [];
  filteredEntities: any[] = [];
  searchTerm: string = '';
  selectedEntity: any = null;
  modalVisible: boolean = false;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private entityService: EntityService
  ) {}

  ngOnInit(): void {
    this.entityService.getEntities().subscribe((data) => {
      this.entidades = data.entidades;
      this.filterEntities();
    });

    this.loadPaypalScript();
  }

  loadPaypalScript(): void {
    const script = document.createElement('script');
    script.src = 'https://www.paypalobjects.com/donate/sdk/donate-sdk.js';
    script.charset = 'UTF-8';
    document.body.appendChild(script);
  }

  initializePaypalButton(): void {
    if (typeof PayPal !== 'undefined') {
      PayPal.Donation.Button({
        env: 'sandbox',
        hosted_button_id: '76AKYBNMKCNBA',
        image: {
          src: 'https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif',
          title: 'PayPal - The safer, easier way to pay online!',
          alt: 'Donate with PayPal button'
        },
        onComplete: (params: any) => {
          console.log('Donation completed:', params);
        },
      }).render('#paypal-donate-button-container');
    }
  }

  filterEntities(): void {
    if (!this.searchTerm) {
      this.filteredEntities = this.entidades;
    } else {
      this.filteredEntities = this.entidades.filter((entity) =>
        entity.nome.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  getImage(entidade: any): string {
    return this.constructImageUrl(entidade.fotoPerfil);
  }

  getImageAdicional(foto: any): string {
    return this.constructImageUrl(foto);
  }

  constructImageUrl(fotoPerfilPath: string): string {
    const baseUrl = 'http://localhost:3000';
    return `${baseUrl}/${fotoPerfilPath}`;
  }

  criarDoacao(nomeEntidade: string): void {
    this.router.navigate(['user/realizar_doacao'], {
      queryParams: { nomeEntidade: nomeEntidade },
    });
  }

  abrirModalDetalhes(entity: any): void {
    this.selectedEntity = entity;
    this.modalVisible = true;

    // Aguarde o modal ser completamente renderizado antes de inicializar o botão PayPal
    setTimeout(() => {
      this.initializePaypalButton();
    }, 0);
  }

  fecharModal(): void {
    this.modalVisible = false;
    const paypalContainer = document.getElementById('paypal-donate-button-container');
    if (paypalContainer) {
      paypalContainer.innerHTML = '';
    }
  }
}
