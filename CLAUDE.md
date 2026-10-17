# Armário Digital

Site pessoal e estático (GitHub Pages) para catalogar uma coleção de camisas de futebol. O plano completo, com as etapas e os checkpoints, está em `armario-digital-plano.md`. Leia esse arquivo antes de qualquer trabalho. Interface e documentação em português.

## Estado atual

- **Etapa 1 (pesquisa): aprovada.** Ver `docs/referencias.md`. A síntese da primeira rodada vale para a v1; a segunda rodada, no fim do arquivo, traz as referências brasileiras.
- **Etapa 2 (design): aprovada.** A direção escolhida é a **Arara do Brasil**, descrita na última seção de `docs/design.md`. O protótipo é `prototipos/arara.html`. Os protótipos museu e álbum ficam só como histórico, mas a grade do museu pode virar a visão "ver em grade".
- **Etapa 3 (arquitetura): respondida em 17/10/2026.** Ver `docs/arquitetura.md`, com as decisões no fim. Stack: Astro, Sveltia CMS com token pessoal, rembg/birefnet no GitHub Actions e cores escolhidas numa paleta fixa de 13.
- **Etapa 4 (primeira versão): publicada em 17/10/2026, aguardando o Checkpoint 4.** Site no ar em <https://gaegrinberg.github.io/armario-digital/>, com arara, grade com filtros na URL, página da camisa, lista de desejos, CMS (`/admin/`), recorte (`scripts/recortar.py`) e workflow de publicação (`.github/workflows/site.yml`). O dono testou o CMS (cadastrou o clube Sergipe) e aprovou. A conferência do checklist e a proposta da Etapa 5 (esforços, recomendação e a decisão do fundo do mapa) estão em `docs/etapa5.md`. O dono aprovou todas as ideias (mapa com OpenStreetMap e Leaflet) e pediu o mapa de quadradinhos mais parecido com o Brasil, já feito. O **mapa com zoom até a cidade** foi feito em 17/10 (`/mapa/`, ver `docs/etapa5.md`). As **relacionadas** ("Penduradas perto", no fim da página da camisa) foram feitas em 17/10. A **camisa do dia** (topo da arara, com folhinha e "Sortear outra") foi feita em 17/10; por causa dela o workflow gera o site toda madrugada. As **estatísticas** (`/numeros/`, com placar, fileiras de camisetinhas, colunas por temporada, recordes e fichas preenchidas) foram feitas em 17/10. A **arara do degradê** e o seletor **Ordenar as araras** (mais recente, mais antiga e os dois sentidos do degradê, valendo para todas as araras) foram feitos em 17/10; a claridade é medida na foto recortada. Com isso, todas as ideias aprovadas da Etapa 5 estão feitas. Ficaram para depois a comparação lado a lado, a linha do tempo e as histórias em destaque.
- **Coleção real importada em 17/10/2026:** as 32 camisas de `Camisas/` entraram por `scripts/importar.py` com a lista `scripts/importacao-inicial.json`. Os exemplos fictícios foram apagados. Temporadas e tipos foram deduzidos das fotos e várias precisam da confirmação do dono (lista na conversa de 17/10). Tamanho, conservação, origem, data e história ficaram vazios para o dono completar pelo CMS.
- Faltam fotografar e cadastrar (o dono faz pelo CMS): +2 do São Paulo, Flamengo, Fluminense, Bahia e Santa Cruz. Os clubes já estão cadastrados. Falta também o verso do Santos.
- **Cópias para amigos (17/10/2026):** o guia é `COMO-FAZER-O-SEU.md`. `site`, `base` e o repositório do CMS vêm de `GITHUB_REPOSITORY` (`astro.config.mjs`, injetado em `src/config.ts` como `import.meta.env.REPOSITORIO`); no build local o padrão é `gaegrinberg/armario-digital`. `scripts/comecar-do-zero.py` e o workflow `comecar-do-zero.yml` esvaziam uma cópia e se recusam a rodar aqui. **Nunca rode a limpeza neste repositório.** Para o botão "Use this template" aparecer, o dono precisa marcar *Template repository* em Settings.
- Para rodar: `npm run dev` e abrir <http://localhost:4321/armario-digital/>. A página `/admin/` só funciona no build (`npm run build && npm run preview`).
- O `.gitignore` ignora só `/Camisas/` na raiz. Sem a barra, o Git no Windows (que ignora maiúsculas) escondia também `src/content/camisas`.

## Decisões já tomadas pelo dono

- A coleção é quase toda de clubes brasileiros e quase toda da última década. **Não separar por década.**
- **Uma arara por região do Brasil** (Norte, Nordeste, Centro-Oeste, Sudeste, Sul). Seleções (inclusive a brasileira) ficam numa arara própria, **"Seleções"**. Clubes estrangeiros vão para **"Gringas"**.
- **São Paulo FC** é o time do coração: ganha uma arara própria, em destaque, dentro do Sudeste. Deve vir de uma configuração (`timeDoCoracao`), não ficar fixo no código.
- Lista de desejos como **cabides vazios** com etiqueta "procura-se", dentro da arara da região.
- O dono achou a primeira versão da arara genérica. Prefere soluções originais, com identidade brasileira, a padrões comuns de catálogo.
- Camisas de outros esportes entram na coleção, com o campo `esporte` (a da Índia é de críquete).
- Silhueta `faixa-peito` aprovada como genérica.
- Mais adiante (Etapa 5), um **mapa-múndi com zoom até a cidade** de cada camisa (capital, para seleções). O clube guarda `cidade` e `coordenadas` desde a v1.

## Fotos e recorte

- Teste de 17/10/2026: o fundo precisa ser removido, porque as fotos têm parede, rodapé e interruptor. O `rembg` com o modelo `birefnet-general-lite` recorta bem até as camisas brancas (cerca de 15 s por foto em CPU, a 1500 px). O cabide sai num pós-processamento e a exposição é ajustada por autocontraste. Detalhes em `docs/arquitetura.md` 3.4.
- Originais em `Camisas/` (fora do Git, via `.gitignore`): 63 fotos de 32 camisas, tiradas em 16/10/2026. Os nomes dos arquivos não seguem a ordem frente/verso, então os pares precisam ser montados olhando as fotos.
- A camisa vermelha das fotos `20261017_000603` e `20261017_000616` é do Sergipe.

## Como trabalhar

- Siga o plano: pare em cada `[CHECKPOINT]` e espere aprovação.
- Commits pequenos, com mensagens claras em português.
- Repositório público: nada de preço pago ou dados pessoais sensíveis no site sem perguntar.
- Para ver os protótipos: `python -m http.server 8123 --directory prototipos`.
