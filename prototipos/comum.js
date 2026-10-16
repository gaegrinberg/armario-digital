// Código compartilhado pelos três protótipos: dados fictícios, silhueta,
// ficha da camisa, filtros e alternância de tema.

// Dados fictícios: clubes reais, mas fabricantes, patrocinadores e histórias inventados.
// Configuração do site: o clube que ganha a arara em destaque.
const CONFIG = { timeDoCoracao: 'São Paulo FC' };

const SPFC = ['#FFFFFF', '#D7192D', '#111111'];

function camisa(d) {
  return {
    equipe: 'Clube', pais: 'Brasil', liga: 'Brasileirão Série A', versao: 'Torcedor',
    patrocinador: '', tamanho: 'M', nomeNumero: '', autografada: false, conservacao: 'Muito boa',
    origem: 'Compra', aquisicao: '', padrao: 'liso', status: 'colecao', observacoes: '', numero: null,
    ...d,
    decada: 'Anos ' + (d.temporada.startsWith('20') ? d.temporada.slice(0, 3) + '0' : d.temporada.slice(2, 3) + '0')
  };
}

const CAMISAS = [
  camisa({ id: 'sao-paulo-2024-titular', numero: 1, clube: 'São Paulo FC', uf: 'SP', temporada: '2024', tipo: 'Titular',
    fabricante: 'Trivela', patrocinador: 'Banco Garoa', cores: SPFC, padrao: 'faixa-peito',
    origem: 'Compra', aquisicao: '2024-02-03',
    observacoes: 'Comprada na semana do lançamento, na fila da loja do estádio. Estreou no primeiro clássico do ano.' }),
  camisa({ id: 'sao-paulo-2023-reserva', numero: 2, clube: 'São Paulo FC', uf: 'SP', temporada: '2023', tipo: 'Reserva',
    versao: 'Jogador', fabricante: 'Trivela', patrocinador: 'Banco Garoa', nomeNumero: 'LUCAS 7',
    cores: ['#D7192D', '#FFFFFF', '#111111'], padrao: 'listras-verticais', aquisicao: '2023-10-01',
    observacoes: 'A camisa da campanha da Copa do Brasil. Fiquei três meses procurando no meu tamanho.' }),
  camisa({ id: 'sao-paulo-2021-terceira', numero: 3, clube: 'São Paulo FC', uf: 'SP', temporada: '2021', tipo: 'Terceira',
    fabricante: 'Trivela', cores: ['#111111', '#D7192D'], autografada: true, origem: 'Presente', aquisicao: '2021-12-24',
    observacoes: 'Presente de Natal, autografada pelo elenco num evento de sócios.' }),
  camisa({ id: 'sao-paulo-2019-goleiro', numero: 4, clube: 'São Paulo FC', uf: 'SP', temporada: '2019', tipo: 'Goleiro',
    fabricante: 'Rondo', nomeNumero: '1', cores: ['#2B6CD4', '#111111'], conservacao: 'Boa', aquisicao: '2020-01-15' }),
  camisa({ id: 'sao-paulo-2016-titular', numero: 5, clube: 'São Paulo FC', uf: 'SP', temporada: '2016', tipo: 'Titular',
    fabricante: 'Rondo', cores: SPFC, padrao: 'faixa-peito', conservacao: 'Boa', origem: 'Troca', aquisicao: '2017-06-10',
    observacoes: 'A mais antiga da arara. Troquei por uma camisa do Santos com um colega de faculdade.' }),
  camisa({ id: 'cruzeiro-2022-titular', numero: 6, clube: 'Cruzeiro', uf: 'MG', temporada: '2022', tipo: 'Titular',
    liga: 'Brasileirão Série B', fabricante: 'Libero', cores: ['#1B3F9C', '#FFFFFF'], origem: 'Viagem', aquisicao: '2022-07-20' }),
  camisa({ id: 'botafogo-2023-titular', numero: 7, clube: 'Botafogo', uf: 'RJ', temporada: '2023', tipo: 'Titular',
    fabricante: 'Libero', cores: ['#111111', '#FFFFFF'], padrao: 'listras-verticais', origem: 'Viagem', aquisicao: '2023-04-08',
    observacoes: 'Comprada no Rio, num camelô na saída do Engenhão.' }),
  camisa({ id: 'bahia-2021-titular', numero: 8, clube: 'Bahia', uf: 'BA', temporada: '2021', tipo: 'Titular',
    fabricante: 'Pelada', cores: ['#FFFFFF', '#1E3E8C', '#D2232A'], padrao: 'faixa-peito', origem: 'Viagem', aquisicao: '2022-01-05' }),
  camisa({ id: 'fortaleza-2023-reserva', numero: 9, clube: 'Fortaleza', uf: 'CE', temporada: '2023', tipo: 'Reserva',
    fabricante: 'Pelada', cores: ['#D2232A', '#1E3E8C', '#FFFFFF'], padrao: 'listras-horizontais', origem: 'Troca', aquisicao: '2024-03-12' }),
  camisa({ id: 'paysandu-2022-titular', numero: 10, clube: 'Paysandu', uf: 'PA', temporada: '2022', tipo: 'Titular',
    liga: 'Brasileirão Série C', fabricante: 'Catenaccio', cores: ['#5BB6E8', '#FFFFFF'], padrao: 'listras-verticais',
    origem: 'Presente', aquisicao: '2022-11-30', observacoes: 'Trazida de Belém por um amigo paraense que jura que é a camisa mais bonita do Brasil.' }),
  camisa({ id: 'goias-2020-titular', numero: 11, clube: 'Goiás', uf: 'GO', temporada: '2020', tipo: 'Titular',
    fabricante: 'Libero', cores: ['#0B6B3A', '#FFFFFF'], conservacao: 'Regular', aquisicao: '2021-02-02' }),
  camisa({ id: 'internacional-2019-reserva', numero: 12, clube: 'Internacional', uf: 'RS', temporada: '2019', tipo: 'Reserva',
    fabricante: 'Rondo', cores: ['#FFFFFF', '#C8102E'], aquisicao: '2019-09-14' }),
  camisa({ id: 'boca-2018-titular', numero: 13, clube: 'Boca Juniors', uf: '', pais: 'Argentina', liga: 'Primera División',
    temporada: '2018', tipo: 'Titular', fabricante: 'Rondo', cores: ['#0B3D91', '#F2C230'], padrao: 'faixa-peito',
    origem: 'Viagem', aquisicao: '2018-05-19', observacoes: 'Única gringa da coleção, comprada na viagem a Buenos Aires.' }),
  camisa({ id: 'sao-paulo-2025-comemorativa', clube: 'São Paulo FC', uf: 'SP', temporada: '2025', tipo: 'Comemorativa',
    fabricante: 'Trivela', cores: SPFC, padrao: 'faixa-peito', status: 'desejo', conservacao: '', origem: '',
    observacoes: 'Edição limitada de aniversário. Esgotou em dois dias.' }),
  camisa({ id: 'sport-2022-titular', clube: 'Sport', uf: 'PE', temporada: '2022', tipo: 'Titular',
    liga: 'Brasileirão Série B', fabricante: 'Pelada', cores: ['#D2232A', '#111111'], padrao: 'listras-horizontais',
    status: 'desejo', conservacao: '', origem: '' })
];

