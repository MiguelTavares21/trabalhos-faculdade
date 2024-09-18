import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DoacaoService {
  constructor(private http: HttpClient) {}

  postDonation(doacaoData: FormData): Observable<any> {
    return this.http.post<any>(
      'http://localhost:3000/requests2/criarPedidoRecolha2',
      doacaoData
    );
  }
  getDonations(): Observable<any> {
    return this.http.get<any>('http://localhost:3000/requests2/pedidos');
  }

  updateDonationState(
    doacaoId: string,
    doacaoState: string
  ): Observable<any> {
    return this.http.put<any>(
      'http://localhost:3000/requests2/atualizarEstadoDoacao',
      { doacaoId, doacaoState}
    );
  }
}