// Caminho dentro do site, respeitando a base do GitHub Pages (/armario-digital/)
export function link(caminho: string) {
  return import.meta.env.BASE_URL.replace(/\/?$/, '/') + caminho.replace(/^\//, '');
}
