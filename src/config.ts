// Configurações do site que não são dados de uma camisa.
export const CONFIG = {
  titulo: 'Armário Digital',
  // Id do clube (nome do arquivo em src/content/clubes, sem .yml) que ganha a arara em destaque
  timeDoCoracao: 'sao-paulo',
  // Repositório onde o CMS grava as camisas ("dono/repo"). Vem do GitHub Actions,
  // calculado em astro.config.mjs; não precisa mudar aqui.
  repositorio: import.meta.env.REPOSITORIO as string,
};
