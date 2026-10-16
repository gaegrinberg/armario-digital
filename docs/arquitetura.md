# Armário Digital: modelo de dados e arquitetura

Etapa 3 do plano. Pesquisa feita em outubro de 2026. Versões consultadas: Astro 7.4, Sveltia CMS 0.245, sharp 0.35, zod 4.

## Resumo para o Checkpoint 3

| Decisão | Recomendação |
|---|---|
| Dados | Um arquivo Markdown por camisa (campos no cabeçalho, história no corpo), dentro de uma pasta com as fotos dela. Clubes num cadastro à parte, para UF, país e cores não serem redigitados. |
| Validação | Esquema zod nas coleções do Astro, com mensagens em português. Erro de digitação quebra o build e diz arquivo, campo e valores aceitos. |
| Cores | Digitadas por você (até 3), com padrão herdado do clube. A cor nomeada do filtro é calculada no build. Extração automática fica para depois. |
| Stack | Astro 7, sem framework de interface. Filtros em JavaScript próprio, reaproveitando o protótipo. Deploy por GitHub Actions. |
| Cadastro | Sveltia CMS em `/admin`, pelo celular, entrando com um token do GitHub restrito a este repositório. Editor web do GitHub como reserva. Script local só para importar a coleção inicial, se ela for grande. |
| Fotos | O CMS converte a foto para WebP de até 1600 × 2000 px no próprio celular antes de enviar. O build gera as versões menores. Originais ficam no rolo da câmera. |
| Fundo | Remoção feita no celular, com a ferramenta do sistema, antes do upload. O site aceita os dois casos: recortada fica pendurada no cabide; com fundo fica presa por um prendedor, como num varal. |
| Silhueta | A do protótipo, com 6 padrões. Falta você confirmar a `faixa-peito`. |

As perguntas que dependem de você estão no fim.

---

## 3.1 Modelo de dados

### Organização dos arquivos

```
src/
  content/
    camisas/
      sao-paulo-2024-titular/
        index.md        ← campos + história
        frente.webp
        costas.webp
        detalhe-1.webp
    clubes/
      sao-paulo.yaml
      cruzeiro.yaml
  data/
    site.yaml           ← timeDoCoracao e textos do site
    listas.yaml         ← fabricantes, ligas, países
```

Cada camisa é uma pasta com o texto e as fotos. Apagar a pasta apaga tudo daquela camisa, e o editor web do GitHub mostra a camisa inteira num lugar só.

**Markdown em vez de YAML puro:** a história fica no corpo do arquivo, com parágrafos normais, sem as regras de indentação de texto longo do YAML. O CMS mostra esse corpo como uma caixa de texto.

### Clube

| Campo | Tipo | Obrigatório | Observação |
|---|---|---|---|
| id | nome do arquivo | sim | `sao-paulo`. É o que a camisa referencia. |
| nome | texto | sim | "São Paulo FC" |
| equipe | `clube` ou `selecao` | sim | |
| pais | texto da lista `paises` | sim | "Brasil", "Argentina" |
| uf | sigla de uma das 27 UFs | se clube brasileiro | A região vem da UF. Clube estrangeiro não tem UF e vai para "Gringas". |
| liga | texto da lista `ligas` | não | Liga atual. A camisa pode sobrescrever. |
| cores | 1 a 3 cores (hex) | sim | Cores do clube. Usadas na faixa da arara do coração e como cor padrão das camisas. |

Por que separar: com 6 camisas do São Paulo, UF, país, liga e cores seriam digitados 6 vezes, e "São Paulo" e "São Paulo FC" virariam dois clubes no filtro. O custo é um passo a mais quando entra um clube novo: cadastrar o clube antes da camisa.

### Camisa

