# Armário Digital

Site pessoal e estático (GitHub Pages) para catalogar uma coleção de camisas de futebol. O plano completo, com as etapas e os checkpoints, está em `armario-digital-plano.md`. Leia esse arquivo antes de qualquer trabalho. Interface e documentação em português.

## Estado atual

- **Etapa 1 (pesquisa): aprovada.** Ver `docs/referencias.md`. A síntese da primeira rodada vale para a v1; a segunda rodada, no fim do arquivo, traz as referências brasileiras.
- **Etapa 2 (design): aprovada.** A direção escolhida é a **Arara do Brasil**, descrita na última seção de `docs/design.md`. O protótipo é `prototipos/arara.html`. Os protótipos museu e álbum ficam só como histórico, mas a grade do museu pode virar a visão "ver em grade".
- **Etapa 3 (arquitetura): entregue, aguardando o Checkpoint 3.** Ver `docs/arquitetura.md`. Recomendações: Astro 7, um Markdown por camisa com clubes em cadastro separado, Sveltia CMS com token pelo celular, fotos WebP convertidas no upload, remoção de fundo no celular. As perguntas abertas estão no fim do documento.

## Decisões já tomadas pelo dono

- A coleção é quase toda de clubes brasileiros e quase toda da última década. **Não separar por década.**
- **Uma arara por região do Brasil** (Norte, Nordeste, Centro-Oeste, Sudeste, Sul). Camisas estrangeiras vão para "Gringas".
- **São Paulo FC** é o time do coração: ganha uma arara própria, em destaque, dentro do Sudeste. Deve vir de uma configuração (`timeDoCoracao`), não ficar fixo no código.
- Lista de desejos como **cabides vazios** com etiqueta "procura-se", dentro da arara da região.
- O dono achou a primeira versão da arara genérica. Prefere soluções originais, com identidade brasileira, a padrões comuns de catálogo.

## Propostas para validar no Checkpoint 3

- Campo `uf` no cadastro do clube; a região é derivada da UF.
- Padrão de silhueta `faixa-peito` (já está no protótipo). Confirmar com o dono que ele respeita a regra da silhueta genérica.
- Fotos sem recorte aparecem presas por um prendedor; recortadas, direto no cabide.
- Seleção Brasileira numa arara "Seleção", entre as regiões e as Gringas.

## Como trabalhar

- Siga o plano: pare em cada `[CHECKPOINT]` e espere aprovação.
- Commits pequenos, com mensagens claras em português.
- Repositório público: nada de preço pago ou dados pessoais sensíveis no site sem perguntar.
- Para ver os protótipos: `python -m http.server 8123 --directory prototipos`.
