// Junta cada camisa com o clube dela e calcula o que o site precisa
// (arara, década, fotos, texto de busca). Todas as páginas leem daqui.
import { getCollection, type CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';
import sharp from 'sharp';
import {
  ARARA_GRINGAS, ARARA_SELECOES, CONSERVACAO, CORES, MANGAS, ORIGENS, PADROES, TIPOS, UFS, VERSOES,
} from '../opcoes';
import { normalizar, slug } from './normalizar';

// Todas as imagens das pastas das camisas, indexadas pelo caminho
const IMAGENS = import.meta.glob<ImageMetadata>('/src/content/camisas/**/*.{webp,jpg,jpeg,png,avif}', {
  eager: true,
  import: 'default',
});

export type Foto = {
  original: ImageMetadata;
  // Versão com o fundo removido (frente.recorte.webp ao lado de frente.webp), se já existir
  recorte?: ImageMetadata;
  // Caminho do recorte no disco, para medir a cor da camisa
  arquivoRecorte?: string;
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
  // Claridade (0 a 1) e cor média medidas na foto recortada da frente
  tom?: { claridade: number; hex: string };
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
  const caminhoRecorte = caminho.replace(/\.[a-z]+$/i, '.recorte.webp');
  const recorte = IMAGENS[caminhoRecorte];
  return { original, recorte, arquivoRecorte: recorte && process.cwd() + caminhoRecorte, legenda };
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
  await Promise.all(cache.map(async (c) => (c.tom = await medirTom(c.frente?.arquivoRecorte))));
  return cache;
}

// ---------- Cor medida na foto ----------

const linear = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const gama = (v: number) => Math.round(255 * (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055));

// Luminosidade (o L do OKLab) de uma cor em RGB linear: 0 é o preto, 1 é o branco.
// O OKLab segue o olho: o amarelo sai mais claro que o azul-claro, e o azul mais escuro que o vermelho.
function luminosidade(r: number, g: number, b: number) {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
}

const luminosidadeHex = (hex: string) =>
  luminosidade(...([1, 3, 5].map((i) => linear(parseInt(hex.slice(i, i + 2), 16) / 255)) as [number, number, number]));

// Média dos pontos do pano na foto recortada (o fundo transparente fica de fora), numa cópia pequena.
// Mede o que se vê: o lilás do Real Madrid, que na paleta virou roxo, sai claro como é.
async function medirTom(arquivo?: string): Promise<Camisa['tom']> {
  if (!arquivo) return undefined;
  const { data } = await sharp(arquivo).resize(64, 64, { fit: 'inside' }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let n = 0, soma = 0, r = 0, g = 0, b = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 200) continue;
    const [pr, pg, pb] = [data[i], data[i + 1], data[i + 2]].map((v) => linear(v / 255));
    soma += luminosidade(pr, pg, pb);
    r += pr; g += pg; b += pb; n++;
  }
  if (!n) return undefined;
  return { claridade: soma / n, hex: '#' + [r, g, b].map((v) => gama(v / n).toString(16).padStart(2, '0')).join('') };
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

const desejoNoFim = (a: Camisa, b: Camisa) => Number(a.status === 'desejo') - Number(b.status === 'desejo');
const porNome = (a: Camisa, b: Camisa) => a.clube.nome.localeCompare(b.clube.nome, 'pt') || a.id.localeCompare(b.id);

// Mais recente primeiro, procuradas no fim
export function porTemporada(a: Camisa, b: Camisa) {
  return desejoNoFim(a, b) || b.temporada.localeCompare(a.temporada) || porNome(a, b);
}

// Quão clara a camisa parece, medida na foto. Sem foto recortada (a lista de desejos, ou uma
// camisa recém-cadastrada), vale a média das cores da paleta: a cor 1 manda; em listras e metade,
// as duas primeiras dividem o pano por igual; a terceira é quase só detalhe.
export function claridade(c: Camisa) {
  if (c.tom) return c.tom.claridade;
  const dividida = ['listras-verticais', 'listras-horizontais', 'metade'].includes(c.padrao);
  const pesos = dividida ? [1, 1, 0.3] : [1, 0.35, 0.15];
  let soma = 0, total = 0;
  c.cores.forEach((cor, i) => {
    soma += luminosidadeHex(CORES[cor].hex) * pesos[i];
    total += pesos[i];
  });
  return soma / total;
}

// Mais clara primeiro; no empate, a ordem da paleta junta as da mesma cor
function porClaridade(a: Camisa, b: Camisa) {
  return (
    claridade(b) - claridade(a) ||
    ORDEM_CORES.indexOf(a.cores[0]) - ORDEM_CORES.indexOf(b.cores[0]) ||
    porNome(a, b)
  );
}

// Ordens de cada arara da página inicial. As procuradas (cabides vazios) ficam sempre no fim.
export const ORDENS_ARARA = {
  recente: 'Mais recente',
  antiga: 'Mais antiga',
  claro: 'Degradê: claro → escuro',
  escuro: 'Degradê: escuro → claro',
} as const;
export type OrdemArara = keyof typeof ORDENS_ARARA;

const COMPARAR: Record<OrdemArara, (a: Camisa, b: Camisa) => number> = {
  recente: porTemporada,
  antiga: (a, b) => desejoNoFim(a, b) || a.temporada.localeCompare(b.temporada) || porNome(a, b),
  claro: (a, b) => desejoNoFim(a, b) || porClaridade(a, b),
  escuro: (a, b) => desejoNoFim(a, b) || porClaridade(b, a),
};

export const ordenarArara = (lista: Camisa[], ordem: OrdemArara) => [...lista].sort(COMPARAR[ordem]);

// Posição de cada camisa em cada ordem, gravada no HTML para a arara reordenar sem recarregar
export function posicoesNaArara(camisas: Camisa[]) {
  const posicoes = new Map<string, Record<string, number>>(camisas.map((c) => [c.id, {}]));
  for (const ordem of Object.keys(COMPARAR) as OrdemArara[]) {
    ordenarArara(camisas, ordem).forEach((c, i) => (posicoes.get(c.id)![ordem] = i));
  }
  return posicoes;
}

// ---------- Lugares (mapa) ----------

// Uma cidade pode ter vários clubes; o mapa agrupa por cidade e país
export const lugarId = (clube: Camisa['clube']) => slug(`${clube.cidade} ${clube.pais}`);

// ---------- Relacionadas ----------

export type Relacionada = { camisa: Camisa; motivos: string[] };

// Pontos de cada ligação entre duas camisas. O motivo de mais peso vai para a etiqueta.
function ligacoes(a: Camisa, b: Camisa) {
  const lista: { peso: number; motivo?: string }[] = [];
  const mesmoClube = a.clubeId === b.clubeId;
  if (mesmoClube) lista.push({ peso: 12, motivo: a.clube.equipe === 'selecao' ? 'Mesma seleção' : 'Mesmo clube' });
  else if (lugarId(a.clube) === lugarId(b.clube)) {
    lista.push({ peso: 5, motivo: `Também ${a.clube.cidade.startsWith('Rio ') ? 'do' : 'de'} ${a.clube.cidade}` });
  }
  if (a.temporada.slice(0, 4) === b.temporada.slice(0, 4)) lista.push({ peso: 4, motivo: `Também de ${a.temporada.slice(0, 4)}` });
  if (a.fabricante && normalizar(a.fabricante) === normalizar(b.fabricante ?? '')) lista.push({ peso: 3, motivo: `Também ${b.fabricante}` });
  if (a.esporte !== 'futebol' && a.esporte === b.esporte) lista.push({ peso: 3, motivo: `Também de ${a.esporte}` });
  if ([...a.cores].sort().join() === [...b.cores].sort().join()) lista.push({ peso: 3, motivo: 'Mesmas cores' });
  else if (a.cores[0] === b.cores[0]) lista.push({ peso: 2, motivo: `Também em ${CORES[a.cores[0]].rotulo.toLowerCase()}` });
  if (!mesmoClube && a.arara === b.arara) lista.push({ peso: 1, motivo: 'Mesma arara' });
  if (a.tipo === b.tipo) lista.push({ peso: 1 });
  return lista;
}

// Desempate estável, diferente em cada página, para as mesmas camisas não aparecerem sempre
function sorteio(texto: string) {
  let h = 2166136261;
  for (let i = 0; i < texto.length; i++) h = Math.imul(h ^ texto.charCodeAt(i), 16777619);
  return h >>> 0;
}

// As camisas da coleção mais ligadas a esta: mesmo clube, cidade, temporada, fabricante e cores.
// De outro clube, no máximo 3, para a arara não virar só o vizinho de cidade.
export function relacionadas(c: Camisa, todas: Camisa[], quantas = 6): Relacionada[] {
  const porClube = new Map<string, number>();
  return todas
    .filter((o) => o.id !== c.id && o.status === 'colecao')
    .map((o) => {
      const l = ligacoes(c, o).sort((x, y) => y.peso - x.peso);
      return {
        camisa: o,
        pontos: l.reduce((s, x) => s + x.peso, 0),
        motivos: l.flatMap((x) => (x.motivo ? [x.motivo] : [])).slice(0, 2),
        sorteio: sorteio(c.id + o.id),
      };
    })
    .filter((r) => r.pontos >= 3)
    .sort((x, y) => y.pontos - x.pontos || x.sorteio - y.sorteio)
    .filter((r) => {
      const n = (porClube.get(r.camisa.clubeId) ?? 0) + 1;
      porClube.set(r.camisa.clubeId, n);
      return r.camisa.clubeId === c.clubeId || n <= 3;
    })
    .slice(0, quantas)
    .map(({ camisa, motivos }) => ({ camisa, motivos }));
}