| Campo | Tipo | Obrigatório | Observação |
|---|---|---|---|
| slug | nome da pasta | sim | Gerado na criação: `clube-temporada-tipo`. Não muda depois, para a URL ser estável. Duas cópias iguais recebem `-2`. |
| status | `colecao` ou `desejo` | sim | Padrão `colecao`. |
| clube | referência a um clube | sim | Daqui vêm equipe, país, UF e região. |
| temporada | `2024` ou `2014/15` | sim | Validado por padrão: 4 dígitos, ou 4 dígitos, barra e 2 dígitos. |
| tipo | lista fechada | sim | titular, reserva, terceira, goleiro, treino, pré-jogo, comemorativa. |
| versao | `torcedor` ou `jogador` | sim | Padrão `torcedor`. |
| manga | `curta` ou `longa` | sim | Padrão `curta`. Novo, veio da pesquisa (FootyCollect). |
| liga | texto da lista `ligas` | não | Só se for diferente da liga do clube naquela temporada (ex.: Cruzeiro 2022 na Série B). |
| fabricante | texto da lista `fabricantes` | não | |
| patrocinador | texto livre | não | Livre porque muda muito e não é filtro. |
| tamanho | PP, P, M, G, GG, XGG | não | |
| nome / numero | texto / número | não | Separados (o protótipo usava "LUCAS 7" num campo só). Assim a silhueta das costas desenha cada um no lugar certo. |
| patches | lista de textos | não | |
| autografada | sim ou não | sim | Padrão não. Quem assinou vai na história. |
| conservacao | lista fechada | se `colecao` | Nova com etiqueta, Nova sem etiqueta, Excelente, Muito boa, Boa, Regular, Ruim. |
| origem | lista fechada | não | Compra, Presente, Troca, Viagem, Outro. |
| aquisicao | `2023`, `2023-10` ou `2023-10-01` | não | Aceita data parcial, porque nem sempre você vai lembrar o dia. |
| cores | 1 a 3 cores (hex) | não | Se vazio, usa as cores do clube. Preencher em reserva, terceira, goleiro etc. A ordem importa: 1 é o corpo, 2 é o detalhe, 3 é a segunda cor do padrão. |
| padrao | lista fechada | sim | liso, listras-verticais, listras-horizontais, faixa-peito, faixa-diagonal, metade. Padrão liso. |
| fotos | frente, costas, detalhes | não | Detalhes é uma lista de foto + legenda curta ("etiqueta interna", "patch da Libertadores"). |
| tags | lista de textos | não | Agrupamentos livres: "Copa do Brasil 2023", "camisa de viagem". |
| (corpo) | texto | não | A história da camisa. Entra na busca. |

**Calculados no build, nunca digitados:** região (da UF), cor nomeada para o filtro (cada hex encaixado na paleta de 12 cores da Etapa 1), título ("São Paulo FC 2024 · Titular"), se a foto é recortada (lido da própria imagem, ver 3.4) e ordem dentro da arara.

**Exemplo:**

```markdown
---
status: colecao
clube: sao-paulo
temporada: "2023"
tipo: reserva
versao: jogador
fabricante: Trivela
patrocinador: Banco Garoa
tamanho: G
nome: LUCAS
numero: 7
conservacao: Muito boa
origem: Compra
aquisicao: 2023-10
cores: ["#D7192D", "#FFFFFF", "#111111"]
padrao: listras-verticais
fotos:
  frente: ./frente.webp
  costas: ./costas.webp
---
A camisa da campanha da Copa do Brasil. Fiquei três meses procurando no meu tamanho.
```

### Mudanças em relação ao ponto de partida do plano

- **Saíram** `tipo de equipe`, `país` e `liga` da camisa: vêm do clube. A liga ainda pode ser sobrescrita.
- **Entraram** `manga`, `padrao`, `tags`, `uf` (no clube) e nome e número separados.
- **Década sai do filtro.** Você disse que quase tudo é da última década. Fica o filtro por temporada. Se um dia entrarem camisas antigas, a década volta como campo calculado, sem mudar os dados.
- **Sem número de inventário.** O protótipo do museu tinha "Nº 007". Um número derivado da ordem de aquisição muda quando você cadastra uma camisa antiga depois; um número digitado é um campo a mais para manter. A arara não precisa dele.
- **Sem campo de visibilidade privada.** O repositório é público: um campo `privada: true` só esconderia a camisa do site, mas ela continuaria visível no GitHub. Isso daria uma falsa sensação de privacidade. Se você quiser registrar preço pago, a proposta é uma planilha sua, fora do repositório, usando o slug como chave. Não entra na v1.

