# Armário Digital: modelo de dados e arquitetura

Etapa 3 do plano. Este documento define o esquema de uma camisa, a stack, o fluxo de cadastro, o pipeline de fotos e a silhueta. Ele parte das fotos reais (63 fotos de 32 camisas, em `Camisas/`, fora do Git) e de testes feitos com elas em 17/10/2026.

## Resumo das recomendações

| Decisão | Recomendação |
|---|---|
| Stack | **Astro** (site estático) com coleções de conteúdo validadas por Zod e otimização de imagem pelo `sharp`. Deploy pelo GitHub Actions. |
| Formato dos dados | Um arquivo Markdown por camisa: os campos no cabeçalho (frontmatter) e a história no corpo. Fotos na mesma pasta da camisa. |
| Clubes | Lista própria (`clubes`), referenciada pelas camisas. País, UF e região vêm do clube, sem precisar digitar em cada camisa. |
| Cores | **Escolhidas por você** numa paleta fixa de 13 cores. A extração automática foi testada e errou nas camisas brancas. |
| Cadastro | **Sveltia CMS** no celular (formulário que faz commit no GitHub, sem servidor) e um script local para cadastrar várias camisas de uma vez. |
| Fotos | Upload pelo CMS, que já reduz e converte para WebP. Um job do GitHub Actions remove o fundo (rembg com o modelo birefnet) e o build gera os tamanhos finais. |

---

## 3.1 Modelo de dados

### Duas coleções: clubes e camisas

As camisas apontam para um clube em vez de repetir país, UF e liga em cada registro. Com 5 camisas do São Paulo, a UF é digitada uma vez e não cinco. Isso evita erros como "SP" numa camisa e "Sp" em outra, que separariam o clube em dois no filtro. Clube novo é cadastrado uma vez só, no próprio CMS.

**Clube** (`src/content/clubes/sao-paulo.yml`):

| Campo | Tipo | Obrigatório | Observação |
|---|---|---|---|
| `nome` | texto | sim | "São Paulo FC" |
| `equipe` | `clube` \| `selecao` | sim | |
| `pais` | texto | sim | "Brasil", "Uruguai"… |
| `uf` | uma das 27 siglas | só para clube brasileiro | O build falha se um clube do Brasil ficar sem UF. |
| `liga` | texto | não | Liga ou confederação, como "Brasileirão Série A" ou "CONMEBOL". |
| `cidade` | texto | sim | Cidade do clube. Para seleção, a capital do país. |
| `coordenadas` | latitude e longitude | não | Da cidade. Prepara o mapa-múndi da Etapa 5 e eu preencho na importação. Dá para deixar vazio no celular e completar depois. |

**Em qual arara cada camisa fica:**

| Equipe | Arara |
|---|---|
| Clube brasileiro | A da região, derivada da UF. |
| Seleção, inclusive a brasileira | **"Seleções"**: Brasil, Senegal, Uruguai, Índia, Coreia e Azerbaijão. |
| Clube estrangeiro | "Gringas". |

O `timeDoCoracao` da configuração do site aponta para o id de um clube (`sao-paulo`).

**Camisa** (`src/content/camisas/sao-paulo-2019-titular/index.md`, com as fotos na mesma pasta):

