// services/idb.service.ts
import { Injectable } from '@angular/core';
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface MyDB extends DBSchema {
  customers: {
    key: number;
    value: Customer;
    indexes: { 'by-name': string };
  };
  ordensServico: {
    key: number;
    value: OrdemServico;
  };
  // Adicione outras entidades conforme necessário
}

@Injectable({ providedIn: 'root' })
export class IdbService {
  private dbPromise: Promise<IDBPDatabase<MyDB>>;

  constructor() {
    this.dbPromise = openDB<MyDB>('crm-db', 1, {
      upgrade(db) {
        // Cria os object stores
        const customerStore = db.createObjectStore('customers', {
          keyPath: 'id',
          autoIncrement: true
        });
        customerStore.createIndex('by-name', 'name');
        
        db.createObjectStore('ordensServico', {
          keyPath: 'id',
          autoIncrement: true
        });
        
        // Adicione outras stores conforme necessário
      }
    });
  }

  async addCustomer(customer: Customer): Promise<number> {
    const db = await this.dbPromise;
    return db.add('customers', customer);
  }

  async getCustomers(): Promise<Customer[]> {
    const db = await this.dbPromise;
    return db.getAll('customers');
  }

  async updateCustomer(customer: Customer): Promise<void> {
    const db = await this.dbPromise;
    return db.put('customers', customer);
  }

  async deleteCustomer(id: number): Promise<void> {
    const db = await this.dbPromise;
    return db.delete('customers', id);
  }

  // Adicione métodos similares para outras entidades
}