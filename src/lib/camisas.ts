// Junta cada camisa com o clube dela e calcula o que o site precisa
// (arara, década, fotos, texto de busca). Todas as páginas leem daqui.
import { getCollection, type CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';
import {
  ARARA_GRINGAS, ARARA_SELECOES, CONSERVACAO, CORES, MANGAS, ORIGENS, PADROES, TIPOS, UFS, VERSOES,
} from '../opcoes';
import { normalizar } from './normalizar';

// Todas as imagens das pastas das camisas, indexadas pelo caminho
const IMAGENS = import.meta.glob<ImageMetadata>('/src/content/camisas/**/*.{webp,jpg,jpeg,png,avif}', {
  eager: true,
  import: 'default',
});

export type Foto = {
  original: ImageMetadata;
  // Versão com o fundo removido (frente.recorte.webp ao lado de frente.webp), se já existir
  recorte?: ImageMetadata;
  legenda?: string;
};

export type Camisa = CollectionEntry<'camisas'>['data'] & {
  id: string;
  entrada: CollectionEntry<'camisas'>;
  clubeId: string;
  clube: CollectionEntry<'clubes'>['data'];
  arara: string;
  decada: string;
  frente?: Foto;
  verso?: Foto;
  detalhes: Foto[];
  busca: string;
  historia: string;
};

export { normalizar };

function resolverFoto(entrada: CollectionEntry<'camisas'>, arquivo: string | undefined, legenda?: string): Foto | undefined {
  if (!arquivo) return undefined;
  const pasta = '/' + entrada.filePath!.replace(/\\/g, '/').replace(/\/[^/]+$/, '');
  const caminho = `${pasta}/${arquivo.replace(/^\.\//, '')}`;
  const original = IMAGENS[caminho];
  if (!original) {
    throw new Error(`camisas → ${entrada.id}: a foto "${arquivo}" não existe na pasta ${pasta.slice(1)}`);
  }
  const recorte = IMAGENS[caminho.replace(/\.[a-z]+$/i, '.recorte.webp')];
  return { original, recorte, legenda };
}

function araraDe(clube: CollectionEntry<'clubes'>['data']) {
  if (clube.equipe === 'selecao') return ARARA_SELECOES;
  if (clube.uf) return UFS[clube.uf].regiao;
  return ARARA_GRINGAS;
}

let cache: Camisa[] | undefined;

export async function todasAsCamisas(): Promise<Camisa[]> {
  if (cache) return cache;
  const clubes = new Map((await getCollection('clubes')).map((c) => [c.id, c.data]));
  const entradas = await getCollection('camisas');
  cache = entradas.map((entrada) => {
    const d = entrada.data;
    const clube = clubes.get(d.clube.id);
    if (!clube) throw new Error(`camisas → ${entrada.id}: o clube "${d.clube.id}" não existe em src/content/clubes`);
    const historia = (entrada.body ?? '').trim();
    const ano = Number(d.temporada.slice(0, 4));
    const camisa: Camisa = {
      ...d,
      id: entrada.id,
      entrada,
      clubeId: d.clube.id,
      clube,
      arara: araraDe(clube),
      decada: `Anos ${Math.floor(ano / 10) * 10}`,
      frente: resolverFoto(entrada, d.fotos.frente),
      verso: resolverFoto(entrada, d.fotos.verso),
      detalhes: d.fotos.detalhes.map((x) => resolverFoto(entrada, x.foto, x.legenda)!),
      historia,
      busca: '',
    };
    camisa.busca = normalizar(
      [
        clube.nome, clube.pais, clube.cidade, clube.uf, clube.uf && UFS[clube.uf].nome, clube.liga,
        d.temporada, TIPOS[d.tipo], d.esporte, d.fabricante, d.patrocinador, d.nomeNumero,
        ...d.patches, ...d.tags, ...d.cores.map((c) => CORES[c].rotulo), historia,
      ].filter(Boolean).join(' '),
    );
    return camisa;
  });
  return cache;
}

// ---------- Rótulos ----------

export const rotulo = {
  tipo: (c: Camisa) => TIPOS[c.tipo],
  versao: (c: Camisa) => VERSOES[c.versao],
  manga: (c: Camisa) => MANGAS[c.manga],
  conservacao: (c: Camisa) => (c.conservacao ? CONSERVACAO[c.conservacao] : undefined),
  origem: (c: Camisa) => (c.origem ? ORIGENS[c.origem] : undefined),
  padrao: (c: Camisa) => PADROES[c.padrao],
};

// Tipo na etiqueta: "Titular", ou "Treino · críquete" quando não é futebol
export function tipoCurto(c: Camisa) {
  const partes = [TIPOS[c.tipo]];
  if (c.esporte !== 'futebol') partes.push(c.esporte);
  if (c.retro) partes.push('retrô');
  return partes.join(' · ');
}

const MESES = ['jan.', 'fev.', 'mar.', 'abr.', 'mai.', 'jun.', 'jul.', 'ago.', 'set.', 'out.', 'nov.', 'dez.'];

export function formatarData(d?: string) {
  if (!d) return undefined;
  const [a, m, dia] = d.split('-');
  if (dia) return `${Number(dia)} ${MESES[Number(m) - 1]} ${a}`;
  if (m) return `${MESES[Number(m) - 1]} ${a}`;
  return a;
}

// ---------- Ordem ----------

const ORDEM_CORES = Object.keys(CORES);

// Chave numérica de cada ordenação, gravada no HTML para o filtro reordenar sem recarregar
export function chavesDeOrdem(c: Camisa) {
  return {
    aquisicao: c.aquisicao ? c.aquisicao.padEnd(10, '-00').replace(/-/g, '') : '0',
    temporada: c.temporada.slice(0, 4) + (c.temporada.length > 4 ? '1' : '0'),
    clube: normalizar(c.clube.nome),
    cor: c.cores.map((cor) => String(ORDEM_CORES.indexOf(cor)).padStart(2, '0')).join(''),
  };
}

// Mais recente primeiro, procuradas no fim
export function porTemporada(a: Camisa, b: Camisa) {
  return (
    Number(a.status === 'desejo') - Number(b.status === 'desejo') ||
    b.temporada.localeCompare(a.temporada) ||
    a.clube.nome.localeCompare(b.clube.nome, 'pt')
  );
}