**Atenção ao que já é público:** data de aquisição e a história ("presente do meu pai") ficam visíveis para qualquer pessoa. Os dois são opcionais.

### Listas fechadas e semiabertas

- **Fechadas, no código:** tipo, versão, manga, conservação, origem, padrão, tamanho, UF. Mudam raramente; mudar exige editar o esquema.
- **Semiabertas, em `src/data/listas.yaml`:** fabricantes, ligas e países. Aparecem como lista de escolha no CMS e podem ser editadas por ele, numa tela "Listas". Assim um fabricante novo entra pelo celular sem abrir brecha para "Adidas" e "adidas" virarem dois filtros.

O esquema do Astro e o CMS leem o mesmo `listas.yaml`, para não haver duas fontes.

### Validação

As coleções de conteúdo do Astro validam cada arquivo com zod no build. O zod 4 tem tradução para português do Brasil; testei a mensagem para um tipo de camisa errado:

```
Opção inválida: esperava uma das seguintes opções: "titular"|"reserva"|...
```

O Astro acrescenta o arquivo e o campo, e o build falha antes do deploy. O site publicado continua na versão anterior.

Regras além do tipo de cada campo:

- `uf` obrigatória se o clube é brasileiro e de clube; proibida em estrangeiro.
- `conservacao` obrigatória se `status: colecao`.
- `clube` precisa existir em `clubes/`; `timeDoCoracao` também.
- `cores` com 1 a 3 hex válidos; `temporada` e `aquisicao` no formato certo.
- Foto referenciada precisa existir (o `image()` do Astro já verifica).

O CMS repete parte dessas regras no formulário (obrigatório, padrão de temporada, listas), então a maioria dos erros nem chega ao build. O build é a segunda barreira, para edições feitas fora do CMS.

### Cores: digitadas ou extraídas da foto?

| | Digitadas por você | Extraídas da foto |
|---|---|---|
| Esforço | Escolher 1 a 3 cores no seletor. Com o padrão herdado do clube, a titular não pede nada. | Nenhum. |
| Funciona sem foto | Sim. A lista de desejos e as camisas ainda sem foto precisam de cor para a silhueta. | Não. |
| Papel de cada cor | Você diz qual é o corpo e qual é o detalhe, que é o que a silhueta precisa. | O algoritmo dá as cores mais frequentes, sem saber o que é corpo, gola ou listra. |
| Erros conhecidos | Tom ligeiramente diferente do real. | Pega o fundo, a sombra, o patrocinador grande; erra listras finas (visto no Cooper Hewitt). |
| Dependência | Nenhuma. | Uma etapa a mais no build ou no cadastro. |

**Recomendação:** digitadas, com herança do clube. A extração automática pode voltar depois como sugestão (o build avisa quando a cor da foto está muito longe da cor 1 digitada), não como fonte.

---

## 3.2 Stack

| | Astro 7 | Eleventy 3 | Hugo | Sem gerador (protótipo + scripts) |
|---|---|---|---|---|
| Validação de esquema | Embutida (coleções com zod). | Não tem; precisa montar com zod e um script. | Não tem; precisa de script externo. | Script próprio. |
| Otimização de imagem | Embutida (sharp), com `srcset`, WebP e AVIF, e cache entre builds. | Plugin oficial (`eleventy-img`), boa qualidade, mais configuração. | Embutida e rápida. | Script próprio com sharp. |
| Página por camisa | Rota a partir da coleção. | Paginação a partir de dados. | Nativo. | Feito à mão ou só modal (sem URL por camisa). |
| JavaScript no navegador | Zero por padrão; só o que escrevermos. | Zero. | Zero. | O que escrevermos. |
| Entender e editar | Componentes `.astro` são HTML com um bloco de código no topo. | Templates Nunjucks/Liquid, simples. | Templates Go, os mais difíceis de ler. | O mais direto, mas tudo é código nosso. |
| Dependências | ~300 pacotes npm (sharp, vite, zod...). | Menos pacotes. | Um binário. | Só sharp e zod. |
| Ritmo de mudança | Versão principal por ano (5, 6 e 7 em cerca de 18 meses). Atualizar exige seguir guia de migração. | Mais estável. | Estável. | Só muda quando nós mudamos. |

