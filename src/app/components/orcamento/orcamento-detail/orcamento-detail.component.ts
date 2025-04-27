// orcamento-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrcamentoService } from '../../../services/orcamento.service';
import { Orcamento } from '../../../models/orcamento.model';

@Component({
  selector: 'app-orcamento-detail',
  templateUrl: './orcamento-detail.component.html',
  styleUrls: ['./orcamento-detail.component.css']
})
export class OrcamentoDetailComponent implements OnInit {
  orcamento: Orcamento | null = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orcamentoService: OrcamentoService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.carregarOrcamento(+id);
    }
  }

  carregarOrcamento(id: number): void {
    this.orcamentoService.getOrcamento(id).subscribe(
      orcamento => {
        this.orcamento = orcamento;
        this.isLoading = false;
      },
      error => {
        console.error('Erro ao carregar orçamento:', error);
        this.isLoading = false;
      }
    );
  }

  aprovarOrcamento(): void {
    if (this.orcamento) {
      this.orcamentoService.aprovarOrcamento(this.orcamento.id).subscribe(
        () => this.carregarOrcamento(this.orcamento!.id),
        error => console.error('Erro ao aprovar orçamento:', error)
      );
    }
  }

  gerarPedido(): void {
    if (this.orcamento) {
      this.orcamentoService.gerarPedido(this.orcamento.id).subscribe(
        pedido => this.router.navigate(['/pedidos', pedido.id]),
        error => console.error('Erro ao gerar pedido:', error)
      );
    }
  }

  calcularTotal(): number {
    if (!this.orcamento) return 0;
    return this.orcamento.itens.reduce((total, item) => {
      const valorItem = item.quantidade * item.valorUnitario;
      const desconto = valorItem * (item.desconto || 0) / 100;
      return total + (valorItem - desconto);
    }, 0);
  }
}