| Campo | Tipo | Obrigatório | Observação |
|---|---|---|---|
| id / slug | nome da pasta | sim | `clube-temporada-tipo`, como `sao-paulo-2019-titular`. É a URL e não muda depois de criado. |
| `clube` | referência a um clube | sim | |
| `temporada` | texto no formato `2019` ou `2019/20` | sim | Validado por expressão regular. |
| `tipo` | `titular`, `reserva`, `terceira`, `goleiro`, `treino`, `pre-jogo`, `comemorativa`, `passeio` | sim | "Passeio" cobre camisas polo de viagem, como a do Azerbaijão. |
| `esporte` | texto | não | Padrão `futebol`. Quando é outro (a camisa da Índia é de `críquete`), a etiqueta e a ficha mostram o esporte. |
| `retro` | sim/não | não | Para relançamentos, como a São Paulo Cirio/Penalty. Assim um relançamento não é confundido com a camisa original da época. |
| `versao` | `torcedor`, `jogador`, `nao-sei` | não | Padrão `torcedor`. |
| `manga` | `curta`, `longa` | não | Padrão `curta`. |
| `fabricante` | texto | não | Com sugestões no CMS para evitar "adidas" e "Adidas" como valores diferentes. |
| `patrocinador` | texto | não | Patrocinador principal. |
| `tamanho` | `PP`, `P`, `M`, `G`, `GG`, `XG`, `XGG` | não | |
| `nomeNumero` | texto | não | "ADRIANO 100", "10". |
| `patches` | lista de textos | não | |
| `autografada` | sim/não | não | Padrão não. |
| `conservacao` | `nova-com-etiqueta`, `nova-sem-etiqueta`, `excelente`, `muito-boa`, `boa`, `regular`, `ruim` | não | Escala de colecionador da Etapa 1. |
| `origem` | `compra`, `presente`, `troca`, `viagem`, `outro` | não | "Como conseguiu". |
| `aquisicao` | `2019`, `2019-06` ou `2019-06-10` | não | Aceita data parcial, porque nem sempre se lembra do dia. |
| `cores` | 1 a 3 cores da paleta | sim | Ver abaixo. |
| `padrao` | `liso`, `listras-verticais`, `listras-horizontais`, `faixa-diagonal`, `faixa-peito`, `metade`, `estampada` | não | Usado pela silhueta e como filtro. "Estampada" é novo, para camisas como a da Coreia e a do Grêmio. |
| `fotos.frente`, `fotos.verso` | imagem | não | |
| `fotos.detalhes` | lista de imagens com legenda | não | Escudo, patch, autógrafo, etiqueta. |
| `tags` | lista de textos | não | Livres: "copa", "presente do pai". |
| `status` | `colecao`, `desejo` | sim | Padrão `colecao`. |
| corpo do arquivo | Markdown | não | A história da camisa (observações). Entra na busca. |

**Lista de desejos.** Para `status: desejo`, só clube, temporada, tipo e cores são obrigatórios. Uma camisa desejada aparece como cabide vazio na arara da região. Quando você comprar, é só trocar o status e acrescentar as fotos.

**Validação.** O esquema é escrito em Zod dentro das coleções do Astro. Um erro de digitação quebra o build com uma mensagem como esta:

```
camisas → sao-paulo-2019-titular: tipo: valor inválido "titula".
Esperado: titular | reserva | terceira | goleiro | …
```

As listas de opções (tipos, tamanhos, paleta etc.) ficam num único arquivo, `src/opcoes.ts`. A configuração do CMS é gerada a partir dele, para o formulário e a validação não ficarem diferentes um do outro.

### Cores: escolha manual numa paleta fixa

Testei a extração automática nas 6 camisas recortadas e ela **não serve como fonte principal**:

- Nas camisas brancas (São Paulo, Azerbaijão, Pumas), a cor dominante saiu **cinza** (`#838487`, `#8C8B8E`), por causa da luz do quarto.
- Na camisa da Coreia, as 4 cores extraídas foram tons de preto e azul-escuro. O amarelo, o vermelho e o azul da estampa, que são o que define a camisa, não apareceram.
- Na tricolor do São Paulo, o branco virou cinza-rosado.

A recomendação é você escolher de 1 a 3 cores numa **paleta fixa de 13 cores com nome**: branco, preto, cinza, vermelho, grená, laranja, amarelo, verde, azul-claro, azul, roxo, rosa e dourado. No celular, isso é tocar em três quadradinhos, sem digitar código de cor. Cada nome tem um tom fixo usado pela silhueta, e o filtro "cor" usa os mesmos nomes. A extração automática pode voltar depois como sugestão pré-preenchida, se fizer falta.

### Fora da v1