**Recomendação: Astro 7.** É o único que já resolve juntas as duas exigências do plano que mais pesam: validação de esquema com mensagem clara e imagens otimizadas no build. Nos outros, isso vira código nosso para manter.

**Pontos negativos que aceito e como contenho:**

- **Número de dependências** vai contra "poucas dependências". Na prática, as dependências diretas são duas (`astro` e `@astrojs/check`); o resto vem junto. Nada de React, Tailwind ou bibliotecas de interface: filtros, arara e balanço continuam em JavaScript e CSS próprios, portados do protótipo.
- **Atualizações anuais** com quebra. O site não precisa acompanhar: fixamos a versão e só atualizamos quando houver motivo. O Dependabot pode avisar.
- **Requer Node 22.22 ou mais novo** para rodar localmente. No celular você não roda nada; o build acontece no GitHub.

**Deploy:** GitHub Actions com a ação oficial do Astro e `actions/deploy-pages`. Cada commit na `main`, inclusive os feitos pelo CMS, publica o site em cerca de 2 minutos. O cache de imagens do Astro é guardado entre execuções, para não reprocessar todas as fotos a cada camisa nova.

**Como o filtro funciona num site estático:** o build gera as páginas e um índice JSON pequeno com os campos filtráveis. O JavaScript da página lê o índice, aplica filtros e busca no navegador e escreve o estado na URL (`?clube=sao-paulo&tipo=reserva`). Com algumas centenas de camisas, o índice fica na casa de dezenas de KB.

---

## 3.3 Fluxo de cadastro

### As três opções do plano

| | 1. Editar no GitHub | 2. CMS baseado em Git | 3. Script local |
|---|---|---|---|
| Configuração | Nenhuma. | Uma página `/admin` e um arquivo de configuração. Entrada com token (5 min) ou com servidor de OAuth (ver abaixo). | Um script no repositório; Node instalado no computador. |
| Pelo celular | Funciona, mas é digitar YAML no teclado do celular, com aspas, dois-pontos e indentação. | Sim: formulário com listas, seletor de cor e campo de foto com câmera. | Não. |
| Upload de fotos | Pelo navegador (Add file → Upload). A foto vai no tamanho original (3 a 12 MB), o que fere a restrição 4. Do iPhone pode chegar em HEIC, que o sharp pré-compilado não lê (verifiquei: só lê AVIF). | O Sveltia converte HEIC e JPEG para WebP e reduz o tamanho no próprio celular, antes do commit. O original não entra no repositório. | O script redimensiona, converte e pode remover fundo. Melhor controle de qualidade. |
| Erros possíveis | Erro de sintaxe quebra o build (o site no ar não é afetado; você recebe o e-mail de falha). Esquecer de criar a pasta certa. | Token expirado. Conflito se editar a mesma camisa em dois lugares ao mesmo tempo (raro para um usuário só). | Só funciona onde o projeto estiver instalado. |

### Qual CMS