// Regiões do IBGE e posição de cada UF no mapa de quadradinhos [coluna, linha]
const REGIOES = ['Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul'];
const UFS = {
  RR: ['Norte', 1, 0], AP: ['Norte', 3, 0],
  AM: ['Norte', 1, 1], PA: ['Norte', 2, 1], MA: ['Nordeste', 3, 1], CE: ['Nordeste', 4, 1], RN: ['Nordeste', 5, 1],
  AC: ['Norte', 0, 2], RO: ['Norte', 1, 2], TO: ['Norte', 2, 2], PI: ['Nordeste', 3, 2], PE: ['Nordeste', 4, 2], PB: ['Nordeste', 5, 2],
  MT: ['Centro-Oeste', 1, 3], GO: ['Centro-Oeste', 2, 3], BA: ['Nordeste', 3, 3], SE: ['Nordeste', 4, 3], AL: ['Nordeste', 5, 3],
  MS: ['Centro-Oeste', 1, 4], DF: ['Centro-Oeste', 2, 4], MG: ['Sudeste', 3, 4], ES: ['Sudeste', 4, 4],
  PR: ['Sul', 1, 5], SP: ['Sudeste', 2, 5], RJ: ['Sudeste', 3, 5],
  SC: ['Sul', 1, 6],
  RS: ['Sul', 1, 7]
};

