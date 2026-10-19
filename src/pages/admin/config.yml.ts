// Gera a configuração do Sveltia CMS (/admin/config.yml) a partir de src/opcoes.ts,
// para o formulário oferecer exatamente os valores que o esquema aceita.
// O arquivo sai em JSON, que também é YAML válido.
import { CONFIG } from '../../config';
import {
  CONSERVACAO, CORES, EQUIPES, MANGAS, ORIGENS, PADROES, STATUS, TAMANHOS, TIPOS, UFS, VERSOES,
} from '../../opcoes';
import { todasAsCamisas } from '../../lib/camisas';

const opcoes = (o: Record<string, string>) => Object.entries(o).map(([value, label]) => ({ label, value }));
const opcional = { required: false };

export async function GET() {
  // O CMS não tem sugestões em campo de texto; a dica lista os fabricantes já usados
  const fabricantes = [...new Set((await todasAsCamisas()).map((c) => c.fabricante).filter(Boolean))].sort();

  const config = {
    backend: {
      name: 'github',
      repo: CONFIG.repositorio,
      branch: 'main',
      commit_messages: {
        create: 'Cadastra {{collection}} “{{slug}}”',
        update: 'Atualiza {{collection}} “{{slug}}”',
        delete: 'Remove {{collection}} “{{slug}}”',
        uploadMedia: 'Envia “{{path}}”',
        deleteMedia: 'Apaga “{{path}}”',
      },
    },
    site_url: `${import.meta.env.SITE}${import.meta.env.BASE_URL}`.replace(/\/?$/, '/'),
    media_folder: 'public/imagens',
    public_folder: '/imagens',
    // Fotos convertidas no próprio celular antes do envio: WebP, até 2000 px
    media_libraries: {
      default: {
        config: {
          slugify_filename: true,
          transformations: { raster_image: { format: 'webp', quality: 85, width: 2000, height: 2000 } },
        },
      },
    },
    // Nomes de pasta sem acento nem barra: "São Paulo 2019/20" vira "sao-paulo-2019-20"
    slug: { encoding: 'ascii', clean_accents: true, sanitize_replacement: '-' },
    collections: [
      {
        name: 'camisas',
        label: 'Camisas',
        label_singular: 'Camisa',
        folder: 'src/content/camisas',
        path: '{{slug}}/index',
        slug: '{{clube}}-{{temporada}}-{{tipo}}',
        media_folder: '',
        public_folder: '',
        create: true,
        summary: '{{clube}} {{temporada}} · {{tipo}} ({{status}})',
        sortable_fields: ['clube', 'temporada', 'aquisicao'],
        preview_path: 'camisa/{{slug}}/',
        fields: [
          { name: 'clube', label: 'Clube ou seleção', widget: 'relation', collection: 'clubes', value_field: '{{slug}}', display_fields: ['nome'], search_fields: ['nome', 'cidade', 'pais'], hint: 'Não está na lista? Cadastre primeiro em Clubes.' },
          { name: 'temporada', label: 'Temporada', widget: 'string', pattern: ['^\\d{4}(/\\d{2})?$', 'Use 2019 ou 2019/20'] },
          { name: 'tipo', label: 'Tipo', widget: 'select', options: opcoes(TIPOS) },
          { name: 'status', label: 'Status', widget: 'select', options: opcoes(STATUS), default: 'colecao' },
          { name: 'cores', label: 'Cores principais', widget: 'select', multiple: true, min: 1, max: 3, options: Object.entries(CORES).map(([value, c]) => ({ label: c.rotulo, value })), hint: 'De 1 a 3, a principal primeiro. Usadas no filtro e na silhueta.' },
          { name: 'padrao', label: 'Padrão', widget: 'select', options: opcoes(PADROES), default: 'liso' },
          {
            name: 'fotos', label: 'Fotos', widget: 'object', ...opcional,
            fields: [
              { name: 'frente', label: 'Frente', widget: 'image', ...opcional },
              { name: 'verso', label: 'Verso', widget: 'image', ...opcional },
              {
                name: 'detalhes', label: 'Detalhes', widget: 'list', ...opcional, label_singular: 'detalhe',
                fields: [
                  { name: 'foto', label: 'Foto', widget: 'image' },
                  { name: 'legenda', label: 'Legenda', widget: 'string', ...opcional },
                ],
              },
            ],
          },
          { name: 'fabricante', label: 'Fabricante', widget: 'string', ...opcional, hint: fabricantes.length ? `Já usados: ${fabricantes.join(', ')}` : undefined },
          { name: 'patrocinador', label: 'Patrocinador principal', widget: 'string', ...opcional },
          { name: 'versao', label: 'Versão', widget: 'select', options: opcoes(VERSOES), default: 'torcedor', ...opcional },
          { name: 'manga', label: 'Manga', widget: 'select', options: opcoes(MANGAS), default: 'curta', ...opcional },
          { name: 'tamanho', label: 'Tamanho', widget: 'select', options: opcoes(TAMANHOS), ...opcional },
          { name: 'nomeNumero', label: 'Nome e número', widget: 'string', ...opcional, hint: 'Ex.: ADRIANO 100' },
          { name: 'patches', label: 'Patches', widget: 'list', ...opcional },
          { name: 'autografada', label: 'Autografada', widget: 'boolean', default: false, ...opcional },
          { name: 'retro', label: 'Relançamento (retrô)', widget: 'boolean', default: false, ...opcional },
          { name: 'esporte', label: 'Esporte', widget: 'string', default: 'futebol', ...opcional },
          { name: 'conservacao', label: 'Conservação', widget: 'select', options: opcoes(CONSERVACAO), ...opcional },
          { name: 'origem', label: 'Como conseguiu', widget: 'select', options: opcoes(ORIGENS), ...opcional },
          { name: 'aquisicao', label: 'Data de aquisição', widget: 'string', ...opcional, pattern: ['^\\d{4}(-\\d{2}(-\\d{2})?)?$', 'Use 2019, 2019-06 ou 2019-06-10'] },
          { name: 'tags', label: 'Etiquetas livres', widget: 'list', ...opcional, hint: 'Ex.: copa, presente do pai' },
          { name: 'body', label: 'História', widget: 'markdown', ...opcional },
        ],
      },
      {
        name: 'clubes',
        label: 'Clubes',
        label_singular: 'Clube',
        folder: 'src/content/clubes',
        extension: 'yml',
        format: 'yml',
        slug: '{{nome}}',
        identifier_field: 'nome',
        create: true,
        summary: '{{nome}} ({{cidade}})',
        fields: [
          { name: 'nome', label: 'Nome', widget: 'string' },
          { name: 'equipe', label: 'Equipe', widget: 'select', options: opcoes(EQUIPES), default: 'clube' },
          { name: 'pais', label: 'País', widget: 'string', default: 'Brasil' },
          { name: 'uf', label: 'Estado (UF)', widget: 'select', options: Object.entries(UFS).map(([value, u]) => ({ label: `${value} · ${u.nome}`, value })), ...opcional, hint: 'Obrigatório para clube brasileiro. Define a arara da região.' },
          { name: 'liga', label: 'Liga ou confederação', widget: 'string', ...opcional },
          { name: 'cidade', label: 'Cidade', widget: 'string', hint: 'Para seleção, a capital do país.' },
          { name: 'estadio', label: 'Estádio', widget: 'string', ...opcional, hint: 'Nome curto, como aparece no mapa. Ex.: Morumbi, Maracanã.' },
          {
            name: 'coordenadas', label: 'Local no mapa', widget: 'map', type: 'Point', decimals: 5, ...opcional,
            hint: 'Busque o estádio pelo nome ou endereço na caixa do mapa, ou clique no ponto. Para seleção, um estádio da capital. Sem ponto, o clube fica fora do mapa.',
          },
        ],
      },
    ],
  };
  return new Response(JSON.stringify(config, null, 2), { headers: { 'Content-Type': 'text/yaml; charset=utf-8' } });
}
