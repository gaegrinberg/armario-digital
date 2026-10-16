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
| Fotos | Fundo removido no próprio celular, conversão para WebP e redução no navegador pelo CMS, tamanhos finais gerados no build. Originais ficam no celular e num álbum na nuvem. | 3.4 |
| Silhueta | A do protótipo, com manga longa e gerada no build como SVG, sem JavaScript. | 3.5 |

As perguntas que dependem de você estão no fim, em **Para decidir no Checkpoint 3**.

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

A seleção brasileira não tem UF. Ela precisa de um lugar nas araras: ver as perguntas no fim.

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
| `regiao` | Da UF do clube, pela tabela do IBGE (já está em `prototipos/comum.js`). Clubes de fora do Brasil vão para "Gringas". |
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
