# Armário Digital: modelo de dados e arquitetura

Etapa 3 do plano. Pesquisa e versões conferidas em outubro de 2026. Nada aqui foi implementado: os trechos de código são esboços para a Etapa 4.

## Resumo das recomendações

| Tema | Recomendação | Seção |
|---|---|---|
| Dados | Um arquivo Markdown por camisa, numa pasta própria com as fotos. Clubes num cadastro separado, que guarda UF, país e cores. Validação com Zod no build. | 3.1 |
| Cores | Preenchidas à mão, herdando as cores do clube quando a camisa não informa. A faixa de paleta (filtro) é calculada no build. | 3.1 |
| Preço e dados privados | Fora deste repositório. O esquema recusa campos desconhecidos, então um `preco` digitado por engano quebra o build. | 3.1 |
| Stack | Astro 7 com content collections, JavaScript puro no navegador (sem React), deploy por GitHub Actions. | 3.2 |
| Cadastro | Sveltia CMS em `/admin/`, entrando com um token pessoal do GitHub. Edição direta no GitHub como reserva. | 3.3 |
| Fotos | Camisa no cabide, na parede. Fundo removido no próprio celular, conversão para WebP e redução no navegador pelo CMS, tamanhos finais gerados no build. Originais ficam no celular e num álbum na nuvem. | 3.4 |
| Silhueta | A do protótipo, com manga longa e gerada no build como SVG, sem JavaScript. | 3.5 |

As decisões tomadas no Checkpoint 3 e o que ainda falta estão no fim, em **Decisões do Checkpoint 3**.

---

## 3.1 Modelo de dados

### Organização dos arquivos

```
src/
  content/
    camisas/
      sao-paulo-2024-titular/
        index.md          ← dados (frontmatter) + história (texto)
        frente.webp
        costas.webp
        detalhe-1.webp
    clubes/
      sao-paulo.yaml
      cruzeiro.yaml
      boca-juniors.yaml
  config/
    site.yaml             ← timeDoCoracao e outras opções
```

**Por que uma pasta por camisa:** as fotos ficam ao lado dos dados. Apagar ou renomear uma camisa é mexer numa pasta só, e o Astro valida no build que cada foto citada existe.

**Por que Markdown com frontmatter, e não YAML puro:** as observações são texto livre, às vezes com parágrafos. No Markdown elas ficam no corpo do arquivo, sem aspas nem escape. Os campos estruturados ficam no frontmatter.

**Por que um cadastro de clubes separado:** UF, país, tipo de equipe e cores do clube são os mesmos em todas as camisas do clube. Digitar isso a cada camisa pelo celular é o caminho mais curto para inconsistência ("SP" numa, "Sp" na outra, "Sao Paulo" sem acento). Com o cadastro, a camisa só aponta para o clube, e o CMS mostra uma lista para escolher. O custo: um clube novo exige cadastrar o clube antes da camisa (pelo CMS, é uma tela a mais).

### Clube (`src/content/clubes/<id>.yaml`)

| Campo | Tipo | Obrigatório | Validação e observação |
|---|---|---|---|
| `id` | nome do arquivo | sim | minúsculas, sem acento, com hífens (`sao-paulo`). Estável: as camisas apontam para ele. |
| `nome` | texto | sim | nome de exibição ("São Paulo FC"). |
| `equipe` | `clube` \| `selecao` | sim | |
| `pais` | texto | sim | nome em português ("Brasil", "Argentina"). |
| `uf` | uma das 27 siglas | só para clubes brasileiros | Obrigatório quando `pais` é Brasil e `equipe` é clube. Proibido nos demais. A região é derivada da UF, nunca digitada. |
| `cores` | lista de 1 a 3 cores `#RRGGBB` | sim | Cores tradicionais do clube. Servem de padrão para as camisas e para a faixa da arara do coração. |

A seleção brasileira não tem UF e ganha arara própria, "Seleção", antes das regiões (decidido no Checkpoint 3).

### Camisa (`src/content/camisas/<slug>/index.md`)

**Obrigatórios para qualquer registro:** `clube`, `temporada`, `tipo`. Todo o resto é opcional ou tem valor padrão, para o cadastro pelo celular ser curto (ideia 7 da síntese da Etapa 1).

