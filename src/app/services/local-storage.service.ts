// services/local-storage.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  private pendingOperations = new BehaviorSubject<any[]>(this.getPendingOperations());
  pendingOperations$ = this.pendingOperations.asObservable();

  constructor() {}

  // Salva dados localmente
  saveData(key: string, data: any): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Obtém dados locais
  getData(key: string): any {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  // Adiciona operação pendente
  addPendingOperation(operation: {
    type: string;
    payload: any;
    entity: string;
    timestamp: number;
  }): void {
    const operations = this.getPendingOperations();
    operations.push(operation);
    this.saveData('pending_operations', operations);
    this.pendingOperations.next(operations);
  }

  // Obtém operações pendentes
  getPendingOperations(): any[] {
    return this.getData('pending_operations') || [];
  }

  // Remove operações sincronizadas
  removeSyncedOperations(syncedIds: number[]): void {
    let operations = this.getPendingOperations();
    operations = operations.filter(op => !syncedIds.includes(op.timestamp));
    this.saveData('pending_operations', operations);
    this.pendingOperations.next(operations);
  }

  // Limpa dados locais
  clearLocalData(): void {
    localStorage.clear();
    this.pendingOperations.next([]);
  }
}