| CMS | Autenticação no GitHub Pages | Observações |
|---|---|---|
| **Sveltia CMS** | Token pessoal do GitHub, ou OAuth com um autenticador em Cloudflare Workers. PKCE (sem servidor) ainda não funciona com GitHub. | Interface em pt-BR. Converte imagens para WebP no navegador, inclusive no Safari (usa um codificador próprio quando o navegador não codifica WebP) e lê HEIC. Pastas por camisa com fotos junto. Desenvolvimento ativo (versão de 15/10/2026); ainda sem a versão 1.0. |
| Decap CMS (ex-Netlify CMS) | Exige servidor de OAuth (Cloudflare Worker ou similar). | Mesmo formato de configuração do Sveltia, mas sem conversão de imagem e com manutenção lenta. O próprio Sveltia nasceu para substituí-lo. |
| Pages CMS | Serviço hospedado em `app.pagescms.org`; você instala um GitHub App deles. | Simples de usar e com boa interface no celular, mas o app pede leitura e escrita em conteúdo, Actions e administração do repositório, e o cadastro passa a depender do servidor de terceiros. Auto-hospedar exige PostgreSQL. |
| TinaCMS, Keystatic | Exigem um backend (nuvem própria do produto ou rotas de servidor). | Não rodam só com GitHub Pages sem conta em serviço externo. |

**Token ou OAuth no Sveltia:**

- **Token pessoal (fine-grained)**: criado no GitHub, com acesso **só a este repositório** e só à permissão "Contents: leitura e escrita", com validade de um ano. Você cola uma vez no navegador do celular e ele fica guardado ali. Se perder o celular, revoga o token no GitHub. Nenhum serviço extra.
- **OAuth com autenticador**: tela de "Entrar com GitHub", sem token para copiar. Exige conta na Cloudflare, publicar o autenticador e criar um OAuth App. E o OAuth App clássico do GitHub não consegue se limitar a um repositório: o escopo `repo` vale para todos os seus repositórios.

Para um único editor, o token é mais simples e dá menos acesso. O OAuth só compensa se outra pessoa for editar.

### Recomendação: combinação

1. **Dia a dia: Sveltia CMS em `armario.../admin`, com token.** Pelo celular: Nova camisa → escolher clube → temporada, tipo → tirar ou escolher as fotos → salvar. Um commit, e o site atualiza em cerca de 2 minutos.
2. **Reserva: editor do GitHub.** Para corrigir um campo rápido ou se o CMS estiver fora. A validação do build protege contra erro de digitação.
3. **Importação inicial: script local, só se a coleção atual for grande.** Com dezenas de camisas, cadastrar uma a uma pelo celular é cansativo. Um script lê uma planilha (CSV com uma linha por camisa) e uma pasta de fotos nomeadas pelo slug, e gera as pastas. Usado uma vez, no computador. Se forem poucas camisas, dispensa.

**O que pode dar errado com o Sveltia:** ainda está na série 0.x e muda com frequência. Mitigação: fixar a versão no `<script>` da página `/admin` e atualizar quando quisermos. Se o projeto parar, o formato de configuração é o mesmo do Decap, que serve de substituto.

---

## 3.4 Pipeline de fotos

### Caminho de uma foto

```
celular                      repositório                     site publicado
foto original (HEIC/JPEG)
  → remover fundo (opcional,
    ferramenta do sistema)
  → upload pelo CMS
    (vira WebP ≤ 1600×2000) → frente.webp (~300 a 500 KB) → build (sharp) → 4 larguras em WebP
```

### Versões

| Versão | Onde | Tamanho | Meta de peso | Por quê |
|---|---|---|---|---|
| Mestre | repositório | até 1600 × 2000, WebP qualidade 85 | até 500 KB | Fonte de todas as outras. Grande o bastante para zoom em escudo e etiqueta; pequena o bastante para o repositório. |
| Miniatura | site | 320 e 640 px de largura | até 50 KB (640) | Na arara e na grade, uma camisa ocupa cerca de 180 px de largura no celular; em tela de densidade 3, a 640 cobre. |
| Página | site | 960 px | até 120 KB | Ficha da camisa no celular. |
| Zoom | site | 1600 px | até 250 KB | Só carrega ao ampliar. |

As metas são estimativas para fotos de camisa, que têm áreas grandes de cor lisa. Vou medir com as suas primeiras fotos reais na Etapa 4 e ajustar a qualidade.

