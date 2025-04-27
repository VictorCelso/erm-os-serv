// services/customer.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { tap, catchError, mergeMap } from 'rxjs/operators';
import { Customer } from '../models/model';
import { LocalStorageService } from './local-storage.service';
import { NetworkService } from './network.service';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private apiUrl = 'http://localhost:3000/customers';
  private localDataKey = 'local_customers';

  constructor(
    private http: HttpClient,
    private localStorage: LocalStorageService,
    private network: NetworkService
  ) {}

  getCustomers(): Observable<Customer[]> {
    if (this.network.isOnline()) {
      return this.http.get<Customer[]>(this.apiUrl).pipe(
        tap(customers => {
          // Atualiza cache local quando online
          this.localStorage.saveData(this.localDataKey, customers);
        }),
        catchError(() => {
          // Fallback para dados locais se a requisição falhar
          return of(this.getLocalCustomers());
        })
      );
    } else {
      // Retorna dados locais quando offline
      return of(this.getLocalCustomers());
    }
  }

  createCustomer(customer: Customer): Observable<Customer> {
    if (this.network.isOnline()) {
      return this.http.post<Customer>(this.apiUrl, customer).pipe(
        tap(newCustomer => {
          // Atualiza cache local
          const customers = this.getLocalCustomers();
          customers.push(newCustomer);
          this.localStorage.saveData(this.localDataKey, customers);
        })
      );
    } else {
      // Gera ID temporário e armazena localmente
      const tempId = Date.now();
      const localCustomer = { ...customer, id: tempId, _isLocal: true };
      
      const customers = this.getLocalCustomers();
      customers.push(localCustomer);
      this.localStorage.saveData(this.localDataKey, customers);
      
      // Adiciona operação pendente
      this.localStorage.addPendingOperation({
        type: 'create',
        payload: customer,
        entity: 'customers',
        timestamp: tempId
      });
      
      return of(localCustomer);
    }
  }

  updateCustomer(id: number, customer: Customer): Observable<Customer> {
    if (this.network.isOnline()) {
      return this.http.put<Customer>(`${this.apiUrl}/${id}`, customer).pipe(
        tap(updatedCustomer => {
          // Atualiza cache local
          const customers = this.getLocalCustomers();
          const index = customers.findIndex(c => c.id === id);
          if (index !== -1) {
            customers[index] = updatedCustomer;
            this.localStorage.saveData(this.localDataKey, customers);
          }
        })
      );
    } else {
      // Atualiza localmente
      const customers = this.getLocalCustomers();
      const index = customers.findIndex(c => c.id === id);
      if (index !== -1) {
        customers[index] = { ...customer, _isLocal: true };
        this.localStorage.saveData(this.localDataKey, customers);
        
        // Adiciona operação pendente
        this.localStorage.addPendingOperation({
          type: 'update',
          payload: customer,
          entity: 'customers',
          timestamp: id
        });
      }
      return of(customers[index]);
    }
  }

  deleteCustomer(id: number): Observable<void> {
    if (this.network.isOnline()) {
      return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
        tap(() => {
          // Atualiza cache local
          const customers = this.getLocalCustomers();
          const filtered = customers.filter(c => c.id !== id);
          this.localStorage.saveData(this.localDataKey, filtered);
        })
      );
    } else {
      // Marca como deletado localmente
      const customers = this.getLocalCustomers();
      const index = customers.findIndex(c => c.id === id);
      if (index !== -1) {
        customers[index]._isDeleted = true;
        this.localStorage.saveData(this.localDataKey, customers);
        
        // Adiciona operação pendente
        this.localStorage.addPendingOperation({
          type: 'delete',
          payload: { id },
          entity: 'customers',
          timestamp: id
        });
      }
      return of(undefined);
    }
  }

  private getLocalCustomers(): Customer[] {
    return this.localStorage.getData(this.localDataKey) || [];
  }
}