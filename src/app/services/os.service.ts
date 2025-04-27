// os.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Orcamento, OrdemServico } from '../models/model';

@Injectable({ providedIn: 'root' })
export class OsService {
  private apiUrl = 'http://localhost:3000/ordens-servico';

  constructor(private http: HttpClient) {}

  getOrdens(): Observable<OrdemServico[]> {
    return this.http.get<OrdemServico[]>(this.apiUrl);
  }

  getOrdem(id: number): Observable<OrdemServico> {
    return this.http.get<OrdemServico>(`${this.apiUrl}/${id}`);
  }

  createOrdem(os: OrdemServico): Observable<OrdemServico> {
    return this.http.post<OrdemServico>(this.apiUrl, os);
  }

  updateOrdem(id: number, os: OrdemServico): Observable<OrdemServico> {
    return this.http.put<OrdemServico>(`${this.apiUrl}/${id}`, os);
  }

  gerarOrcamento(osId: number): Observable<Orcamento> {
    return this.http.post<Orcamento>(`${this.apiUrl}/${osId}/orcamento`, {});
  }
}