function regiao(c) {
  return c.uf ? UFS[c.uf][0] : 'Gringas';
}

// ---------- Silhueta ----------

let contadorSvg = 0;

// Contorno completo da camisa (frente). As costas têm a gola mais rasa.
const CONTORNO = 'M70 26 L46 35 L14 72 L36 94 L55 79 L54 180 L146 180 L145 79 L164 94 L186 72 L154 35 L130 26';
const CORPO = 'M70 26 L46 35 L55 79 L54 180 L146 180 L145 79 L154 35 L130 26';
const MANGAS = 'M46 35 L14 72 L36 94 L55 79 Z M154 35 L186 72 L164 94 L145 79 Z';

// Com uma terceira cor, as listras alternam entre a cor 2 e a cor 3.
function padraoSvg(padrao, cor, cor3 = cor) {
  const alterna = i => (i % 2 ? cor3 : cor);
  switch (padrao) {
    case 'listras-verticais':
      return [64, 86, 108, 130].map((x, i) => `<rect x="${x}" y="0" width="11" height="200" fill="${alterna(i)}"/>`).join('');
    case 'listras-horizontais':
      return [52, 84, 116, 148].map((y, i) => `<rect x="0" y="${y}" width="200" height="14" fill="${alterna(i)}"/>`).join('');
    case 'faixa-peito':
      return cor3 === cor
        ? `<rect x="0" y="66" width="200" height="22" fill="${cor}"/>`
        : `<rect x="0" y="64" width="200" height="14" fill="${cor}"/><rect x="0" y="78" width="200" height="12" fill="${cor3}"/>`;
    case 'faixa-diagonal':
      return `<rect x="-40" y="92" width="280" height="24" fill="${cor}" transform="rotate(42 100 100)"/>`;
    case 'metade':
      return `<rect x="100" y="0" width="100" height="200" fill="${cor}"/>`;
    default:
      return '';
  }
}

function silhueta(c, { costas = false, rotulo = true } = {}) {
  const id = 'cam' + (++contadorSvg);
  const [cor1, cor2 = cor1, cor3 = cor2] = c.cores;
  // Na faixa no peito as mangas seguem o corpo; nos outros padrões, a cor 2
  const corManga = c.padrao === 'faixa-peito' ? cor1 : cor2;
  const corPunho = corManga === cor1 ? cor2 : cor1;
  const gola = costas ? 'Q100 34 70 26' : 'Q100 46 70 26';
  const corpo = `${CORPO} ${gola} Z`;
  const contorno = `${CONTORNO} ${gola} Z`;
  const nome = costas && c.nomeNumero ? textoCostas(c.nomeNumero, corLegivel(cor1, cor2)) : '';
  const aria = rotulo
    ? `role="img" aria-label="Silhueta da camisa ${c.clube} ${c.temporada}${costas ? ', costas' : ''}"`
    : 'aria-hidden="true"';
  return `<svg class="silhueta" viewBox="8 18 184 168" ${aria}>
    <defs><clipPath id="${id}"><path d="${corpo}"/></clipPath></defs>
    <path d="${corpo}" fill="${cor1}"/>
    <g clip-path="url(#${id})">${padraoSvg(c.padrao, cor2, cor3)}</g>
    <path d="${MANGAS}" fill="${corManga}"/>
    <path d="M14 72 L36 94 M186 72 L164 94" stroke="${corPunho}" stroke-width="6"/>
    <path d="M130 26 ${gola}" fill="none" stroke="${cor2}" stroke-width="6"/>
    ${nome}
    <path d="${contorno}" fill="none" stroke="var(--contorno-camisa)" stroke-width="1.5" stroke-linejoin="round"/>
  </svg>`;
}

