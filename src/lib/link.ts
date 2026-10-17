// Caminho dentro do site, respeitando a base do GitHub Pages (/armario-digital/, ou / num
// repositório dono.github.io). A base é definida em astro.config.mjs.
export function link(caminho: string) {
  return import.meta.env.BASE_URL.replace(/\/?$/, '/') + caminho.replace(/^\//, '');
}
