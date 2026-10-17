// Listas fechadas do site. O esquema (content.config.ts) e o formulário do CMS
// (pages/admin/config.yml.ts) leem daqui, para os dois nunca ficarem diferentes.
// Cada lista é [valor gravado no arquivo, rótulo mostrado no site].

export const TIPOS = {
  titular: 'Titular',
  reserva: 'Reserva',
  terceira: 'Terceira',
  goleiro: 'Goleiro',
  treino: 'Treino',
  'pre-jogo': 'Pré-jogo',
  comemorativa: 'Comemorativa',
  passeio: 'Passeio',
} as const;

export const VERSOES = { torcedor: 'Torcedor', jogador: 'Jogador', 'nao-sei': 'Não sei' } as const;

export const MANGAS = { curta: 'Curta', longa: 'Longa' } as const;

export const TAMANHOS = { PP: 'PP', P: 'P', M: 'M', G: 'G', GG: 'GG', XG: 'XG', XGG: 'XGG' } as const;

export const CONSERVACAO = {
  'nova-com-etiqueta': 'Nova, com etiqueta',
  'nova-sem-etiqueta': 'Nova, sem etiqueta',
  excelente: 'Excelente',
  'muito-boa': 'Muito boa',
  boa: 'Boa',
  regular: 'Regular',
  ruim: 'Ruim',
} as const;

export const ORIGENS = {
  compra: 'Compra',
  presente: 'Presente',
  troca: 'Troca',
  viagem: 'Viagem',
  outro: 'Outro',
} as const;

export const PADROES = {
  liso: 'Liso',
  'listras-verticais': 'Listras verticais',
  'listras-horizontais': 'Listras horizontais',
  'faixa-diagonal': 'Faixa diagonal',
  'faixa-peito': 'Faixa no peito',
  metade: 'Metade',
  estampada: 'Estampada',
} as const;

export const STATUS = { colecao: 'Na coleção', desejo: 'Lista de desejos' } as const;

export const EQUIPES = { clube: 'Clube', selecao: 'Seleção' } as const;

// Paleta fixa. A ordem é a do filtro e da ordenação por cor (o arco-íris, depois os neutros).
export const CORES = {
  vermelho: { rotulo: 'Vermelho', hex: '#D21F2B' },
  grena: { rotulo: 'Grená', hex: '#7A1F2B' },
  laranja: { rotulo: 'Laranja', hex: '#F07A1E' },
  amarelo: { rotulo: 'Amarelo', hex: '#F5C800' },
  dourado: { rotulo: 'Dourado', hex: '#C9A13B' },
  verde: { rotulo: 'Verde', hex: '#0E7A3E' },
  'azul-claro': { rotulo: 'Azul-claro', hex: '#5BB6E8' },
  azul: { rotulo: 'Azul', hex: '#1D3F9C' },
  roxo: { rotulo: 'Roxo', hex: '#5B2C83' },
  rosa: { rotulo: 'Rosa', hex: '#E86FA6' },
  branco: { rotulo: 'Branco', hex: '#FFFFFF' },
  cinza: { rotulo: 'Cinza', hex: '#8A8D91' },
  preto: { rotulo: 'Preto', hex: '#141414' },
} as const;

export const REGIOES = ['Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul'] as const;
export type Regiao = (typeof REGIOES)[number];

// Arara de quem não é clube brasileiro
export const ARARA_SELECOES = 'Seleções';
export const ARARA_GRINGAS = 'Gringas';

// Cada UF: nome, região do IBGE e posição [coluna, linha] no mapa de quadradinhos
export const UFS: Record<string, { nome: string; regiao: Regiao; col: number; lin: number }> = {
  RR: { nome: 'Roraima', regiao: 'Norte', col: 1, lin: 0 },
  AP: { nome: 'Amapá', regiao: 'Norte', col: 3, lin: 0 },
  AM: { nome: 'Amazonas', regiao: 'Norte', col: 1, lin: 1 },
  PA: { nome: 'Pará', regiao: 'Norte', col: 2, lin: 1 },
  MA: { nome: 'Maranhão', regiao: 'Nordeste', col: 3, lin: 1 },
  CE: { nome: 'Ceará', regiao: 'Nordeste', col: 4, lin: 1 },
  RN: { nome: 'Rio Grande do Norte', regiao: 'Nordeste', col: 5, lin: 1 },
  AC: { nome: 'Acre', regiao: 'Norte', col: 0, lin: 2 },
  RO: { nome: 'Rondônia', regiao: 'Norte', col: 1, lin: 2 },
  TO: { nome: 'Tocantins', regiao: 'Norte', col: 2, lin: 2 },
  PI: { nome: 'Piauí', regiao: 'Nordeste', col: 3, lin: 2 },
  PE: { nome: 'Pernambuco', regiao: 'Nordeste', col: 4, lin: 2 },
  PB: { nome: 'Paraíba', regiao: 'Nordeste', col: 5, lin: 2 },
  MT: { nome: 'Mato Grosso', regiao: 'Centro-Oeste', col: 1, lin: 3 },
  GO: { nome: 'Goiás', regiao: 'Centro-Oeste', col: 2, lin: 3 },
  BA: { nome: 'Bahia', regiao: 'Nordeste', col: 3, lin: 3 },
  SE: { nome: 'Sergipe', regiao: 'Nordeste', col: 4, lin: 3 },
  AL: { nome: 'Alagoas', regiao: 'Nordeste', col: 5, lin: 3 },
  MS: { nome: 'Mato Grosso do Sul', regiao: 'Centro-Oeste', col: 1, lin: 4 },
  DF: { nome: 'Distrito Federal', regiao: 'Centro-Oeste', col: 2, lin: 4 },
  MG: { nome: 'Minas Gerais', regiao: 'Sudeste', col: 3, lin: 4 },
  ES: { nome: 'Espírito Santo', regiao: 'Sudeste', col: 4, lin: 4 },
  PR: { nome: 'Paraná', regiao: 'Sul', col: 1, lin: 5 },
  SP: { nome: 'São Paulo', regiao: 'Sudeste', col: 2, lin: 5 },
  RJ: { nome: 'Rio de Janeiro', regiao: 'Sudeste', col: 3, lin: 5 },
  SC: { nome: 'Santa Catarina', regiao: 'Sul', col: 1, lin: 6 },
  RS: { nome: 'Rio Grande do Sul', regiao: 'Sul', col: 1, lin: 7 },
};

export const chaves = <T extends object>(o: T) => Object.keys(o) as [keyof T & string, ...(keyof T & string)[]];
