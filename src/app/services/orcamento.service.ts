// orcamento.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Orcamento, Pedido } from '../models/model';

@Injectable({ providedIn: 'root' })
export class OrcamentoService {
  private apiUrl = 'http://localhost:3000/orcamentos';

  constructor(private http: HttpClient) {}

  getOrcamentos(): Observable<Orcamento[]> {
    return this.http.get<Orcamento[]>(this.apiUrl);
  }

  getOrcamento(id: number): Observable<Orcamento> {
    return this.http.get<Orcamento>(`${this.apiUrl}/${id}`);
  }

  createOrcamento(orcamento: Orcamento): Observable<Orcamento> {
    return this.http.post<Orcamento>(this.apiUrl, orcamento);
  }

  aprovarOrcamento(id: number): Observable<Orcamento> {
    return this.http.patch<Orcamento>(`${this.apiUrl}/${id}/aprovar`, {});
  }

  gerarPedido(orcamentoId: number): Observable<Pedido> {
    return this.http.post<Pedido>(`${this.apiUrl}/${orcamentoId}/pedido`, {});
  }
}