| Campo | Tipo | Padrão | Validação e observação |
|---|---|---|---|
| slug | nome da pasta | | Gerado pelo CMS na criação: `clube-temporada-tipo` (`sao-paulo-2024-titular`). Não muda depois, mesmo que os campos mudem, para não quebrar links. Duas cópias da mesma camisa ganham sufixo (`-jogador`, `-2`). |
| `clube` | referência a um clube | | Precisa existir em `clubes/`. Erro: "clube 'sao-paulo-fc' não encontrado; clubes cadastrados: …". |
| `temporada` | texto | | `AAAA` (2024) ou `AAAA/AA` (2018/19). Aceita o ano com ou sem aspas. Na segunda forma, o ano final precisa ser o seguinte ao inicial. Entre 1900 e o ano atual + 1. |
| `tipo` | lista fechada | | `titular`, `reserva`, `terceira`, `goleiro`, `treino`, `pre-jogo`, `comemorativa`. |
| `versao` | lista fechada | `torcedor` | `torcedor`, `jogador`. |
| `manga` | lista fechada | `curta` | `curta`, `longa`, `sem-manga`. Muda a silhueta. |
| `liga` | texto | | Fica na camisa, não no clube, porque muda com a temporada (Cruzeiro na Série B em 2022). |
| `fabricante` | texto | | |
| `patrocinador` | texto | | Patrocinador principal (máster). |
| `tamanho` | lista fechada | | `PP`, `P`, `M`, `G`, `GG`, `XGG`, `infantil`. Ajustável se você usar outras etiquetas. |
| `personalizacao` | objeto | | `nome` (texto, até 20 caracteres) e `numero` (inteiro de 0 a 99). Os dois opcionais. Aparece nas costas da silhueta. |
| `patches` | lista de textos | vazia | Ex.: "Libertadores 2024". |
| `autografada` | sim/não | não | Quem autografou vai nas observações. |
| `conservacao` | lista fechada | | Escala abaixo. |
| `origem` | lista fechada | | `compra`, `presente`, `troca`, `viagem`, `outro`. |
| `aquisicao` | data parcial | | `AAAA`, `AAAA-MM` ou `AAAA-MM-DD` (o YAML transforma a data completa em objeto de data; o esquema aceita as duas formas). Ninguém lembra o dia em que ganhou uma camisa de 2017. Não pode ser futura. |
| `cores` | lista de 1 a 3 cores `#RRGGBB` | cores do clube | Ordem: corpo, detalhe, terceira cor. Ver "Cores" abaixo. |
| `padrao` | lista fechada | `liso` | `liso`, `listras-verticais`, `listras-horizontais`, `faixa-peito`, `faixa-diagonal`, `metade`. Serve para a silhueta e como filtro. |
| `fotos` | objeto | | `frente`, `costas` e `detalhes` (lista de até 6, cada uma com `foto` e `legenda` opcional). O build confere que os arquivos existem e são imagens. |
| `tags` | lista de textos | vazia | Livres, para agrupamentos como "copa de 2022" ou "presente do meu pai". Normalizadas no build (minúsculas, espaços simples). |
| `status` | lista fechada | `colecao` | `colecao`, `desejo`. |
| `visibilidade` | lista fechada | `publica` | `publica`, `rascunho`. Ver "Visibilidade". |
| corpo do arquivo | Markdown | | Observações e história. Entra na busca. |

**Regras entre campos** (checadas no build, com mensagem em português):

- Camisa com `status: desejo` não pode ter `conservacao`, `origem`, `aquisicao`, `tamanho` nem `autografada: true`. Esses campos só fazem sentido para o que você tem.
- `fotos.detalhes` sem `fotos.frente` gera erro: a miniatura sempre usa a frente.
- Dois registros com o mesmo clube, temporada, tipo e versão geram aviso (não erro), para pegar cadastro duplicado sem impedir duas cópias de propósito.
- Valores de texto livre que diferem só em maiúsculas ou acentos (`Adidas` e `adidas`, `Série A` e `Serie A`) geram erro com as duas grafias, para os filtros não mostrarem a mesma marca duas vezes.

**Por que `fabricante`, `liga` e `patrocinador` são texto livre e não lista fechada:** uma lista fechada obriga a editar a configuração antes de cadastrar a primeira camisa de uma marca nova, o que pelo celular é atrito. A regra das grafias acima resolve o problema real (duplicidade nos filtros) com menos atrito. O CMS pode sugerir os valores já usados.

**Campos do plano que mudaram:**

- `tipo de equipe`, `país` e `liga ou confederação` saíram da camisa: os dois primeiros vêm do clube; a liga ficou na camisa.
- `nome e número` virou `personalizacao`, com nome e número separados, para a silhueta poder desenhar o número.
- Entraram `manga`, `padrao`, `tags`, `visibilidade` e `uf` (no clube).

### Valores derivados no build (ninguém digita)

| Valor | Como sai |
|---|---|
| `regiao` | Da UF do clube, pela tabela do IBGE (já está em `prototipos/comum.js`). A seleção brasileira vai para "Seleção"; clubes e seleções de fora do Brasil vão para "Gringas". |
| título | `{clube} {temporada}` e, abaixo, `{tipo} · {versao}` (como no protótipo). |
| `corPaleta` | Cada cor é encaixada na cor mais próxima de uma paleta curta de nomes (vermelho, grená, laranja, amarelo, verde, celeste, azul, azul-marinho, roxo, rosa, branco, preto, cinza). A lista final se ajusta quando as camisas reais chegarem. É o que aparece no filtro de cor. |
| `fundoRemovido` | O build verifica se a foto da frente tem transparência. Com transparência, a camisa fica pendurada direto no cabide. Sem, aparece dentro de uma placa (ver 3.4). |
| número de registro | Ordem de aquisição (Nº 001, 002…), recalculado a cada build. Camisas sem data vão para o fim. |

### Configuração do site (`src/config/site.yaml`)

```yaml
timeDoCoracao: sao-paulo     # id de um clube; o build falha se não existir
titulo: Armário Digital
```

A arara do coração usa as `cores` do clube apontado para a faixa fina. Trocar o time do coração é editar uma linha, sem mexer em código.

### Escala de conservação

Rótulos de colecionador, traduzidos (ideia 5 da síntese). Sem nota de 1 a 10: com sete rótulos a nota seria redundante e daria uma falsa precisão.

| Valor | Rótulo | Critério |
|---|---|---|
| `nova-com-etiqueta` | Nova com etiqueta | Nunca usada, etiqueta da loja presa. |
| `nova-sem-etiqueta` | Nova sem etiqueta | Nunca usada, sem a etiqueta da loja. |
| `excelente` | Excelente | Usada poucas vezes, sem nenhum defeito visível. |
| `muito-boa` | Muito boa | Sinais leves de uso (bolinhas discretas), estampas e escudo intactos. |
| `boa` | Boa | Uso visível: desbotamento leve ou estampa com pequenas falhas. |
| `regular` | Regular | Defeito evidente: mancha, furo pequeno, número descascando. |
| `desgastada` | Desgastada | Vale pela história, não pelo estado. |

### Visibilidade