**Só WebP, sem AVIF, na v1.** AVIF seria uns 20% a 30% menor, mas a codificação é lenta (o build fica minutos mais longo com centenas de fotos) e o próprio Sveltia não codifica AVIF no navegador. WebP funciona em todos os navegadores atuais. AVIF pode entrar depois só mudando a configuração.

**Folga de espaço.** O GitHub recomenda repositório de até 1 GB e limita o site publicado a 1 GB. Com frente, costas e um detalhe por camisa: cerca de 1,2 MB por camisa no repositório e 1 MB no site. Isso dá folga para algumas centenas de camisas. Duas ressalvas: o histórico do Git guarda fotos substituídas para sempre, e acima de umas 600 camisas vale reavaliar (mover as fotos mestre para um armazenamento externo).

### Onde ficam os originais

No rolo da câmera, num álbum "Armário" (iCloud ou Google Fotos). Não entram no repositório. Se um dia quiser regenerar tudo em qualidade maior, eles estão lá.

### Remoção de fundo

A arara depende disso para ficar bonita, então decidi aqui em vez de deixar para depois.

| Onde | Como | Qualidade | Dependência | Veredito |
|---|---|---|---|---|
| **No celular, antes do upload** | Ferramenta do sistema: no iPhone, "Remover Fundo" no app Arquivos ou copiar o objeto da foto; em Android recentes (Samsung, Pixel), "recortar objeto" na galeria. Sai PNG com transparência. | Boa para objeto sobre fundo liso e contrastante. Você vê o resultado antes de enviar. | Nenhuma no projeto. Depende do modelo do seu celular. | **Recomendado.** |
| Script local | `rembg` (Python). Modelo padrão ~170 MB; o BiRefNet, melhor nas bordas, ~1 GB e ~15 s por foto em CPU. | A melhor, com controle. | Python e modelos no computador. | Só para a importação inicial em lote, se fizer sentido. |
| No build (GitHub Actions) | Mesmo `rembg` rodando a cada deploy. | Igual ao script. | Baixa o modelo, deixa o build lento e um recorte ruim vai ao ar sem você ver. | Descartado. |
| No navegador, dentro do CMS | `@imgly/background-removal` (modelo de dezenas de MB baixado no celular). | Boa. | Licença AGPL; o Sveltia não tem esse recurso, seria integração nossa. | Descartado: complexidade alta para o ganho. |

**O site aceita os dois tipos de foto.** No build, o sharp verifica se a imagem tem transparência nos cantos. Se tem, a camisa aparece pendurada direto no cabide, como no protótipo. Se não tem, a foto aparece como um cartão preso ao cabide por um **prendedor de roupa**, como no varal do Shopping Varal da pesquisa. Assim uma foto sem recorte não fica com cara de erro, e você não é obrigado a recortar tudo. Nenhum campo novo: o site lê da própria imagem.

A conversão do Sveltia para WebP precisa manter a transparência do PNG. O formato permite e o codificador usado também, mas vou confirmar no primeiro teste da Etapa 4.

### Guia de fotografia

1. **Camisa deitada, não pendurada.** Sobre cama, chão ou mesa. O cabide real apareceria na foto e brigaria com o cabide desenhado. Mangas abertas e simétricas, gola alinhada, sem dobras (passe a mão ou o ferro).
2. **Fundo liso e contrastante.** Lençol ou cartolina sem estampa. Escuro para camisa clara, claro para camisa escura. Contraste é o que faz o recorte funcionar; camisa branca em lençol branco não recorta.
3. **Luz de janela, indireta.** Durante o dia, sem sol batendo direto e sem flash. Evita reflexo em escudo emborrachado e patrocinador termocolado. Desligue a luz do teto se ela for amarela.
4. **Celular paralelo à camisa, de cima.** Tela na horizontal, bem em cima do centro da camisa. Use a lente 1x a cerca de 1 m, ou a 2x de mais longe; a ultra-angular (0,5x) deforma as mangas.
5. **Enquadramento retrato com margem.** A camisa inteira, com uma folga de dois dedos em volta. O site centraliza na proporção 4:5.
6. **Fotos por camisa:** frente e costas sempre (mesma posição, só vire a camisa). Detalhes opcionais: escudo, etiqueta interna, patch, autógrafo, número.

