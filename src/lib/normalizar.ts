// Minúsculas e sem acento, para "Goiás" e "goias" darem no mesmo na busca
export const normalizar = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