`rascunho` tira a camisa do site, o que serve para cadastrar com calma e publicar depois. **Isso não torna o registro privado:** o repositório é público, e qualquer pessoa pode ler o arquivo no GitHub. Por isso não existe um valor `privada`; ele daria uma falsa sensação de sigilo.

### Cores: preenchidas à mão ou extraídas das fotos

| | À mão (com herança do clube) | Extraídas da foto no build |
|---|---|---|
| Camisa sem foto | Funciona. É justamente o caso da silhueta. | **Não funciona**: sem foto não há o que extrair, e a silhueta existe para esse caso. |
| Esforço no cadastro | Zero para a titular (herda do clube). Nas outras, escolher 1 a 3 cores no seletor do celular. | Zero. |
| Qualidade | Exata, porque você escolhe. Pode ficar um tom diferente da foto. | Erra com sombra, balanço de branco do celular, listras finas, patrocinador grande e fundo mal recortado (o próprio Cooper Hewitt admite isso). |
| Ordem das cores | Você decide qual é o corpo e qual é o detalhe, o que a silhueta precisa. | O algoritmo dá proporções, não papéis. Uma camisa listrada vermelha e preta pode sair com o preto como "corpo". |
| Complexidade | Nenhuma. | Um passo de agrupamento de cores (k-means) no build, mais regras para ignorar a transparência. |

**Recomendação: à mão, com herança do clube.** O argumento decisivo é o primeiro: a silhueta precisa das cores exatamente quando não há foto. A extração pode entrar depois como um verificador que compara as cores digitadas com as da foto e avisa quando estão muito diferentes. Fica fora da v1.

### Campos privados (preço pago, valor estimado)

O repositório é público, então "fora do build público" não basta: o dado não pode estar no repositório. Opções:

| Opção | Como funciona | Problema |
|---|---|---|
| A. Não registrar no projeto | Preço fica numa planilha sua, com o slug da camisa como chave. | Dois lugares para manter. |
| B. Repositório privado só com os dados privados | Um repositório `armario-digital-privado` com um arquivo `privado.yaml` (slug → preço, valor). O site público nunca lê esse arquivo. Um script local pode juntar as duas fontes para estatísticas só suas. | Mais um repositório. O CMS não edita os dois juntos, então o preço é digitado à parte. |
| C. Arquivo criptografado no repositório público | Ferramentas como sops ou age cifram o arquivo. | Dado cifrado continua público para sempre no histórico do Git; um erro de configuração expõe tudo. Complexidade alta para o ganho. |
| D. Repositório inteiro privado | GitHub Pages a partir de repositório privado exige plano pago. | Custo, e o site continua público de qualquer forma. |

**Recomendação: A ou B, a seu critério; nunca C.** Para qualquer uma delas, o esquema da camisa é **estrito**: um campo que não está na lista acima quebra o build com "campo 'preco' não é permitido; dados privados ficam fora deste repositório". Isso protege contra o erro mais provável, que é digitar o preço no lugar errado pelo celular. Se você não quer registrar preço de jeito nenhum, a decisão é só não fazer nada.

### Esboço do esquema

Astro 7 usa Zod 4. Esboço, sem os textos de erro completos:

```ts
// src/content.config.ts (esboço)
import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const COR = z.string().regex(/^#[0-9A-F]{6}$/i, { error: 'cor deve estar no formato #RRGGBB' });
const UFS = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
  'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'] as const;

const clubes = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/clubes' }),
  schema: z.strictObject({
    nome: z.string().min(1),
    equipe: z.enum(['clube', 'selecao']),
    pais: z.string().min(1),
    uf: z.enum(UFS).optional(),
    cores: z.array(COR).min(1).max(3),
  }).refine(c => (c.pais === 'Brasil' && c.equipe === 'clube') === Boolean(c.uf),
    { error: 'uf é obrigatória para clubes brasileiros e proibida para os demais' }),
});

const camisas = defineCollection({
  loader: glob({ pattern: '*/index.md', base: './src/content/camisas' }),
  schema: ({ image }) => z.strictObject({
    clube: reference('clubes'),
    temporada: z.string().regex(/^\d{4}(\/\d{2})?$/, { error: 'temporada: use 2024 ou 2018/19' }),
    tipo: z.enum(['titular', 'reserva', 'terceira', 'goleiro', 'treino', 'pre-jogo', 'comemorativa']),
    versao: z.enum(['torcedor', 'jogador']).default('torcedor'),
    manga: z.enum(['curta', 'longa', 'sem-manga']).default('curta'),
    // … demais campos da tabela
    cores: z.array(COR).min(1).max(3).optional(),
    fotos: z.strictObject({
      frente: image().optional(),
      costas: image().optional(),
      detalhes: z.array(z.strictObject({ foto: image(), legenda: z.string().optional() })).max(6).default([]),
    }).optional(),
    status: z.enum(['colecao', 'desejo']).default('colecao'),
    visibilidade: z.enum(['publica', 'rascunho']).default('publica'),
  }).superRefine(regrasEntreCampos),
});

export const collections = { clubes, camisas };
```

A regra das grafias parecidas (`Adidas`/`adidas`) olha a coleção inteira, não um registro, então roda num passo de verificação logo depois de carregar os dados.

### Exemplo de registro

```markdown
---
clube: sao-paulo
temporada: "2023"
tipo: reserva
versao: jogador
fabricante: Trivela
patrocinador: Banco Garoa
tamanho: M
personalizacao: { nome: LUCAS, numero: 7 }
conservacao: muito-boa
origem: compra
aquisicao: 2023-10
cores: ["#D7192D", "#FFFFFF", "#111111"]
padrao: listras-verticais
fotos:
  frente: ./frente.webp
  costas: ./costas.webp
tags: [copa do brasil]
---
A camisa da campanha da Copa do Brasil. Fiquei três meses procurando no meu tamanho.
```