// Nome e número usam a cor 2 se ela contrastar com a cor 1; senão, preto ou branco.
function corLegivel(fundo, preferida) {
  const lum = hex => {
    const [r, g, b] = [1, 3, 5].map(i => {
      const v = parseInt(hex.slice(i, i + 2), 16) / 255;
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const contraste = (a, b) => (Math.max(lum(a), lum(b)) + 0.05) / (Math.min(lum(a), lum(b)) + 0.05);
  if (contraste(fundo, preferida) >= 3) return preferida;
  return contraste(fundo, '#111111') > contraste(fundo, '#FFFFFF') ? '#111111' : '#FFFFFF';
}

function textoCostas(nomeNumero, cor) {
  const partes = nomeNumero.trim().split(/\s+/);
  const numero = /^\d+$/.test(partes.at(-1)) ? partes.pop() : '';
  const nome = partes.join(' ');
  return `<g fill="${cor}" font-family="Arial, sans-serif" font-weight="700" text-anchor="middle">
    ${nome ? `<text x="100" y="62" font-size="13" letter-spacing="1">${nome}</text>` : ''}
    ${numero ? `<text x="100" y="${nome ? 126 : 118}" font-size="58">${numero}</text>` : ''}
  </g>`;
}

// ---------- Filtros ----------

function filtrar(lista, { busca = '', filtros = {} } = {}) {
  const termo = normalizar(busca);
  return lista.filter(c => {
    for (const [campo, valor] of Object.entries(filtros)) {
      if (valor && c[campo] !== valor) return false;
    }
    if (!termo) return true;
    const texto = normalizar([c.clube, c.pais, c.liga, c.temporada, c.tipo, c.fabricante, c.patrocinador, c.nomeNumero, c.observacoes].join(' '));
    return texto.includes(termo);
  });
}

function contar(lista, campo) {
  const mapa = new Map();
  for (const c of lista) mapa.set(c[campo], (mapa.get(c[campo]) || 0) + 1);
  return [...mapa.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'pt'));
}

const ORDENS = {
  numero: (a, b) => (a.numero ?? 999) - (b.numero ?? 999),
  temporada: (a, b) => a.temporada.localeCompare(b.temporada),
  clube: (a, b) => a.clube.localeCompare(b.clube, 'pt'),
  cor: (a, b) => chaveCor(a.cores[0]) - chaveCor(b.cores[0])
};

// Ordena pelo matiz; neutros (pouca saturação) vão para o fim, do claro ao escuro.
function chaveCor(hex) {
  const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  const luz = (max + min) / 2;
  const sat = d === 0 ? 0 : d / (1 - Math.abs(2 * luz - 1));
  if (sat < 0.15) return 1000 + (1 - luz) * 100;
  let h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return (h * 60 + 360) % 360;
}

function normalizar(s) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

function titulo(c) {
  return `${c.clube} ${c.temporada}`;
}

// ---------- Ficha da camisa ----------

const CAMPOS_FICHA = [
  ['Equipe', 'equipe'], ['Estado', 'uf'], ['País', 'pais'], ['Liga', 'liga'], ['Temporada', 'temporada'],
  ['Tipo', 'tipo'], ['Versão', 'versao'], ['Fabricante', 'fabricante'],
  ['Patrocinador', 'patrocinador'], ['Tamanho', 'tamanho'], ['Nome e número', 'nomeNumero'],
  ['Autografada', 'autografada'], ['Conservação', 'conservacao'],
  ['Como conseguiu', 'origem'], ['Aquisição', 'aquisicao']
];

function formatarValor(campo, valor) {
  if (campo === 'autografada') return valor ? 'Sim' : 'Não';
  if (campo === 'aquisicao' && valor) {
    const [a, m, d] = valor.split('-');
    return `${d}/${m}/${a}`;
  }
  return valor;
}

function abrirFicha(c, { prefixoNumero = 'Nº' } = {}) {
  let dialogo = document.getElementById('ficha');
  if (!dialogo) {
    dialogo = document.createElement('dialog');
    dialogo.id = 'ficha';
    dialogo.addEventListener('click', e => { if (e.target === dialogo) dialogo.close(); });
    document.body.append(dialogo);
  }
  const linhas = CAMPOS_FICHA
    .filter(([, campo]) => campo === 'autografada' || c[campo])
    .map(([rotulo, campo]) => `<dt>${rotulo}</dt><dd>${formatarValor(campo, c[campo])}</dd>`)
    .join('');
  const numero = c.numero ? `${prefixoNumero} ${String(c.numero).padStart(3, '0')}` : 'Lista de desejos';
  dialogo.innerHTML = `
    <div class="ficha">
      <button class="ficha-fechar" type="button" aria-label="Fechar">×</button>
      <div class="ficha-foto">
        <div class="ficha-placa">${silhueta(c)}</div>
        <div class="ficha-lados" role="group" aria-label="Lado da camisa">
          <button type="button" aria-pressed="true" data-lado="frente">Frente</button>
          <button type="button" aria-pressed="false" data-lado="costas">Costas</button>
        </div>
      </div>
      <div class="ficha-texto">
        <p class="ficha-numero">${numero}</p>
        <h2>${titulo(c)}</h2>
        <p class="ficha-sub">${c.tipo} · ${c.versao}</p>
        ${c.observacoes ? `<p class="ficha-historia">${c.observacoes}</p>` : ''}
        <dl class="ficha-campos">${linhas}</dl>
      </div>
    </div>`;
  dialogo.querySelector('.ficha-fechar').addEventListener('click', () => dialogo.close());
  dialogo.querySelectorAll('[data-lado]').forEach(botao => {
    botao.addEventListener('click', () => {
      const costas = botao.dataset.lado === 'costas';
      dialogo.querySelector('.ficha-placa').innerHTML = silhueta(c, { costas });
      dialogo.querySelectorAll('[data-lado]').forEach(b => b.setAttribute('aria-pressed', String(b === botao)));
    });
  });
  dialogo.showModal();
}

// ---------- Tema ----------

const TEMAS = [
  { valor: 'auto', rotulo: 'Auto', nome: 'automático' },
  { valor: 'light', rotulo: 'Claro', nome: 'claro' },
  { valor: 'dark', rotulo: 'Escuro', nome: 'escuro' }
];

function configurarTema(botao) {
  let atual = 'auto';
  try { atual = localStorage.getItem('tema') || 'auto'; } catch (e) {}
  const aplicar = valor => {
    if (valor === 'auto') delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = valor;
    const tema = TEMAS.find(t => t.valor === valor);
    botao.textContent = '◐ ' + tema.rotulo;
    botao.setAttribute('aria-label', `Tema: ${tema.nome}. Toque para trocar.`);
    try { localStorage.setItem('tema', valor); } catch (e) {}
  };
  aplicar(atual);
  botao.addEventListener('click', () => {
    const i = TEMAS.findIndex(t => t.valor === atual);
    atual = TEMAS[(i + 1) % TEMAS.length].valor;
    aplicar(atual);
  });
}
