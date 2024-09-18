import { Component, OnInit } from '@angular/core';
import { DoacaoService } from '../../services/doacao.service';
import { AuthService } from '../../services/auth.service';
import { HeaderUserComponent } from '../header-user/header-user.component';
import { HeaderEntityComponent } from '../header-entity/header-entity.component';
import { CommonModule, getLocaleDateFormat } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-check-donations',
  standalone: true,
  imports: [HeaderUserComponent, HeaderEntityComponent, CommonModule, FormsModule],
  templateUrl: './check-donations.component.html',
  styleUrls: ['./check-donations.component.css'],
})
export class CheckDonationsComponent implements OnInit {
  donationExistance!: boolean;
  doacoes: any[] = [];
  filteredDoacoes: any[] = [];
  selectedDoacao: any;
  thisRole: any;
  todayDate!: any;
  filters = {
    id: '',
    dateOrder: 'desc',
    kilos: '',
    numberPieces: '',
    exactDate: '',
    state: '',
  };
  showFilters: boolean = false;

  constructor(
    private authService: AuthService,
    private doacaoService: DoacaoService
  ) {}

  ngOnInit(): void {
    this.doacaoService.getDonations().subscribe((data) => {
      this.doacoes = data.doacoes;
      if (this.doacoes.length !== 0) {
        this.donationExistance = true;
      } else {
        this.donationExistance = false;
      }
      this.applyFilters();
    });

    this.todayDate = Date.now();
    this.thisRole = this.authService.getRole();
  }

  getImage(doacao: any): string {
    return this.constructImageUrl(doacao.fotos);
  }

  constructImageUrl(fotoDoacaoPath: string): string {
    const baseUrl = 'http://localhost:3000';
    return `${baseUrl}/${fotoDoacaoPath}`;
  }

  applyFilters2() {
    this.applyFilters();
    if (this.filters.kilos !== '') {
      this.filteredDoacoes.sort((a, b) => a.kilos - b.kilos);
    }
    if (this.filters.numberPieces! == '') {
      this.filteredDoacoes.sort((a, b) => a.numberPieces - b.numberPieces);
    }
  }

  applyFilters() {
    const exactDate = this.filters.exactDate
      ? new Date(this.filters.exactDate)
      : null;

    this.filteredDoacoes = this.doacoes.filter((doacao) => {
      const doacaoDate = new Date(doacao.data);
      const doacaoState = doacao.estado;
      const matchesId =
        !this.filters.id || doacao._id.toString().startsWith(this.filters.id);
      const matchesKilos =
        !this.filters.kilos ||
        doacao.kilos.toString().startsWith(this.filters.kilos);
      const matchesNumberPieces =
        !this.filters.numberPieces ||
        doacao.numeroPecas.toString().startsWith(this.filters.numberPieces);
      const matchesExactDate =
        !exactDate ||
        (doacaoDate.getFullYear() === exactDate.getFullYear() &&
          doacaoDate.getMonth() === exactDate.getMonth() &&
          doacaoDate.getDate() === exactDate.getDate());

      const matchesState =
        !this.filters.state || this.filters.state === doacaoState;

      return (
        matchesId &&
        matchesKilos &&
        matchesNumberPieces &&
        matchesExactDate &&
        matchesState
      );
    });

    if (this.filters.dateOrder === 'asc') {
      this.filteredDoacoes.sort(
        (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()
      );
    } else {
      this.filteredDoacoes.sort(
        (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
      );
    }
  }

  clearFilters() {
    this.filters = {
      id: '',
      dateOrder: 'desc',
      kilos: '',
      numberPieces: '',
      exactDate: '',
      state: '',
    };
    this.applyFilters();
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }
  showDetails(doacao: any) {
    this.selectedDoacao = doacao;
  }

  updateState(selectedValue: string) {
    if(selectedValue === 'Agendado'){
      return;
    }else{
    this.doacaoService
      .updateDonationState(
        this.selectedDoacao._id,
        selectedValue
      )
      .subscribe(
        (response) => {
          console.log('Estado da doação atualizado', response);
          window.location.reload();
        },
        (error) => {
          console.error('Erro ao atualizar o estado da doação', error);
        }
      );
  }
}
}