(Dados fictícios, como nos protótipos.)

---

## 3.2 Stack

### Comparação

| Critério | **Astro 7** | Eleventy 3 | Hugo | Sem gerador (HTML + script Node) |
|---|---|---|---|---|
| Validação de esquema | Nativa: content collections com Zod, erro com arquivo e campo. Referência entre coleções (`reference('clubes')`) e validação de imagem (`image()`) prontas. | Não tem. Precisa ligar Zod à mão no carregamento dos dados. | Não tem. Checagens viram condicionais nos templates, com mensagens ruins. | Zod à mão, como no Eleventy. |
| Otimização de imagem | Nativa (`<Image>`/`<Picture>` com sharp), com cache entre builds. | Plugin oficial `@11ty/eleventy-img` (sharp), bom. | Nativa e rápida, em Go. | sharp chamado por um script nosso. |
| Templates | Componentes `.astro`: HTML com um bloco de código no topo. Próximo dos protótipos. | Vários (Nunjucks, Liquid, WebC, JS). Flexível, mas cada projeto escolhe um. | Templates Go, sintaxe mais difícil de ler e editar. | Template strings em JS, como nos protótipos. |
| JavaScript no navegador | Zero por padrão; scripts puros quando precisar (filtros, balanço). | Zero; scripts à parte. | Zero; scripts à parte. | Zero; scripts à parte. |
| Dependências | Uma direta (`astro`), mas várias centenas de pacotes indiretos no npm. | Menos pacotes indiretos que o Astro. | Um binário, sem npm. | Mínimas (sharp, zod, um parser de YAML/Markdown). |
| Manutenção | Versão principal nova por ano (6 no início de 2026, 7 hoje); atualizar exige ler guia de migração. | Mudanças lentas e compatíveis. | Estável, binário fixo no workflow. | Tudo é nosso: roteamento, servidor local, recarga ao vivo. |
| CMS (3.3) | Sveltia/Decap leem e escrevem Markdown com frontmatter em pastas, que é o formato das content collections. | Idem. | Idem. | Idem. |

Versões conferidas em outubro de 2026: Astro 7.4.0 (exige Node 22.22 ou mais novo), Eleventy 3.1.7, `@11ty/eleventy-img` 7.0.0, sharp 0.35.5.

### Recomendação: Astro 7

O plano pede que um erro de digitação quebre o build com mensagem clara. O Astro é o único dos quatro em que isso vem pronto, inclusive para as duas validações mais úteis aqui: "este clube existe?" e "esta foto existe?". A otimização de imagem também vem pronta e com cache. Nos outros, as duas coisas viram código nosso para manter.

O que pesa contra, e como reduzir:

- **Árvore de dependências grande.** Fixar versões com `package-lock.json` e não atualizar sem motivo. O site não tem backend nem dados sensíveis, então a superfície de ataque de uma dependência desatualizada é o build, não o visitante.
- **Versão principal nova todo ano.** Não é obrigatório acompanhar. Um site estático pronto continua funcionando; a atualização só é necessária quando o Node da versão fixada sair de suporte.
- **Ferramenta maior que o problema.** O site tem duas ou três páginas (araras, grade, ficha). Se você preferir o mínimo absoluto, a alternativa "sem gerador" é viável e tem o código mais fácil de ler; custa escrever à mão o que o Astro já faz (validação de referências, `srcset`, cache de imagens, servidor local). Minha avaliação é que esse código próprio sairia maior do que a configuração do Astro.

**Fora de questão:** React, Vue ou outro framework de interface. Os filtros, a URL e o balanço da arara são JavaScript puro, como nos protótipos, e o código de `prototipos/comum.js` é reaproveitado quase direto.

### Dependências previstas na v1

| Pacote | Para quê |
|---|---|
| `astro` | Gerador do site, content collections, otimização de imagem (traz o sharp). |
| `@sveltia/cms` | Não é dependência de npm: o painel `/admin/` carrega o script de uma CDN, com a versão fixada na URL. |

Nada mais. Fontes (Londrina Solid, Archivo) servidas pelo próprio site, para não depender do Google Fonts.

### Deploy

GitHub Actions com a ação oficial do Astro, a cada push na `main`:

```yaml
# .github/workflows/deploy.yml (esboço)
on: { push: { branches: [main] }, workflow_dispatch: {} }
permissions: { contents: read, pages: write, id-token: write }
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/cache@v4          # imagens já otimizadas em builds anteriores
        with: { path: .cache/astro, key: imagens-${{ hashFiles('src/content/camisas/**') }}, restore-keys: imagens- }
      - uses: withastro/action@v3
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: { name: github-pages, url: '${{ steps.deploy.outputs.page_url }}' }
    steps:
      - id: deploy
        uses: actions/deploy-pages@v4
```

- Em Settings → Pages, a fonte passa a ser "GitHub Actions".
- O cache das imagens importa: sem ele, cada camisa nova faz o build reprocessar todas as fotos da coleção. O padrão do Astro guarda o cache em `node_modules/.astro`, que a instalação limpa do CI apaga; por isso o `cacheDir` vai para `.cache/astro` na configuração. As versões das ações (`@v3`, `@v4`) serão conferidas na hora de criar o arquivo.
- Se a validação falhar, o deploy não acontece e o site continua na versão anterior. O GitHub manda e-mail com o erro.
- Tempo estimado do cadastro até o site: 1 a 3 minutos, a confirmar na Etapa 4.

---

## 3.3 Fluxo de cadastro

### Opção 1: editar o arquivo direto no GitHub

Pelo navegador do celular: criar a pasta `src/content/camisas/<slug>/`, escrever o `index.md` e subir as fotos.

