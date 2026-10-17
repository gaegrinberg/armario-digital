// Camisa do dia: a mesma conta roda no build e no navegador, então todo mundo vê a mesma camisa
// na mesma data. A coleção é embaralhada em ciclos: cada camisa aparece uma vez a cada N dias.

export type Data = { ano: number; mes: number; dia: number };

const SEMANA = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

// Data local de quem abre a página (no build, a de Brasília)
export function hoje(fuso?: string): Data {
  const [ano, mes, dia] = new Intl.DateTimeFormat('en-CA', { timeZone: fuso })
    .format(new Date()).split('-').map(Number);
  return { ano, mes, dia };
}

// Textos da folhinha: "out", "17", "sábado" e a data por extenso para leitores de tela
export function folhinha({ ano, mes, dia }: Data) {
  const semana = SEMANA[new Date(Date.UTC(ano, mes - 1, dia)).getUTCDay()];
  return {
    mes: MESES[mes - 1].slice(0, 3),
    dia: String(dia),
    semana,
    extenso: `${semana === 'sábado' || semana === 'domingo' ? semana : semana + '-feira'}, ${dia} de ${MESES[mes - 1]}`,
    iso: `${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`,
  };
}

// Gerador de números com semente (mulberry32)
function sorteador(semente: number) {
  return () => {
    semente = (semente + 0x6d2b79f5) | 0;
    let t = Math.imul(semente ^ (semente >>> 15), 1 | semente);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function embaralhar(ids: string[], ciclo: number) {
  const lista = [...ids];
  const sorte = sorteador(ciclo * 7919 + 17);
  for (let i = lista.length - 1; i > 0; i--) {
    const j = Math.floor(sorte() * (i + 1));
    [lista[i], lista[j]] = [lista[j], lista[i]];
  }
  return lista;
}

// Os ids precisam vir sempre na mesma ordem (por id) para o build e o navegador concordarem
export function camisaDoDia(ids: string[], data: Data): string | undefined {
  if (!ids.length) return undefined;
  const n = ids.length;
  const dias = Math.floor(Date.UTC(data.ano, data.mes - 1, data.dia) / 86400000);
  const ciclo = Math.floor(dias / n);
  const ordem = embaralhar(ids, ciclo);
  // Na virada do ciclo, a primeira do novo não repete a última do anterior
  if (n > 1 && ordem[0] === embaralhar(ids, ciclo - 1)[n - 1]) [ordem[0], ordem[1]] = [ordem[1], ordem[0]];
  return ordem[dias % n];
}
