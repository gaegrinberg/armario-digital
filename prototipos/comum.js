// Código compartilhado pelos três protótipos: dados fictícios, silhueta,
// ficha da camisa, filtros e alternância de tema.

const CAMISAS = [
  {
    id: 'vila-serra-1993-titular', numero: 1,
    clube: 'EC Vila Serra', equipe: 'Clube', pais: 'Brasil', liga: 'Brasileirão Série A',
    temporada: '1993', decada: 'Anos 90', tipo: 'Titular', versao: 'Torcedor',
    fabricante: 'Trivela', patrocinador: 'Café Morro Alto', tamanho: 'M',
    nomeNumero: '', autografada: false, conservacao: 'Muito boa',
    origem: 'Presente', aquisicao: '2008-12-24',
    cores: ['#1E6B3A', '#FFFFFF'], padrao: 'liso', status: 'colecao',
    observacoes: 'Presente do meu pai no Natal de 2008. Ele comprou numa feira de antiguidades e jurava que era de jogo. Não é, mas virou a camisa mais importante da coleção.'
  },
  {
    id: 'costa-azul-2004-05-reserva', numero: 2,
    clube: 'Real Costa Azul', equipe: 'Clube', pais: 'Espanha', liga: 'La Liga',
    temporada: '2004/05', decada: 'Anos 2000', tipo: 'Reserva', versao: 'Jogador',
    fabricante: 'Libero', patrocinador: 'Navieras del Sur', tamanho: 'G',
    nomeNumero: 'MARTÍN 8', autografada: false, conservacao: 'Excelente',
    origem: 'Troca', aquisicao: '2016-05-10',
    cores: ['#FFFFFF', '#1B2A4A'], padrao: 'faixa-diagonal', status: 'colecao',
    observacoes: 'Troquei com um colecionador de Valência por duas camisas repetidas.'
  },
  {
    id: 'nordhafen-1997-98-titular', numero: 3,
    clube: 'FC Nordhafen', equipe: 'Clube', pais: 'Alemanha', liga: 'Bundesliga',
    temporada: '1997/98', decada: 'Anos 90', tipo: 'Titular', versao: 'Torcedor',
    fabricante: 'Rondo', patrocinador: 'Hafenbräu', tamanho: 'GG',
    nomeNumero: '', autografada: false, conservacao: 'Boa',
    origem: 'Viagem', aquisicao: '2012-08-03',
    cores: ['#C8102E', '#FFFFFF'], padrao: 'listras-horizontais', status: 'colecao',
    observacoes: 'Achei num brechó perto do porto, no último dia da viagem. Custou menos que o almoço.'
  },
  {
    id: 'valtorre-1989-90-terceira', numero: 4,
    clube: 'AS Valtorre', equipe: 'Clube', pais: 'Itália', liga: 'Serie A',
    temporada: '1989/90', decada: 'Anos 80', tipo: 'Terceira', versao: 'Torcedor',
    fabricante: 'Catenaccio', patrocinador: 'Olio Valtorre', tamanho: 'M',
    nomeNumero: '', autografada: true, conservacao: 'Regular',
    origem: 'Compra', aquisicao: '2021-03-15',
    cores: ['#4B2A7B', '#D4A62A'], padrao: 'liso', status: 'colecao',
    observacoes: 'Assinada pelo camisa 10 da época numa festa do clube. A gola está gasta, mas a assinatura segue nítida.'
  },
  {
    id: 'pampa-2010-11-titular', numero: 5,
    clube: 'CA Pampa', equipe: 'Clube', pais: 'Argentina', liga: 'Primera División',
    temporada: '2010/11', decada: 'Anos 2010', tipo: 'Titular', versao: 'Torcedor',
    fabricante: 'Trivela', patrocinador: 'Banco del Litoral', tamanho: 'M',
    nomeNumero: 'SOSA 9', autografada: false, conservacao: 'Muito boa',
    origem: 'Compra', aquisicao: '2011-07-20',
    cores: ['#7DB9E8', '#FFFFFF'], padrao: 'listras-verticais', status: 'colecao',
    observacoes: ''
  },
  {
    id: 'uruguai-1995-goleiro', numero: 6,
    clube: 'Uruguai', equipe: 'Seleção', pais: 'Uruguai', liga: 'CONMEBOL',
    temporada: '1995', decada: 'Anos 90', tipo: 'Goleiro', versao: 'Jogador',
    fabricante: 'Libero', patrocinador: '', tamanho: 'G',
    nomeNumero: '1', autografada: false, conservacao: 'Boa',
    origem: 'Presente', aquisicao: '2015-10-02',
    cores: ['#C7D72E', '#1A1A1A'], padrao: 'liso', status: 'colecao',
    observacoes: 'Dados fictícios. Na versão real, esta seria a história da camisa.'
  },
  {
    id: 'northgate-1985-86-titular', numero: null,
    clube: 'Northgate Rovers', equipe: 'Clube', pais: 'Inglaterra', liga: 'First Division',
    temporada: '1985/86', decada: 'Anos 80', tipo: 'Titular', versao: 'Torcedor',
    fabricante: 'Rondo', patrocinador: 'Northgate Motors', tamanho: 'M',
    nomeNumero: '', autografada: false, conservacao: '',
    origem: '', aquisicao: '',
    cores: ['#1A1A1A', '#FFFFFF'], padrao: 'listras-verticais', status: 'desejo',
    observacoes: 'A camisa da final de copa que vi numa fita VHS gasta. Procurando em tamanho M.'
  },
  {
    id: 'sporting-mare-2021-22-comemorativa', numero: null,
    clube: 'Sporting Maré', equipe: 'Clube', pais: 'Portugal', liga: 'Primeira Liga',
    temporada: '2021/22', decada: 'Anos 2020', tipo: 'Comemorativa', versao: 'Torcedor',
    fabricante: 'Rondo', patrocinador: 'Conservas Maré', tamanho: '',
    nomeNumero: '', autografada: false, conservacao: '',
    origem: '', aquisicao: '',
    cores: ['#0A6E6E', '#F28C28'], padrao: 'metade', status: 'desejo',
    observacoes: 'Edição do centenário, só 1.922 unidades.'
  }
];

// ---------- Silhueta ----------

let contadorSvg = 0;

// Contorno completo da camisa (frente). As costas têm a gola mais rasa.
const CONTORNO = 'M70 26 L46 35 L14 72 L36 94 L55 79 L54 180 L146 180 L145 79 L164 94 L186 72 L154 35 L130 26';
const CORPO = 'M70 26 L46 35 L55 79 L54 180 L146 180 L145 79 L154 35 L130 26';
const MANGAS = 'M46 35 L14 72 L36 94 L55 79 Z M154 35 L186 72 L164 94 L145 79 Z';

function padraoSvg(padrao, cor) {
  switch (padrao) {
    case 'listras-verticais':
      return [64, 86, 108, 130].map(x => `<rect x="${x}" y="0" width="11" height="200" fill="${cor}"/>`).join('');
    case 'listras-horizontais':
      return [52, 84, 116, 148].map(y => `<rect x="0" y="${y}" width="200" height="14" fill="${cor}"/>`).join('');
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
  const [cor1, cor2 = cor1] = c.cores;
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
    <g clip-path="url(#${id})">${padraoSvg(c.padrao, cor2)}</g>
    <path d="${MANGAS}" fill="${cor2}"/>
    <path d="M14 72 L36 94 M186 72 L164 94" stroke="${cor1}" stroke-width="6"/>
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
  ['Equipe', 'equipe'], ['País', 'pais'], ['Liga', 'liga'], ['Temporada', 'temporada'],
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