- **Configuração:** nenhuma.
- **Fotos:** sobem como estão. Foto de iPhone vem em HEIC, de 2 a 5 MB, formato que só o Safari exibe. O build teria de converter, e o original pesado ficaria no repositório para sempre, contra a restrição 4 do plano.
- **Celular:** funciona, mal. Teclado do celular troca aspas retas por curvas, coloca maiúscula no começo da linha e não tem tecla de tabulação: três jeitos de quebrar o YAML. Criar uma pasta exige digitar o caminho com barras no nome do arquivo.
- **O que dá errado:** o erro só aparece no e-mail do build que falhou, minutos depois. A validação (3.1) garante que nada errado vai para o site, mas não evita a ida e volta.
- **Serve para:** corrigir um campo ou uma vírgula numa camisa que já existe.

### Opção 2: CMS baseado em Git

O CMS é um formulário que lê a configuração das coleções e faz commit no repositório em seu nome. As opções atuais:

| CMS | Situação (out/2026) | Autenticação com GitHub Pages | Fotos | Celular |
|---|---|---|---|---|
| **Sveltia CMS** | Ativo, versão 0.245 (15/10/2026), lançamentos quase diários. Ainda 0.x. | Página estática em `/admin/`, servida pelo próprio GitHub Pages. Entrada por **token pessoal do GitHub** (sem servidor) ou por OAuth, que exige um Worker gratuito na Cloudflare. O GitHub ainda não aceita PKCE em aplicações só de navegador, então não há OAuth sem servidor. | Converte HEIC, JPEG e PNG para **WebP no navegador** e reduz para um tamanho máximo antes do commit (opções `transformations`, `max_file_size`). | Suporte a celular é um dos objetivos declarados do projeto. |
| Decap CMS | Ativo, versão 3.17.1 (14/10/2026). Maduro, sucessor do Netlify CMS. | Página estática em `/admin/`, mas o GitHub exige um servidor OAuth: o da Netlify (conta lá) ou um proxy próprio (Worker na Cloudflare, Lambda na AWS). | Sobe o arquivo original, sem conversão. | Interface pensada para computador. |
| Pages CMS | Ativo, versão 2.x. | Aplicação hospedada por terceiros em `app.pagescms.org`. Você entra com o GitHub e instala um GitHub App que, pela documentação, pede escrita em conteúdo, administração e Actions do repositório. Hospedar o próprio exige servidor e PostgreSQL. | Sobe para a pasta configurada; não encontrei conversão de formato. | Interface responsiva. |
| Keystatic | Ativo. | O modo GitHub precisa de rotas de servidor para o painel. Não roda só no GitHub Pages; exigiria hospedar o painel em outro serviço. | | |
| TinaCMS | Ativo. | Exige o serviço Tina Cloud ou um backend próprio com banco de dados. | | |

Keystatic e TinaCMS ficam fora: os dois pedem um servidor, o que o plano quer evitar. Pages CMS é o mais fácil de começar, mas entrega a um serviço de terceiros permissões amplas sobre o repositório e depende de esse serviço continuar no ar. Decap é o mais estável, mas não resolve as fotos nem o celular, que são os dois pontos do seu caso.

- **Configuração (Sveltia):** dois arquivos (`public/admin/index.html` e `config.yml`) e um token. Meia hora, feita uma vez.
- **Fotos:** escolhidas da galeria ou tiradas na hora; chegam ao repositório já em WebP e reduzidas.
- **Celular:** sim, formulário com listas, seletor de cor e de data.
- **O que dá errado:** o projeto ainda está em 0.x e muda rápido; fixar a versão na URL do script evita que uma atualização quebre o painel sem aviso. O token fica guardado no navegador do celular: se o aparelho for comprometido, quem o tiver consegue escrever neste repositório (só neste, com o token restrito). O token expira e precisa ser renovado.

### Opção 3: script local

Um comando (`npm run nova-camisa`) pergunta os campos no terminal, recebe o caminho das fotos, reduz e converte, opcionalmente remove o fundo (3.4) e escreve a pasta pronta.

- **Configuração:** baixa para mim, média para você (Node instalado; Python se usar remoção de fundo local).
- **Fotos:** o melhor controle de qualidade das três opções.
- **Celular:** não. Depende do computador, o que contraria a restrição 5 do plano.
- **O que dá errado:** pouca coisa; a validação acontece antes do commit.
- **Serve para:** a carga inicial, se você quiser cadastrar dezenas de camisas de uma vez num fim de semana.

### Comparação

| | Arquivo no GitHub | Sveltia CMS | Script local |
|---|---|---|---|
| Esforço inicial | nenhum | baixo | médio |
| Esforço por camisa | alto | baixo | baixo |
| Fotos | originais pesados no repositório | WebP reduzido no navegador | WebP reduzido, fundo removido |
| Celular | precário | sim | não |
| Erros de digitação | só no build | barrados no formulário e no build | barrados no terminal e no build |

### Recomendação

**Sveltia CMS com token pessoal, para o dia a dia pelo celular, e edição direta no GitHub para correções rápidas.** O script local fica para depois, só se a carga inicial se mostrar trabalhosa pelo celular.

Por que o token pessoal e não o OAuth pela Cloudflare: você é o único editor. O OAuth acrescenta uma conta e um serviço a manter para resolver um problema de quem tem vários editores. Se um dia houver outra pessoa cadastrando, o Worker pode ser acrescentado sem mudar o resto.

O token: "fine-grained", restrito a `gaegrinberg/armario-digital`, permissão só de **Contents: leitura e escrita**, com data de expiração.

Como fica o cadastro de uma camisa no celular:

1. Fotografar frente e costas (guia em 3.4).
2. Remover o fundo no aplicativo de fotos do celular (3.4).
3. Abrir `…/admin/`, tocar em "Nova camisa".
4. Escolher o clube na lista, digitar a temporada, escolher o tipo. As cores já vêm do clube.
5. Anexar as fotos. Preencher o que quiser do resto.
6. Salvar. O CMS faz o commit; o site atualiza em poucos minutos.

