# Armário Digital

Site pessoal e estático (GitHub Pages) para catalogar uma coleção de camisas de futebol. O plano completo, com as etapas e os checkpoints, está em `armario-digital-plano.md`. Leia esse arquivo antes de qualquer trabalho. Interface e documentação em português.

## Estado atual

- **Etapa 1 (pesquisa): aprovada.** Ver `docs/referencias.md`. A síntese da primeira rodada vale para a v1; a segunda rodada, no fim do arquivo, traz as referências brasileiras.
- **Etapa 2 (design): aprovada.** A direção escolhida é a **Arara do Brasil**, descrita na última seção de `docs/design.md`. O protótipo é `prototipos/arara.html`. Os protótipos museu e álbum ficam só como histórico, mas a grade do museu pode virar a visão "ver em grade".
- **Etapa 3 (arquitetura): quase aprovada.** Ver `docs/arquitetura.md`. Aprovados: esquema com cadastro de clubes, Astro 7, Sveltia CMS com token pessoal, WebP. Decisões registradas na seção "Decisões do Checkpoint 3".
- **Pendente antes da Etapa 4:** teste com fotos reais no cabide (recorte na Galeria do Galaxy A36) e confirmação da silhueta `faixa-peito`.

## Decisões já tomadas pelo dono

- A coleção é quase toda de clubes brasileiros e quase toda da última década. **Não separar por década.**
- **Uma arara por região do Brasil** (Norte, Nordeste, Centro-Oeste, Sudeste, Sul). Camisas estrangeiras vão para "Gringas".
- **São Paulo FC** é o time do coração: ganha uma arara própria, em destaque, dentro do Sudeste. Deve vir de uma configuração (`timeDoCoracao`), não ficar fixo no código.
- Lista de desejos como **cabides vazios** com etiqueta "procura-se", dentro da arara da região.
- **Seleção brasileira** tem arara própria ("Seleção"), antes das regiões.
- Fotos: camisa **no cabide, pendurada na parede**, recortada no celular (Samsung Galaxy A36). O cabide real fica na foto.
- Preço pago não entra. **Valor de mercado** é ideia para a Etapa 5, fora do site público até decisão do dono.
- Cadastro pelo **Sveltia CMS** com token pessoal; stack **Astro 7**.
- O dono achou a primeira versão da arara genérica. Prefere soluções originais, com identidade brasileira, a padrões comuns de catálogo.

## Propostas para validar no Checkpoint 3

- Padrão de silhueta `faixa-peito` (já está no protótipo). Confirmar com o dono que ele respeita a regra da silhueta genérica.

## Como trabalhar

- Siga o plano: pare em cada `[CHECKPOINT]` e espere aprovação.
- Commits pequenos, com mensagens claras em português.
- Repositório público: nada de preço pago ou dados pessoais sensíveis no site sem perguntar.
- Para ver os protótipos: `python -m http.server 8123 --directory prototipos`.
