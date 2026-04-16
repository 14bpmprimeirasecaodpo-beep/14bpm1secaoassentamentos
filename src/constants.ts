import { PostoGrad, Quadro, Comportamento, TipoPunicao } from './types';

export const POSTOS_GRAD: PostoGrad[] = [
  'CEL PM', 'TEN CEL PM', 'MAJ PM', 'CAP PM', '1º TEN PM', '2º TEN PM', 'ASP PM',
  'AL CFO', 'AL CFOA', 'SUB TEN PM', '1º SGT PM', '2º SGT PM', '3º SGT PM',
  'AL CFS', 'CB PM', 'AL CFC', 'SD PM', 'AL CFSD'
];

export const QUADROS: Quadro[] = ['QOPM', 'QOA', 'QPMG', 'QOM', 'QPMUS'];

export const COMPORTAMENTOS: Comportamento[] = ['EXCEPCIONAL', 'ÓTIMO', 'BOM', 'INSUFICIENTE', 'MAU'];

export const TIPOS_PUNICAO: TipoPunicao[] = ['PRISÃO', 'DETENSÃO', 'REPREENSÃO', 'ADVERTÊNCIA'];
