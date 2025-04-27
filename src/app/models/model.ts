// cliente.model.ts
export interface Cliente {
  id: number;
  nome: string;
  tipo: 'PF' | 'PJ';
  documento: string;
  endereco: string;
  telefone: string;
  email: string;
}

// produto-servico.model.ts
export interface ProdutoServico {
  id: number;
  tipo: 'produto' | 'servico';
  codigo: string;
  descricao: string;
  preco: number;
  unidadeMedida?: string;
}

// item.model.ts
export interface Item {
  produtoServico: ProdutoServico;
  quantidade: number;
  valorUnitario: number;
  desconto?: number;
}

// os.model.ts
export interface OrdemServico {
  id: number;
  numero: string;
  cliente: Cliente;
  dataAbertura: Date;
  dataConclusao?: Date;
  status: 'aberta' | 'andamento' | 'concluida' | 'cancelada';
  itens: Item[];
  observacoes?: string;
  tecnicoResponsavel?: string;
}

// orcamento.model.ts
export interface Orcamento {
  id: number;
  numero: string;
  osId?: number;
  cliente: Cliente;
  data: Date;
  validoAte: Date;
  itens: Item[];
  status: 'pendente' | 'aprovado' | 'rejeitado';
  observacoes?: string;
}

// pedido.model.ts
export interface Pedido {
  id: number;
  numero: string;
  orcamentoId?: number;
  cliente: Cliente;
  data: Date;
  itens: Item[];
  status: 'pendente' | 'faturado' | 'cancelado';
  formaPagamento?: string;
}

// nf.model.ts
export interface NotaFiscal {
  id: number;
  numero: string;
  pedidoId?: number;
  cliente: Cliente;
  dataEmissao: Date;
  itens: Item[];
  valorTotal: number;
  chaveAcesso?: string;
}