A validação existe em duas camadas: o formulário barra campo obrigatório vazio e formato errado (temporada, cor); o build barra o resto (clube inexistente, regras entre campos, grafias parecidas). O esquema do Astro é a fonte da verdade; a configuração do CMS repete só o que melhora o formulário.

---

## 3.4 Pipeline de fotos

### O caminho de uma foto

```
celular                    navegador (Sveltia)             repositório                   build (Astro + sharp)            site
foto original (HEIC/JPEG) → fundo removido no celular →   frente.webp                 → corta as bordas transparentes → 400, 800, 1200 e 1600 px
fica na galeria e na nuvem   converte p/ WebP, reduz       ≤ 1600 × 2000 px, ≤ 500 KB     gera os tamanhos (WebP)          com srcset e lazy loading
```

Três lugares, cada um com um papel:

1. **Original:** fica no celular e num álbum na nuvem que você já usa (iCloud, Google Fotos ou Drive), chamado "Armário Digital: originais". Nunca entra no repositório. Git LFS foi descartado: tem cota no plano gratuito e complica o checkout do build, para guardar algo que já está guardado.
2. **Mestra no repositório:** uma versão WebP reduzida, gerada pelo CMS no navegador antes do commit. É dela que o build parte. Não é o original, mas tem resolução de sobra para o site.
3. **Versões do site:** geradas pelo Astro a cada build (com cache) e publicadas só no GitHub Pages, fora do repositório.

### Formatos

**WebP para tudo na v1, sem AVIF.**

- WebP funciona em todos os navegadores atuais, tem transparência (essencial para a camisa recortada) e codifica rápido.
- AVIF costuma sair menor para a mesma qualidade, mas codifica bem mais devagar e exigiria `<picture>` com dois formatos, o que dobra o trabalho do build. O Sveltia não gera AVIF no navegador pelo mesmo motivo: a codificação é lenta.
- Vale medir na Etapa 4, com as primeiras fotos reais: se o AVIF economizar muito nas miniaturas, entra só nelas.

### Dimensões e metas de tamanho

Proporção 4:5 (a placa do protótipo). Larguras escolhidas a partir do protótipo da arara: o cabide ocupa 42% da largura da tela no celular (até 210 px), a arara do coração 56% (até 270 px), e a ficha ocupa a largura toda. Celulares atuais têm densidade de 2 a 3 pixels por ponto.

| Versão | Largura | Uso | Meta |
|---|---|---|---|
| Miniatura | 400 px | Cabide e grade em tela de densidade 2 | ≤ 35 KB |
| Miniatura grande | 800 px | Cabide em densidade 3, arara do coração | ≤ 90 KB |
| Página | 1200 px | Foto da ficha no celular e no computador | ≤ 200 KB |
| Zoom | 1600 px | Só ao tocar para ampliar um detalhe | ≤ 400 KB |
| Mestra (repositório) | até 1600 × 2000 px | Origem das outras | ≤ 500 KB |

Justificativa das metas:

- **Página inicial.** A arara mostra 6 a 10 camisas na primeira tela; o resto carrega conforme a rolagem. 10 miniaturas de 35 a 90 KB dão menos de 1 MB, o que abre em poucos segundos em 4G. Com 50 camisas e carregamento preguiçoso, o peso inicial não muda.
- **Repositório.** O GitHub recomenda repositórios abaixo de 1 GB. Com 300 camisas e 2,5 fotos cada, mestras de 300 a 500 KB somam 225 a 375 MB. Isso deixa folga e é o motivo de a mestra não ser maior. Mestras acima de 500 KB geram aviso no build; acima de 1 MB, erro.
- **As metas são estimativas.** Foto de camisa sobre fundo transparente comprime bem, mas os números finais saem da Etapa 4, medindo as primeiras fotos reais.

Configuração prevista no Sveltia: `transformations: { raster_image: { format: webp, quality: 85, width: 1600, height: 2000 } }` e `max_file_size` de 15 MB na entrada (a foto do celular, antes de reduzir).

No build, além de redimensionar, o sharp **corta as bordas transparentes** da foto recortada. Assim o gancho do cabide fica sempre no topo da imagem, e toda camisa pendura na mesma altura da barra da arara, por mais que o enquadramento varie entre fotos. Como a foto já traz o cabide real, o site não desenha o cabide em SVG por cima dela; o cabide desenhado fica só para silhuetas e cabides vazios.

### Remoção de fundo

A direção Arara depende disso: com fundo, a foto vira um retângulo pendurado no cabide. As opções:

| Onde roda | Como | Qualidade | Peso | Problema |
|---|---|---|---|---|
| **No celular, nativo** | iPhone: no app Arquivos, toque longo na foto → Ações rápidas → Remover fundo (salva um PNG recortado); ou toque longo no objeto na foto → Copiar. Samsung (o seu caso): na Galeria, tocar e segurar sobre o objeto e escolher salvar. Outros Android: depende do aparelho. | Boa em objeto contrastado com o fundo. Você vê o resultado antes de subir. | Nenhum para o projeto. | Um passo manual a mais por foto. No Android, a disponibilidade varia. |
| No computador (script) | `rembg` (licença MIT), com modelos de 176 MB (`u2net`, `isnet-general-use`) a 1 GB (`birefnet-general`). O padrão atual, `bria-rmbg`, tem licença que exige acordo pago para uso comercial. | Muito boa com `isnet-general-use` ou `birefnet-general-lite` (224 MB). | Python e centenas de MB de modelo, na sua máquina. | Exige computador. Bom para lote. |
| No build (GitHub Actions) | O mesmo `rembg` rodando no CI. | Igual à anterior. | Baixa centenas de MB de modelo e roda em CPU a cada foto nova. | **Ninguém confere o recorte antes de publicar.** Um recorte que come a manga vai direto para o site. Resultado pode mudar quando o modelo for atualizado. |
| No navegador, dentro do CMS | Bibliotecas como `@imgly/background-removal` (licença AGPL) ou modelos via transformers.js. | Média a boa. | Dezenas de MB baixados no celular a cada sessão; widget customizado no CMS. | Complexidade alta para a v1. |
| Serviço externo (remove.bg e similares) | API paga. | Muito boa. | Nenhum local. | Custo por foto e suas fotos em servidor de terceiros. |

