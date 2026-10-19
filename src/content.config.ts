// Esquema dos dados. Um erro de digitação num arquivo quebra o build com uma
// mensagem que diz o arquivo, o campo e os valores aceitos.
import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import {
  CONSERVACAO, CORES, EQUIPES, MANGAS, ORIGENS, PADROES, STATUS, TAMANHOS, TIPOS, UFS, VERSOES, chaves,
} from './opcoes';

z.config(z.locales.ptBR());

// Lista fechada, com a mensagem no formato: valor inválido "titula". Esperado: titular | reserva | …
const escolha = <T extends object>(opcoes: T) => {
  const valores = chaves(opcoes);
  return z.enum(valores, {
    error: (issue) => `valor inválido ${JSON.stringify(issue.input)}. Esperado: ${valores.join(' | ')}`,
  });
};

// O CMS grava campos vazios como '' ou null; aqui eles contam como ausentes.
const opcional = <S extends z.ZodType>(schema: S) =>
  z.preprocess((v) => (v === '' || v === null ? undefined : v), schema.optional());

// O YAML lê 2019 como número e 2019-06-10 como data. Tudo volta a ser texto.
const texto = z.preprocess(
  (v) => (typeof v === 'number' ? String(v) : v instanceof Date ? v.toISOString().slice(0, 10) : v),
  z.string().trim().min(1),
);

const temporada = texto.pipe(
  z.string().regex(/^\d{4}(\/\d{2})?$/, 'use o formato 2019 ou 2019/20'),
);

const dataParcial = texto.pipe(
  z.string().regex(/^\d{4}(-\d{2}(-\d{2})?)?$/, 'use o formato 2019, 2019-06 ou 2019-06-10'),
);

// Caminho de uma foto na pasta da camisa. A existência do arquivo é conferida em src/lib/fotos.ts.
const foto = z.string().regex(/\.(webp|jpe?g|png|avif)$/i, 'a foto precisa ser .webp, .jpg, .png ou .avif');

const listaDeTextos = z.preprocess((v) => (v == null ? [] : v), z.array(texto));

const clubes = defineCollection({
  loader: glob({ pattern: '*.yml', base: './src/content/clubes' }),
  schema: z
    .object({
      nome: texto,
      equipe: escolha(EQUIPES),
      pais: texto,
      uf: opcional(escolha(UFS)),
      liga: opcional(texto),
      cidade: texto,
      estadio: opcional(texto),
      // O campo de mapa do CMS grava um GeoJSON em texto ('{"type":"Point","coordinates":[lon,lat]}')
      // e '' quando fica vazio. O formato antigo, { lat, lon }, continua aceito.
      coordenadas: z.preprocess(
        (v: any) => {
          if (typeof v === 'string' && v.trim()) {
            try { v = JSON.parse(v); } catch { return v; }
          }
          if (v?.type === 'Point' && Array.isArray(v.coordinates)) return { lat: v.coordinates[1], lon: v.coordinates[0] };
          return v && v.lat != null && v.lon != null ? v : undefined;
        },
        z.object({ lat: z.number().min(-90).max(90), lon: z.number().min(-180).max(180) }, {
          error: 'marque um ponto no mapa (o GeoJSON não foi entendido)',
        }).optional(),
      ),
    })
    .refine((c) => !(c.equipe === 'clube' && c.pais === 'Brasil' && !c.uf), {
      message: 'clube brasileiro precisa da uf (sigla do estado)',
      path: ['uf'],
    }),
});

const camisas = defineCollection({
  loader: glob({
    pattern: '*/index.md',
    base: './src/content/camisas',
    generateId: ({ entry }) => entry.replace(/\/index\.md$/, ''),
  }),
  schema: z.object({
    clube: reference('clubes'),
    temporada,
    tipo: escolha(TIPOS),
    esporte: opcional(texto).default('futebol'),
    retro: opcional(z.boolean()).default(false),
    versao: opcional(escolha(VERSOES)).default('torcedor'),
    manga: opcional(escolha(MANGAS)).default('curta'),
    fabricante: opcional(texto),
    patrocinador: opcional(texto),
    tamanho: opcional(escolha(TAMANHOS)),
    nomeNumero: opcional(texto),
    patches: listaDeTextos,
    autografada: opcional(z.boolean()).default(false),
    conservacao: opcional(escolha(CONSERVACAO)),
    origem: opcional(escolha(ORIGENS)),
    aquisicao: opcional(dataParcial),
    cores: z.array(escolha(CORES)).min(1, 'escolha pelo menos 1 cor').max(3, 'escolha no máximo 3 cores'),
    padrao: opcional(escolha(PADROES)).default('liso'),
    fotos: z
      .preprocess(
        (v) => v ?? {},
        z.object({
          frente: opcional(foto),
          verso: opcional(foto),
          detalhes: z.preprocess(
            (v) => v ?? [],
            z.array(z.object({ foto, legenda: opcional(texto) })),
          ),
        }),
      ),
    tags: listaDeTextos,
    status: opcional(escolha(STATUS)).default('colecao'),
  }),
});

export const collections = { clubes, camisas };
