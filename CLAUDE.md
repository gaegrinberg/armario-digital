# Armário Digital

Site pessoal e estático (GitHub Pages) para catalogar uma coleção de camisas de futebol. O plano completo, com as etapas e os checkpoints, está em `armario-digital-plano.md`. Leia esse arquivo antes de qualquer trabalho. Interface e documentação em português.

## Estado atual

- **Etapa 1 (pesquisa): aprovada.** Ver `docs/referencias.md`. A síntese da primeira rodada vale para a v1; a segunda rodada, no fim do arquivo, traz as referências brasileiras.
- **Etapa 2 (design): aprovada.** A direção escolhida é a **Arara do Brasil**, descrita na última seção de `docs/design.md`. O protótipo é `prototipos/arara.html`. Os protótipos museu e álbum ficam só como histórico, mas a grade do museu pode virar a visão "ver em grade".
- **Etapa 3 (arquitetura): respondida em 17/10/2026.** Ver `docs/arquitetura.md`, com as decisões no fim. Stack: Astro, Sveltia CMS com token pessoal, rembg/birefnet no GitHub Actions e cores escolhidas numa paleta fixa de 13.
- **Próximo passo: Etapa 4** (primeira versão). Confirmar com o dono antes de começar.

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
- Pendências do dono: fotografar o verso do Santos (foto `20261017_000314`) e as camisas que ainda faltam.
- A camisa vermelha das fotos `20261017_000603` e `20261017_000616` é do Sergipe.

## Como trabalhar

- Siga o plano: pare em cada `[CHECKPOINT]` e espere aprovação.
- Commits pequenos, com mensagens claras em português.
- Repositório público: nada de preço pago ou dados pessoais sensíveis no site sem perguntar.
- Para ver os protótipos: `python -m http.server 8123 --directory prototipos`.