**Recomendação para a v1: recorte no próprio celular, antes do upload, e o site preparado para os dois casos.**

- Foto com transparência: a camisa pendura direto no cabide, como a silhueta no protótipo.
- Foto sem transparência: aparece dentro de uma placa (cartão na cor `--placa`) pendurada pelo cabide. Fica menos bonita, mas não quebra. É a "saída para a foto original" que os apps de guarda-roupa oferecem (Etapa 1).

Por que não automatizar já: o recorte manual no celular é feito com o aparelho na mão, olhando o resultado, e não acrescenta nenhuma dependência ao projeto. Automatizar no build troca esse passo por centenas de MB de modelo e por erros publicados sem revisão. Se o passo manual cansar na carga inicial, o script local com `rembg` resolve o lote sem mudar o resto do pipeline.

O seu celular é um Galaxy A36. A Galeria da Samsung tem o recorte de objeto (Image Clipper) desde o One UI 5.1, e o A36 saiu com versão mais nova; não achei confirmação específica para o modelo, então isso entra no teste com fotos reais. O recorte é salvo como PNG com fundo transparente, e o CMS converte para WebP mantendo a transparência.

### Como fotografar

Revisado depois do Checkpoint 3: você prefere fotografar a camisa num cabide, pendurada na parede. A posição muda; os cuidados com fundo e luz continuam. Falta um teste com fotos reais (ver "Decisões do Checkpoint 3").

O objetivo é que todas as fotos pareçam da mesma sessão e que o recorte do celular funcione de primeira.

- **Cabide:** sempre **o mesmo cabide**, de preferência fino e de cor neutra. Ele fica na foto recortada e passa a ser o cabide da arara para aquela camisa; trocar de cabide entre fotos deixa a arara desigual.
- **Posição:** camisa pendurada num prego ou gancho, afastada uns 20 cm da parede se possível (menos sombra atrás). Ombros alinhados no cabide, gola centralizada, mangas caindo soltas.
- **Fundo:** parede lisa, com **contraste** com a camisa. A parede branca serve para camisas coloridas e escuras. Para camisas brancas ou muito claras, que são a maioria das do São Paulo, pendure um lençol ou tecido cinza-médio ou escuro atrás. Camisa branca em parede branca é o caso em que o recorte mais falha.
- **Luz:** perto de uma janela, de dia, com a luz vindo de lado. Sem sol direto e sem flash, que marcam a sombra da camisa na parede.
- **Celular:** na altura do peito da camisa, reto em relação à parede (sem inclinar para cima ou para baixo), na vertical. A camisa ocupa uns 80% do quadro, com margem nos quatro lados, cabide inteiro na foto. Sem modo retrato e sem filtro.
- **Preparação:** esticar as dobras com a mão; passar se a camisa estiver muito amassada (sem ferro sobre estampa e número).
- **Ângulos:** sempre **frente** e **costas**, girando a camisa no próprio cabide, sem mexer no celular. Detalhes opcionais, de perto: escudo, etiqueta interna (tamanho e código), patches, gola, nome e número, autógrafo.
- **Depois:** recortar a frente e as costas na Galeria do Samsung (tocar e segurar sobre a camisa e escolher a opção de salvar). Os detalhes podem ficar com fundo: aparecem na ficha, não na arara.

---

## 3.5 Silhueta genérica

Parte da silhueta de `prototipos/comum.js`, que já cumpre a regra: é um molde único, desenhado por nós, que só muda de cor e de padrão.

### Anatomia

| Parte | Cor |
|---|---|
| Corpo | cor 1 |
| Padrão (listras, faixa, metade) | cor 2, alternando com a cor 3 quando houver |
| Mangas | cor 2; na `faixa-peito`, cor 1 (as mangas seguem o corpo) |
| Punhos | a cor que não estiver na manga, entre a 1 e a 2 |
| Gola | cor 2 |
| Contorno | linha fina e neutra (`--contorno-camisa`), para camisa branca não sumir na placa clara nem preta na escura |
| Costas | gola mais rasa; `personalizacao.nome` e `numero` em fonte genérica sem serifa, na cor 2 se ela contrastar 3:1 com o corpo, senão preto ou branco |

### Padrões

`liso`, `listras-verticais`, `listras-horizontais`, `faixa-peito`, `faixa-diagonal`, `metade`. São motivos usados por dezenas de clubes; nenhum identifica um clube sozinho.

### O que a silhueta não tem, por regra

- Escudo, logotipo de fabricante, patrocinador, estrelas, frisos ou golas específicas de um modelo.
- Fonte de número que imite a tipografia oficial de um clube ou fabricante.
- Variações de corte por modelo de camisa. Um molde só, sempre.

### A `faixa-peito`

Com as cores do São Paulo, a faixa no peito lembra a camisa do clube. Minha leitura é que isso respeita a regra: a faixa horizontal é um motivo genérico (vários clubes usam), e o que lembra o São Paulo é a combinação de cores, que é exatamente o dado que a silhueta deve mostrar. Ela não leva escudo, as estrelas, nem a proporção exata da faixa real. O mesmo raciocínio vale para a `faixa-diagonal`. Preciso que você confirme.

