// os-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OsService } from '../../../services/os.service';
import { ClienteService } from '../../../services/cliente.service';
import { ProdutoService } from '../../../services/produto.service';

@Component({
  selector: 'app-os-form',
  templateUrl: './os-form.component.html',
  styleUrls: ['./os-form.component.css']
})
export class OsFormComponent implements OnInit {
  osForm: FormGroup;
  isEditMode = false;
  osId: number | null = null;
  clientes: Cliente[] = [];
  produtosServicos: ProdutoServico[] = [];

  constructor(
    private fb: FormBuilder,
    private osService: OsService,
    private clienteService: ClienteService,
    private produtoService: ProdutoService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.osForm = this.fb.group({
      numero: ['', Validators.required],
      clienteId: ['', Validators.required],
      dataAbertura: [new Date().toISOString().substring(0, 10), Validators.required],
      status: ['aberta', Validators.required],
      observacoes: [''],
      tecnicoResponsavel: [''],
      itens: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.carregarClientes();
    this.carregarProdutosServicos();

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.osId = +params['id'];
        this.carregarOs(this.osId);
      } else {
        this.adicionarItem(); // Adiciona um item vazio para novo formulário
      }
    });
  }

  get itens(): FormArray {
    return this.osForm.get('itens') as FormArray;
  }

  criarItem(item?: Item): FormGroup {
    return this.fb.group({
      produtoServicoId: [item?.produtoServico.id || '', Validators.required],
      quantidade: [item?.quantidade || 1, [Validators.required, Validators.min(1)]],
      valorUnitario: [item?.valorUnitario || 0, [Validators.required, Validators.min(0)]],
      desconto: [item?.desconto || 0, [Validators.min(0), Validators.max(100)]]
    });
  }

  adicionarItem(item?: Item): void {
    this.itens.push(this.criarItem(item));
  }

  removerItem(index: number): void {
    this.itens.removeAt(index);
  }

  carregarClientes(): void {
    this.clienteService.getClientes().subscribe(
      clientes => this.clientes = clientes,
      error => console.error('Erro ao carregar clientes:', error)
    );
  }

  carregarProdutosServicos(): void {
    this.produtoService.getProdutosServicos().subscribe(
      produtos => this.produtosServicos = produtos,
      error => console.error('Erro ao carregar produtos/serviços:', error)
    );
  }

  carregarOs(id: number): void {
    this.osService.getOrdem(id).subscribe(
      os => {
        this.osForm.patchValue({
          numero: os.numero,
          clienteId: os.cliente.id,
          dataAbertura: os.dataAbertura.toString().substring(0, 10),
          status: os.status,
          observacoes: os.observacoes,
          tecnicoResponsavel: os.tecnicoResponsavel
        });

        // Limpa os itens existentes
        while (this.itens.length) {
          this.itens.removeAt(0);
        }

        // Adiciona os itens da OS
        os.itens.forEach(item => this.adicionarItem(item));
      },
      error => console.error('Erro ao carregar OS:', error)
    );
  }

  onSubmit(): void {
    if (this.osForm.valid) {
      const osData = this.osForm.value;

      if (this.isEditMode && this.osId) {
        this.osService.updateOrdem(this.osId, osData).subscribe(
          () => this.router.navigate(['/os', this.osId]),
          error => console.error('Erro ao atualizar OS:', error)
        );
      } else {
        this.osService.createOrdem(osData).subscribe(
          (novaOs) => this.router.navigate(['/os', novaOs.id]),
          error => console.error('Erro ao criar OS:', error)
        );
      }
    }
  }

  gerarOrcamento(): void {
    if (this.osId) {
      this.osService.gerarOrcamento(this.osId).subscribe(
        orcamento => this.router.navigate(['/orcamentos', orcamento.id]),
        error => console.error('Erro ao gerar orçamento:', error)
      );
    }
  }
}