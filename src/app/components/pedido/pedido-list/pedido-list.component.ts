// pedido-list.component.ts
import { Component, OnInit } from '@angular/core';
import { PedidoService } from '../../../services/pedido.service';
import { Pedido } from '../../../models/pedido.model';

@Component({
  selector: 'app-pedido-list',
  templateUrl: './pedido-list.component.html',
  styleUrls: ['./pedido-list.component.css']
})
export class PedidoListComponent implements OnInit {
  pedidos: Pedido[] = [];
  isLoading = true;
  filtroStatus = 'todos';

  constructor(private pedidoService: PedidoService) {}

  ngOnInit(): void {
    this.carregarPedidos();
  }

  carregarPedidos(): void {
    this.isLoading = true;
    this.pedidoService.getPedidos().subscribe(
      pedidos => {
        this.pedidos = pedidos;
        this.isLoading = false;
      },
      error => {
        console.error('Erro ao carregar pedidos:', error);
        this.isLoading = false;
      }
    );
  }

  filtrarPedidos(status: string): void {
    this.filtroStatus = status;
  }

  getPedidosFiltrados(): Pedido[] {
    if (this.filtroStatus === 'todos') {
      return this.pedidos;
    }
    return this.pedidos.filter(p => p.status === this.filtroStatus);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pendente': return 'bg-warning';
      case 'faturado': return 'bg-success';
      case 'cancelado': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }
}