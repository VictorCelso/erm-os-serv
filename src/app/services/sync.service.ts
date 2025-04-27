// services/sync.service.ts
import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { NetworkService } from './network.service';
import { CustomerService } from './customer.service';
import { OrdemServicoService } from './ordem-servico.service';
import { OrcamentoService } from './orcamento.service';
import { PedidoService } from './pedido.service';
import { from, of } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SyncService {
  constructor(
    private localStorage: LocalStorageService,
    private network: NetworkService,
    private customerService: CustomerService,
    private osService: OrdemServicoService,
    private orcamentoService: OrcamentoService,
    private pedidoService: PedidoService
  ) {}

  // Verifica e executa sincronização quando online
  checkAndSync(): void {
    if (this.network.isOnline()) {
      this.syncPendingOperations();
    }
  }

  // Sincroniza todas as operações pendentes
  private syncPendingOperations(): void {
    const operations = this.localStorage.getPendingOperations();
    if (operations.length === 0) return;

    const syncedIds: number[] = [];
    
    from(operations).pipe(
      mergeMap(op => {
        switch (op.type) {
          case 'create':
            return this.handleCreateOperation(op).pipe(
              tap(() => syncedIds.push(op.timestamp))
            );
            
          case 'update':
            return this.handleUpdateOperation(op).pipe(
              tap(() => syncedIds.push(op.timestamp))
            );
            
          case 'delete':
            return this.handleDeleteOperation(op).pipe(
              tap(() => syncedIds.push(op.timestamp))
            );
            
          default:
            return of(null);
        }
      })
    ).subscribe({
      complete: () => {
        // Remove operações sincronizadas
        if (syncedIds.length > 0) {
          this.localStorage.removeSyncedOperations(syncedIds);
        }
      }
    });
  }

  private handleCreateOperation(op: any) {
    switch (op.entity) {
      case 'customers':
        return this.customerService.createCustomer(op.payload);
      case 'ordens-servico':
        return this.osService.createOrdem(op.payload);
      case 'orcamentos':
        return this.orcamentoService.createOrcamento(op.payload);
      case 'pedidos':
        return this.pedidoService.createPedido(op.payload);
      default:
        return of(null);
    }
  }

  private handleUpdateOperation(op: any) {
    switch (op.entity) {
      case 'customers':
        return this.customerService.updateCustomer(op.timestamp, op.payload);
      case 'ordens-servico':
        return this.osService.updateOrdem(op.timestamp, op.payload);
      case 'orcamentos':
        return this.orcamentoService.updateOrcamento(op.timestamp, op.payload);
      case 'pedidos':
        return this.pedidoService.updatePedido(op.timestamp, op.payload);
      default:
        return of(null);
    }
  }

  private handleDeleteOperation(op: any) {
    switch (op.entity) {
      case 'customers':
        return this.customerService.deleteCustomer(op.payload.id);
      case 'ordens-servico':
        return this.osService.deleteOrdem(op.payload.id);
      case 'orcamentos':
        return this.orcamentoService.deleteOrcamento(op.payload.id);
      case 'pedidos':
        return this.pedidoService.deletePedido(op.payload.id);
      default:
        return of(null);
    }
  }
}