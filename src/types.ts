export type PostoGrad = 
  | 'CEL PM' | 'TEN CEL PM' | 'MAJ PM' | 'CAP PM' | '1º TEN PM' | '2º TEN PM' | 'ASP PM' 
  | 'AL CFO' | 'AL CFOA' | 'SUB TEN PM' | '1º SGT PM' | '2º SGT PM' | '3º SGT PM' 
  | 'AL CFS' | 'CB PM' | 'AL CFC' | 'SD PM' | 'AL CFSD';

export type Quadro = 'QOPM' | 'QOA' | 'QPMG' | 'QOM' | 'QPMUS';

export type Comportamento = 'EXCEPCIONAL' | 'ÓTIMO' | 'BOM' | 'INSUFICIENTE' | 'MAU';

export type TipoPunicao = 'PRISÃO' | 'DETENSÃO' | 'REPREENSÃO' | 'ADVERTÊNCIA';

export interface EfetivoAtual {
  id: string;
  seq: number;
  postoGrad: PostoGrad;
  quadro: Quadro;
  matricula: string;
  nomeCompleto: string;
  pastaFisica: 'SIM' | 'NÃO';
  pastaDigital: 'SIM' | 'NÃO';
  comportamento: Comportamento;
  aContarDe: string;
  notaBI: string;
  melhoriaApartirDe: string;
  dataLevantamento: string;
  qtdElogios: string;
  punicaoUltimos6Anos: string;
  observacoes: string;
}

export interface ReformadoTransferido extends EfetivoAtual {
  dataSaida: string;
  seiNo: string;
  suplementoBgFunape: string;
  destino: string;
  seiEnvioAssentamentos: string;
  providencias: string;
}

export interface Recebido {
  id: string;
  seq: number;
  postoGrad: PostoGrad;
  quadro: Quadro;
  matricula: string;
  nomeCompleto: string;
  apresentacaoOME: string;
  seiApresentacao: string;
  suplementoPessoal: string;
  destino: string;
}

export interface Punicao {
  id: string;
  seq: number;
  postoGrad: PostoGrad;
  quadro: Quadro;
  matricula: string;
  nomeCompleto: string;
  qtdDias: number;
  tipoPunicao: TipoPunicao;
  inicio: string;
  fim: string;
  publicadoBI: string;
  comportamentoResultado: Comportamento;
  observacoes: string;
}

export type AppData = {
  efetivoAtual: EfetivoAtual[];
  reformadosTransferidos: ReformadoTransferido[];
  recebidos: Recebido[];
  punicoes: Punicao[];
};

export interface User {
  email: string;
  password?: string;
  isAdmin: boolean;
  isFirstAccess: boolean;
}

export interface AuthState {
  currentUser: User | null;
  authorizedUsers: User[];
}