### Mudanças em relação ao protótipo

- **Manga longa:** com `manga: longa`, as mangas se estendem até o punho; com `sem-manga`, somem. O campo já está no esquema.
- **Gerada no build:** vira um componente Astro que escreve o SVG direto no HTML. Sem JavaScript, aparece mesmo antes de os scripts carregarem.
- **Ids únicos:** o recorte do padrão usa `clipPath` com id; no protótipo o id vem de um contador global, no build sai do slug da camisa.
- **Acessibilidade:** mantém o rótulo "Silhueta da camisa {clube} {temporada}" quando a silhueta substitui a foto, e fica oculta para leitores de tela quando é decorativa (cabide vazio da lista de desejos já tem o texto na etiqueta).
- **Lista de desejos:** mesma silhueta, em cinza e transparente, como no protótipo.

---

## Decisões do Checkpoint 3

| # | Tema | Decisão |
|---|---|---|
| 1 | Esquema (3.1) | Aprovado, com o cadastro de clubes separado. |
| 2 | Seleção brasileira | Arara própria "Seleção", antes das regiões. O clube da seleção tem `equipe: selecao`, `pais: Brasil` e não tem UF; a região derivada passa a ser "Seleção". |
| 3 | Preço | Não entra agora: você não lembra os preços pagos. Ideia para depois: **valor atual de mercado** (ver abaixo). |
| 4 | Cadastro (3.3) | Sveltia CMS com token pessoal, aprovado. |
| 5 | Celular | Samsung Galaxy A36. Recorte pela Galeria da Samsung. |
| 6 | Fotos (3.4) | WebP e metas de tamanho aprovados. Posição muda: **camisa no cabide, na parede**, em vez de estendida. Guia revisado acima. |
| 7 | Silhueta (3.5) | Pendente: a pergunta foi reformulada. |

### Valor de mercado (para a Etapa 5)

Registrado como ideia, sem implementação. Pontos a resolver antes de adotar:

- **Fonte do valor.** Ou você estima à mão (consultando anúncios), ou um script busca anúncios em sites de venda. A busca automática é frágil (os sites mudam e costumam proibir coleta nos termos de uso) e mistura réplicas, tamanhos e estados diferentes. Estimativa manual com data ("R$ 300 em out/2026") é mais confiável e não envelhece em silêncio.
- **Exposição.** Mesmo valor de mercado, se publicado, mostra quanto a coleção vale e que ela está na sua casa. O plano já pede que valor estimado não vá para o site público sem decisão sua. Se o objetivo for só controle pessoal, vale a mesma regra do preço: fora deste repositório (opção A ou B da seção 3.1).

### Pendências antes da Etapa 4

1. **Teste de fotos no cabide.** Fotografar três camisas seguindo o guia (uma branca do São Paulo, uma escura e uma colorida), recortar na Galeria do A36 e me mandar os recortes. Com eles verifico: se o recorte pega o cabide inteiro e as mangas, como fica a camisa branca, quanto pesam as versões geradas, e se o cabide real convive bem com o cabide desenhado das silhuetas na mesma arara.
2. **Silhueta `faixa-peito`.** Confirmar se ela pode ficar (pergunta reformulada na conversa do checkpoint).

---

## Fontes

- Astro: [deploy no GitHub Pages](https://docs.astro.build/en/guides/deploy/github/), [novidades de março de 2026](https://astro.build/blog/whats-new-march-2026/), [changelog](https://releases.sh/astro/astro-changelog.md). Versão 7.4.0, dependência de Zod 4 e `cacheDir` padrão conferidos no pacote publicado no npm.
- Sveltia CMS: [repositório](https://github.com/sveltia/sveltia-cms), [releases](https://github.com/sveltia/sveltia-cms/releases), [documentação do backend GitHub](https://sveltiacms.app/en/docs/backends/github), [autenticador para Cloudflare Workers](https://github.com/sveltia/sveltia-cms-auth). Opções de transformação de imagem e a ausência de PKCE no GitHub conferidas nos tipos do pacote `@sveltia/cms` 0.245.0.
- Decap CMS: [releases](https://github.com/decaporg/decap-cms/releases), [discussão sobre o fim do Netlify Identity](https://github.com/decaporg/decap-cms/discussions/7419), [proxy OAuth em Lambda](https://github.com/daisuke-awaji/decapcms-lambda-oauth2-backend).
- Pages CMS: [repositório e instruções](https://github.com/pages-cms/pages-cms), [GitHub App](https://pagescms.org/docs/guides/installing/github-app/), [início rápido](https://pagescms.org/docs/quick-start.md).
- Keystatic: [discussão sobre site estático](https://github.com/Thinkmill/keystatic/discussions/826).
- GitHub e PKCE: [changelog de julho de 2025](https://github.blog/changelog/2025-07-14-pkce-support-for-oauth-and-github-app-authentication/), [discussão sobre clientes públicos](https://github.com/orgs/community/discussions/15752).
- Remoção de fundo: [rembg](https://github.com/danielgatis/rembg) (tamanhos dos modelos conferidos nos arquivos de release), [RMBG 2.0 da BRIA](https://bria.ai/introducing-the-rmbg-v2-0-model-the-next-generation-in-background-removal-from-images), [@imgly/background-removal](https://unpkg.com/@imgly/background-removal@1.5.8/README.md), [recorte no iPhone (9to5Mac)](https://9to5mac.com/2024/02/10/ios-remove-background-of-image/), [Copiar objeto no iOS 26 (iPhone Life)](https://iphonelife.com/content/copy-subject), [recorte no Android (SlashGear)](https://www.slashgear.com/1570781/how-to-remove-background-photos-android).
