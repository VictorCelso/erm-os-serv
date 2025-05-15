export type TipoCliente = 'PF' | 'PJ';

export interface Endereco {
    logradouro: string;
    numero: string;
    complemento?: string;
    cidade: string;
    estado: string;
    cep: string;
}

export interface Cliente {
    id: string;
    tipo: TipoCliente;
    nome: string;
    documento: string;
    endereco: Endereco;
    contato: {
        telefone: string;
        email: string;
        celular?: string;
    };
    dataCadastro: Date;
    ativo: boolean;
}

export type StatusOS =
    | 'aberta'
    | 'em_andamento'
    | 'aguardando_pecas'
    | 'concluida'
    | 'cancelada';

export interface ItemOS {
    produtoServicoId: string;
    tipo: 'produto' | 'servico';
    descricao: string;
    quantidade: number;
    valorUnitario: number;
    desconto?: number;
    observacoes?: string;
}

export interface OrdemServico {
    id: string;
    numero: string;
    clienteId: string;
    dataAbertura: Date;
    dataConclusao?: Date;
    status: StatusOS;
    itens: ItemOS[];
    tecnicoResponsavel: string;
    observacoes?: string;
    valorTotal: number;
}

export type StatusOrcamento =
    | 'pendente'
    | 'aprovado'
    | 'rejeitado'
    | 'expirado';

export interface ItemOrcamento {
    produtoServicoId: string;
    descricao: string;
    quantidade: number;
    valorUnitario: number;
    desconto?: number;
}

export interface Orcamento {
    id: string;
    numero: string;
    osId?: string;
    clienteId: string;
    dataCriacao: Date;
    validoAte: Date;
    itens: ItemOrcamento[];
    status: StatusOrcamento;
    observacoes?: string;
    valorTotal: number;
}

export type MetodoPagamento =
    | 'dinheiro'
    | 'cartao_credito'
    | 'cartao_debito'
    | 'pix'
    | 'transferencia'
    | 'boleto';

export type StatusPagamento =
    | 'pendente'
    | 'parcial'
    | 'pago'
    | 'atrasado'
    | 'cancelado';

export interface Parcela {
    numero: number;
    valor: number;
    dataVencimento: Date;
    status: StatusPagamento;
    dataPagamento?: Date;
}

export interface Pagamento {
    id: string;
    pedidoId: string;
    metodo: MetodoPagamento;
    valorTotal: number;
    parcelas: Parcela[];
    status: StatusPagamento;
}

export interface OSForm {
    clienteId: string;
    equipamento: string;
    defeitoRelatado: string;
    itens: Array<{
        produtoServicoId: string;
        quantidade: number;
        valorUnitario: number;
    }>;
    observacoes?: string;
}

export type OrcamentoForm = Omit<
    Orcamento,
    'id' | 'numero' | 'dataCriacao' | 'valorTotal'
>;

export interface FiltroOS {
    status?: StatusOS;
    clienteId?: string;
    dataInicio?: Date;
    dataFim?: Date;
    tecnico?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: Record<string, string[]>;
    };
    pagination?: {
        totalItems: number;
        currentPage: number;
        itemsPerPage: number;
        totalPages: number;
    };
}

export type PaginatedResponse<T> = ApiResponse<T[]> & {
    pagination: {
        totalItems: number;
        currentPage: number;
        itemsPerPage: number;
        totalPages: number;
    };
};

export interface FiltroClientes {
    nome?: string;
    documento?: string;
    tipo?: TipoCliente;
    cidade?: string;
    ativo?: boolean;
  }
  
  export interface FiltroOrcamentos {
    status?: StatusOrcamento;
    clienteId?: string;
    dataInicio?: Date;
    dataFim?: Date;
    valorMin?: number;
    valorMax?: number;
  }