- **Campos privados (preço pago, valor estimado):** não entram. Se você quiser registrar, a proposta é um arquivo `privado.yml` fora do repositório (ou num repositório privado), lido só pelo script local. Isso fica para depois da v1.
- **Visibilidade por camisa (pública ou privada):** também fica para depois.

---

## 3.2 Stack

| | **Astro** (recomendado) | Eleventy (11ty) | HTML + JS + JSON, sem build |
|---|---|---|---|
| Validação dos dados | Nativa: coleções de conteúdo com Zod, com mensagem de erro por arquivo e por campo. | Não tem. Exigiria um script próprio. | Não tem. Um erro só aparece quando o site quebra. |
| Imagens | Nativa (`<Picture>` com sharp): gera WebP em vários tamanhos e `srcset` no build. | Plugin oficial separado, que funciona bem. | Tudo manual, ou por script próprio. |
| Interatividade (filtros, balanço) | JavaScript puro em `<script>`, como nos protótipos. Não precisa de React. | Igual. | Igual. |
| Curva para você editar | Componentes `.astro` são HTML com um cabeçalho de código. | Templates Nunjucks ou Liquid, mais soltos. | A mais simples de todas. |
| Deploy no GitHub Pages | Action oficial (`withastro/action`, v6). | Action genérica. | Nenhum build necessário. |
| Dependências | Uma (astro, que já traz o sharp). | Duas ou três. | Zero. |

Astro ganha porque a validação de esquema é **exigência do plano** e já vem pronta, e porque a otimização de imagem também vem pronta. As duas alternativas obrigariam a escrever e manter essas duas partes à mão. O Hugo também foi considerado: é muito rápido, mas os templates em Go são difíceis de editar e ele não tem validação de esquema.

Versões em 17/10/2026: astro 7.4, sharp 0.35, withastro/action v6.1.

**Estrutura proposta:**

```
src/
  content/
    clubes/        sao-paulo.yml, botafogo.yml…
    camisas/       sao-paulo-2019-titular/ (index.md, frente.webp, frente.recorte.webp…)
  opcoes.ts        listas fechadas (tipos, tamanhos, paleta, UFs → região)
  config.ts        timeDoCoracao e outras configurações do site
  components/      Arara, Cabide, Etiqueta, Silhueta, Ficha…
  pages/           index (araras), grade, camisa/[slug], desejos
public/admin/      Sveltia CMS (index.html + config.yml gerado)
scripts/           recortar.py, importar.py
.github/workflows/ site.yml (recorte + build + deploy)
```

---

## 3.3 Fluxo de cadastro

| | 1. Editar o arquivo no GitHub | 2. CMS com formulário | 3. Script local |
|---|---|---|---|
| Configuração | Nenhuma. | Uma página `admin/` e um token do GitHub. | Um script Python, que já foi testado em parte. |
| Fotos | Upload separado ("Add file → Upload") e o caminho digitado à mão no arquivo. | Campo de imagem no formulário. Abre a câmera ou a galeria e converte para WebP. | Aponta para a pasta, e o script pareia, recorta e cria os arquivos. |
| Pelo celular | Funciona, mas digitar YAML no celular é fácil de errar. | Sim, é feito para isso. | Não. |
| O que pode dar errado | Erro de digitação, só pego no build. Foto com nome errado. | Token expirar. O CMS mudar de versão. | Depende do computador. |

### Opções de CMS avaliadas

| CMS | Login no GitHub Pages | Observação |
|---|---|---|
| **Sveltia CMS** (recomendado) | **Token pessoal (PAT), sem servidor.** OAuth exige um servidor à parte. | Gratuito e de código aberto, funciona bem no celular e está em desenvolvimento ativo (v0.246, lançada em 16/10/2026). Converte as fotos no upload: WebP, tamanho máximo e aceita **HEIC** de iPhone. Compatível com a configuração do Decap. |
| Decap CMS (antigo Netlify CMS) | Precisa de um servidor OAuth (Cloudflare Worker ou similar). | Mais antigo e mais lento, e não converte imagem no upload. |
| Pages CMS | App hospedado em pagescms.org, com login por GitHub App. | Gratuito e simples, mas é um serviço de terceiros com permissão de escrita no repositório e depende de ele continuar no ar. |
| TinaCMS | Precisa do Tina Cloud ou de um backend próprio. | Pesado para um site pessoal. |