---

## 3.5 Silhueta genérica

A do protótipo segue para a v1 sem mudança de desenho:

- Contorno único para todas as camisas, sem escudo, logo, patrocinador ou detalhe de modelo real.
- Corpo na cor 1, gola e punhos na cor 2. Um padrão opcional usa as cores 2 e 3.
- Padrões: liso, listras verticais, listras horizontais, faixa no peito, faixa diagonal, metade.
- Nas costas, nome e número em fonte genérica, na cor 2 se ela tiver contraste com a cor 1, senão preto ou branco.
- Camisa branca ganha contorno fino para não sumir no fundo.
- Cabide vazio da lista de desejos: só o contorno, tracejado.

**Sobre a `faixa-peito`.** É uma faixa horizontal no peito, padrão usado por vários clubes. Com as cores do São Paulo, lembra a camisa do clube, como listras alvinegras lembram o Botafogo. Minha leitura é que isso respeita a regra: a silhueta reproduz cores e um padrão genérico, não um modelo de uma temporada. A regra seria quebrada se copiássemos a altura, a espessura e os frisos de uma camisa específica. Preciso da sua confirmação.

---

## Perguntas para o Checkpoint 3

1. **Seu celular é iPhone ou Android, e de que modelo?** Define se a remoção de fundo no próprio celular está disponível. Se não estiver, o plano B é foto com fundo uniforme, presa pelo prendedor.
2. **Quantas camisas você tem hoje?** Até umas 20, cadastro pelo celular. Acima disso, faço o script de importação por planilha.
3. **Seleção Brasileira:** não tem UF, então não cai numa região. Proposta: uma arara "Seleção" depois das regiões e antes das "Gringas". Seleções estrangeiras continuam nas "Gringas".
4. **Entrada no CMS por token**, aceitando colar o token uma vez no navegador do celular? Ou prefere o botão "Entrar com GitHub", que exige uma conta na Cloudflare?
5. **Clubes num cadastro separado**, com o passo extra quando entra um clube novo?
6. **`faixa-peito`** respeita a regra da silhueta?
7. **Data de aquisição e história públicas:** tudo bem ficarem visíveis para qualquer pessoa? Os dois continuam opcionais por camisa.

---

## Fontes

- Sveltia CMS: [repositório](https://github.com/sveltia/sveltia-cms), definições de tipo do pacote `@sveltia/cms` 0.245.0 no npm (autenticação, conversão de imagem, idiomas da interface).
- Autenticador do Sveltia em Cloudflare Workers e entrada por token: [sveltia-cms-auth (fork)](https://github.com/MattBlogsIT/sveltia-cms-auth).
- Decap CMS: [visão geral dos backends](https://decapcms.org/docs/backends-overview/).
- Pages CMS: [início rápido](https://pagescms.org/docs/quick-start/), [permissões do GitHub App](https://pagescms.org/docs/development/github-app).
- Astro: [referência das coleções de conteúdo](https://docs.astro.build/en/reference/modules/astro-content), [Astro 6.1, configuração de imagem](https://astro.build/blog/astro-610). Versão 7.4.0 e requisito de Node conferidos no npm.
- Limites do GitHub Pages: [documentação](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits).
- Remoção de fundo: [comparação de APIs com BiRefNet e rembg](https://aireiter.com/blog/best-background-removal-api), [licença do @imgly/background-removal](https://unpkg.com/@imgly/background-removal@1.5.8/README.md), [remoção de fundo no iPhone](https://www.igeeksblog.com/how-to-remove-background-from-images-on-iphone-ipad/).
- Testes locais: sharp 0.35.5 pré-compilado lê AVIF mas não HEIC; zod 4 com `z.locales.ptBR()` gera mensagens em português.
