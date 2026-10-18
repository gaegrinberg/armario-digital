import { defineConfig } from 'astro/config';

// O endereço vem do repositório. No GitHub Actions, GITHUB_REPOSITORY traz "dono/repo" e o
// site sai em https://dono.github.io/repo/. No computador, vale o Armário original:
// https://gaegrinberg.github.io/armario-digital/
const repositorio = process.env.GITHUB_REPOSITORY || 'gaegrinberg/armario-digital';
const [dono, repo] = repositorio.split('/');
// Um repositório chamado dono.github.io é publicado na raiz, sem /repo
const naRaiz = repo.toLowerCase() === `${dono.toLowerCase()}.github.io`;

export default defineConfig({
  site: `https://${dono.toLowerCase()}.github.io`,
  base: naRaiz ? '/' : `/${repo}`,
  trailingSlash: 'always',
  // A barra de ferramentas do Astro (só no npm run dev) ficava em cima da barra de seções
  devToolbar: { enabled: false },
  // Lido em src/config.ts, para o CMS gravar no repositório certo
  vite: { define: { 'import.meta.env.REPOSITORIO': JSON.stringify(repositorio) } },
});