### Recomendação: Sveltia CMS + script local

- **No dia a dia (celular):** você abre `seusite/admin`, toca em "Nova camisa", escolhe o clube na lista, preenche temporada, tipo e cores e tira ou escolhe as fotos de frente e verso. Ao salvar, o CMS faz o commit. O GitHub Actions então recorta o fundo, valida os dados e publica. A camisa aparece no site em poucos minutos (o tempo exato ainda vai ser medido na Etapa 4).
- **Login:** um *fine-grained token* do GitHub com acesso **só a este repositório** e permissão de leitura e escrita de conteúdo, com validade de 1 ano. Você cola o token uma vez em cada aparelho. É a opção que o próprio Sveltia indica para quem usa o CMS sozinho. A troca: o token fica guardado no navegador do aparelho, então, se perder o celular, você revoga o token no GitHub. Se o GitHub liberar o login sem servidor (PKCE) que o Sveltia aguarda, dá para trocar depois.
- **Primeira carga e lotes grandes (computador):** `scripts/importar.py` lê a pasta `Camisas/`, usa uma lista de pares que eu monto (foto da frente, foto do verso, clube) e cria as 32 pastas com o recorte pronto. Os campos que eu não souber ficam vazios para você completar pelo CMS.

---

## 3.4 Pipeline de fotos

### Teste com as fotos reais

- **Remoção de fundo:** `rembg` com o modelo `birefnet-general-lite` (224 MB, gratuito, roda localmente). Recortou bem as 6 camisas de teste, incluindo as três brancas na parede branca. O modelo `isnet-general-use`, que é menor, deixou as camisas brancas translúcidas e foi descartado.
- **Cabide:** o modelo às vezes mantinha o cabide real e às vezes não. Um pós-processamento resolveu: uma abertura morfológica (31 px) só no terço de cima remove o arame fino do cabide, e depois tudo o que fica acima da primeira faixa vazia é cortado. Nas 6 fotos, o gancho saiu e a camisa ficou inteira. Um pedacinho do cabide ainda aparece por dentro da gola em 2 camisas, o que parece natural.
- **Exposição:** as fotos saíram um pouco escuras, e o branco virou cinza. Um ajuste automático de contraste, calculado só sobre os pixels da camisa (corte de 0,5%), deixou os brancos brancos sem estourar as cores.
- **Tempo:** cerca de 15 s por foto no seu computador. As 64 fotos de agora levam uns 16 minutos, uma vez só.

### Etapas

1. **Original completo:** fica no celular, no Google Fotos ou na pasta `Camisas/` (fora do Git). Nunca vai para o repositório.
2. **Upload (CMS ou script):** converte para WebP com no máximo 2000 px de altura e qualidade 85, e salva na pasta da camisa como `frente.webp`. Medido: **95 a 270 KB**.
3. **Recorte (GitHub Actions ou script local):** cria `frente.recorte.webp` ao lado do arquivo enviado, com fundo transparente, sem cabide e com a exposição ajustada. Só processa fotos que ainda não têm recorte, e o modelo fica em cache no Actions. Se um recorte ficar ruim, você troca o arquivo por um feito à mão (ou num site de recorte) e ele não é refeito.
4. **Build (Astro + sharp):** gera os tamanhos que o site usa.

| Versão | Largura | Uso | Medido (WebP q80) | Meta |
|---|---|---|---|---|
| Miniatura | 480 px | Arara e grade (cabe em 2 colunas com tela 3x) | 23 a 59 KB | ≤ 60 KB |
| Página | 1000 px | Página da camisa | 77 a 189 KB | ≤ 200 KB |
| Zoom | tamanho do recorte (~1300 px) | Só carrega ao abrir o zoom | 100 a 244 KB | ≤ 300 KB |

**Por que essas metas:** a tela inicial mostra umas 8 camisas antes da primeira rolagem. Com carregamento preguiçoso (`loading="lazy"`), são cerca de 300 KB de imagem para abrir o site no celular. A coleção inteira de 50 camisas em miniatura dá cerca de 2 MB, mas isso só carrega conforme a rolagem. As camisas estampadas (como a da Coreia) são as mais pesadas, e as metas foram calculadas a partir delas.

**Peso no repositório:** por camisa, frente e verso enviados mais os recortes dão de 0,5 a 1 MB. Com 200 camisas, fica entre 100 e 200 MB, bem abaixo do limite recomendado pelo GitHub (1 GB). O site publicado leva só as versões geradas.

**WebP e não AVIF:** o WebP com transparência funciona em todos os navegadores atuais e codifica rápido. O AVIF economizaria uns 20%, mas deixa o build bem mais lento. Pode entrar depois sem mudar nada nos dados.

**Sem recorte ou sem foto:** se o recorte ainda não existir, a foto enviada aparece numa "placa" de cantos arredondados, com o fundo. Sem nenhuma foto, aparece a silhueta.

### Como fotografar (guia curto)

O jeito que você fotografou já funciona. Ajustes para ficar melhor:

1. **Mesma parede, mesmo cabide.** O interruptor e o rodapé não atrapalham, porque o recorte tira os dois.
2. **Luz do dia, indireta, sem flash.** Perto da janela, mas sem sol batendo. Com luz amarela à noite, os brancos ficam cinzas.
3. **Celular na altura do peito da camisa, reto,** sem inclinar para cima. Assim a camisa não fica com a barra mais larga que os ombros.
4. **A camisa ocupando uns 70% da altura da foto.** Hoje ela ocupa uns 50%. Chegar mais perto dá mais detalhe no zoom.
5. **Alisar a camisa e as mangas** antes da foto. Prega vira sombra.
6. **Frente e depois verso, em sequência.** Detalhes (escudo, etiqueta interna) vêm depois do verso.

---

## 3.5 Silhueta genérica

A silhueta do protótipo continua: um contorno de camisa em SVG, com o corpo na cor 1, as mangas e a gola na cor 2 e o padrão em cima. Cores e padrões vêm dos campos `cores` e `padrao`, e os tons vêm da paleta fixa.

| Padrão | Desenho |
|---|---|
| `liso` | Só as cores base. |
| `listras-verticais` | Listras na cor 2, alternando com a cor 3 se houver. |
| `listras-horizontais` | Igual, na horizontal. |
| `faixa-diagonal` | Uma faixa do ombro ao quadril. |
| `faixa-peito` | **Precisa da sua confirmação.** Faixa horizontal no peito com até duas cores. É genérica, mas com branco, vermelho e preto lembra a camisa do São Paulo. |
| `metade` | Corpo dividido ao meio. |
| `estampada` (novo) | Corpo na cor 1 com manchas irregulares nas cores 2 e 3, geradas de forma aleatória a partir do id. Não imita nenhuma estampa real. |

Regras para a silhueta continuar genérica: sem escudo, sem logo de fabricante, sem patrocinador e sem número. Camisa branca leva um contorno fino para não sumir na parede clara.

---

## Decisões do Checkpoint 3 (17/10/2026)

1. **Faixa no peito:** aprovada como padrão genérico, inclusive para o São Paulo.
2. **Seleções:** ganham uma arara própria, "Seleções", com todas as seleções, inclusive a brasileira. "Gringas" fica só para clubes estrangeiros.
3. **Camisa da Índia (críquete):** entra na coleção, com o campo `esporte` indicando o esporte.
4. **Cores:** escolha manual numa paleta fixa de 13 cores.
5. **Login do CMS:** token pessoal do GitHub, restrito a este repositório.

Acréscimo para depois da v1: um **mapa-múndi com zoom até a cidade** de cada camisa (capital, no caso das seleções). Ele foi registrado na Etapa 5 do plano. Por isso o clube já guarda `cidade` e `coordenadas` desde a v1.
