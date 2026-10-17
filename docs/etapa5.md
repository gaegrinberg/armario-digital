# Etapa 5: o que fazer depois da v1

Escrito em 17/10/2026, para fechar o Checkpoint 4 e escolher o que vem a seguir. Nada daqui foi implementado.

## Checkpoint 4: conferência no site publicado

Site: <https://gaegrinberg.github.io/armario-digital/>. Conferido em 17/10, com as 32 camisas reais:

| Item do plano | Resultado |
|---|---|
| Build sem erros | Ok. 35 páginas em cerca de 4 s, e o workflow do GitHub Actions passou nos últimos envios. |
| Celular (375 px) | Ok na arara, na grade e na página da camisa, sem rolagem lateral. |
| Modo escuro | Ok, pelo sistema e pela chave "Escuro". |
| Carregamento da página inicial | HTML de 7 KB e 116 KB no total na primeira tela. Só 3 das 32 fotos carregam de saída, as outras esperam a rolagem. Com 50 camisas, a primeira tela continua igual, porque o que entra a mais é carregamento preguiçoso. |
| Filtros na URL | Ok. `grade/?q=sao&cor=vermelho` aberto numa aba nova mostra as 5 do São Paulo. |

Ajuste feito agora: a grade vinha ordenada por "Data de aquisição", mas nenhuma camisa tem essa data, então a ordem saía sem critério. Agora essa opção só aparece, e só vira o padrão, quando alguma camisa tiver a data. Até lá, o padrão é a temporada.

### O que ficou pendente na v1

Tudo depende de você, pelo CMS:

1. Fotografar e cadastrar as que faltam: mais 2 do São Paulo, Flamengo, Fluminense, Bahia e Santa Cruz. Falta também o verso do Santos.
2. Preencher tamanho, conservação, origem, data de aquisição e história das 32 importadas. A data e a história alimentam as ideias 4 e 8 abaixo.
3. Ficou de fora da v1 um item da síntese da pesquisa: **"relacionadas"** no fim da página da camisa. Entrou na lista abaixo.

## Ideias, com esforço e o que acrescentam

Esforço: **P** cabe numa tarde, **M** é um dia de trabalho, **G** é mais que isso.

| # | Ideia | Esforço | O que acrescenta de fato | Recomendação |
|---|---|---|---|---|
| 1 | **Mapa com zoom até a cidade** | M | É o pedido que você já fez. Mostra de onde vem a coleção de um jeito que a arara não mostra (os 31 clubes já têm cidade e coordenadas). | **Fazer primeiro.** Exige uma decisão, abaixo. |
| 2 | **Relacionadas** na página da camisa | P | Mesmo clube, mesma temporada, mesmo fabricante. Faz a navegação continuar depois de abrir uma camisa. | Fazer junto com a 1. |
| 3 | **Camisa do dia** | P | Uma camisa diferente em destaque a cada dia, no topo da arara. Dá motivo para abrir o site. Funciona sem servidor: o navegador escolhe pela data. | Fazer. Barata e visível. |
| 4 | **Estatísticas** | P a M | Camisas por região, país, fabricante, tipo e década, gerado no build e sem biblioteca de gráficos. A "evolução da coleção" só faz sentido depois que você preencher as datas de aquisição. | Fazer a parte simples agora. A evolução fica para quando houver datas. |
| 5 | **Comparação lado a lado** | M | Duas camisas na mesma tela. Rende com o São Paulo (5 camisas, vão ser 7) e pouco com o resto, que tem uma camisa por clube. | Depois. |
| 6 | **Arara do degradê** | P | Uma arara extra com a coleção inteira na ordem das cores. A grade já ordena por cor, então o ganho é visual, não de informação. | Opcional, se você gostar da ideia. |
| 7 | **Linha do tempo** | P a M | Quase toda a coleção é da última década, e você pediu para não separar por década. A grade já ordena por temporada. | Não fazer agora. |
| 8 | **Histórias em destaque** | P | Camisas com história longa ganham um destaque. Hoje nenhuma camisa tem história, então não haveria o que mostrar. | Depois que você escrever algumas. |
| 9 | **Visão armário** | | Já existe: é a arara. | Descartar. |

## A decisão do mapa

O mapa precisa de um fundo, e são duas opções:

| | **Mapa de serviço (OpenStreetMap com Leaflet)** | **Mapa próprio em SVG** |
|---|---|---|
| Zoom | Até a rua. Atende "até a cidade". | Até o país e os estados, se tanto. Não chega na cidade sem ficar pesado. |
| Peso | Cerca de 40 KB de biblioteca, mais os pedaços do mapa que o visitante baixa ao mexer. Só carrega na página do mapa. | Um arquivo de 100 a 300 KB, sem dependência. |
| Dependência | Os pedaços do mapa vêm dos servidores do OpenStreetMap, que pedem crédito na tela e uso leve (um site pessoal se encaixa). O endereço IP de quem visita chega até eles. | Nenhuma. Funciona sempre. |
| Visual | Mapa de rua padrão. Dá para escolher um estilo mais discreto, mas ele não tem a identidade da arara. | Desenhado no estilo do site, com as cores e as placas. |

**Recomendo o OpenStreetMap com Leaflet**, porque é o único que entrega o zoom até a cidade que você pediu. O mapa de quadradinhos das UFs, que já está na arara, continua como o resumo com a cara do site.

Uma consequência: várias cidades têm mais de um clube (Rio de Janeiro tem quatro; São Paulo, Recife, Porto Alegre e Belo Horizonte têm dois). Por isso o marcador fica na cidade e abre a lista das camisas de lá, em vez de vários marcadores empilhados no mesmo ponto.

## Decisões do dono (17/10/2026)

1. **Todas as ideias aprovadas**, com as recomendações da tabela: o mapa usa **OpenStreetMap com Leaflet**; comparação, linha do tempo e histórias ficam para depois.
2. **Ideia nova, já feita:** o mapa de quadradinhos da página inicial passou a lembrar mais o contorno do Brasil, sem perder as linhas retas. A grade foi de 6 x 8 para 10 x 10, e os estados grandes ocupam mais de um quadrado (Amazonas 4 x 2, Pará e Mato Grosso 3 x 2, Bahia 2 x 2). Aparecem o Norte largo com Roraima e Amapá em cima, a ponta do Nordeste, o litoral descendo para o sudoeste e o Sul estreito. As posições ficam em `UFS`, em `src/opcoes.ts`.
3. O resto (mapa com zoom, relacionadas, camisa do dia, estatísticas e arara do degradê) fica para outras sessões.

## Feito: mapa com zoom até a cidade (17/10/2026)

Página `/mapa/` (`src/pages/mapa.astro`), com "Mapa" no menu.

- **Fundo:** OpenStreetMap pelo Leaflet 1.9.4, que entra pelo npm e só carrega nesta página (cerca de 42 KB comprimido). O mapa ganhou um filtro para combinar com o papel da arara e fica invertido no modo escuro. O crédito do OpenStreetMap aparece no canto.
- **Um marcador por cidade**, com o número de camisas de lá. Vários clubes da mesma cidade dividem o marcador (o São Paulo e o Juventus da Mooca, por exemplo). A cidade do time do coração tem o marcador na cor de destaque e, no balão, o time do coração vem primeiro.
- **Cidades próximas viram um marcador só** enquanto o zoom está longe (visto do mundo, o Sudeste inteiro vira "17"). Tocar no grupo aproxima até as cidades se separarem.
- **Balão** com as camisas da cidade, foto pequena e link para a página de cada uma.
- **Botões "Mundo" e "Brasil"** para enquadrar o mapa. A roda do mouse só dá zoom depois de um clique no mapa, para não prender a rolagem da página.
- **Lista de cidades** abaixo do mapa, que funciona sem JavaScript. "Ver no mapa" voa até a cidade.
- **Endereço por cidade:** `mapa/?cidade=rio-de-janeiro-brasil` já abre no Rio. Na página da camisa, a cidade da ficha virou link para esse endereço.
- Para entrar no mapa, o clube precisa ter `coordenadas`. Um clube sem elas aparece numa nota no fim da página.

Ajuste no topo de todas as páginas: com cinco botões, o menu quebrava em três linhas no celular. A chave de tema foi para a linha do título.

## Feito: relacionadas na página da camisa (17/10/2026)

No fim da página de cada camisa há uma arara curta, **"Penduradas perto"**, com até 6 camisas da coleção. Cada etiqueta diz por que a camisa está ali, com os dois motivos de mais peso.

- **Pontos de cada ligação** (`relacionadas`, em `src/lib/camisas.ts`): mesmo clube ou seleção 12, mesma cidade 5 ("Também do Rio de Janeiro"), mesmo ano de temporada 4 ("Também de 2021", e 2021/22 conta como 2021), mesmo fabricante 3 ("Também adidas"), mesmo esporte fora do futebol 3, mesmas cores 3 ou mesma cor principal 2 ("Também em vermelho"), mesma arara 1 e mesmo tipo 1. Entra quem soma 3 pontos ou mais.
- **De outro clube, no máximo 3.** Sem isso, a página do Juventus da Mooca virava só São Paulo.
- **Empates** se desfazem por um sorteio fixo, diferente em cada página, para as mesmas camisas não aparecerem em todas.
- Só entram camisas da coleção, não as da lista de desejos.
- A arara reaproveita o `Cabide` da página inicial, que ganhou a linha do motivo. A barra acompanha a largura toda sem JavaScript.

## Feito: camisa do dia (17/10/2026)

No topo da arara, entre o título e a busca, uma camisa pendurada num prego ao lado de uma **folhinha de parede** (mês na faixa vermelha, dia grande, dia da semana embaixo). O componente é `src/components/CamisaDoDia.astro`, e a conta fica em `src/lib/camisaDoDia.ts`.

- **Como escolhe:** a coleção é embaralhada em ciclos do tamanho dela. Com 32 camisas, cada uma aparece uma vez a cada 32 dias, sem repetir de um dia para o outro. Entram só as da coleção que têm foto.
- **Sem servidor:** o build escolhe pela data de Brasília e o navegador refaz a mesma conta com a data de quem abre. Se der outro dia (fuso diferente ou página guardada em cache), ele troca a camisa, copiando a foto da própria arara.
- **Build toda madrugada:** o workflow `site.yml` ganhou um horário (00:05 em Brasília), para a camisa certa já vir no HTML. O GitHub desliga horários assim depois de 60 dias sem nenhum commit no repositório. Se isso acontecer, o navegador continua acertando a camisa, e basta um cadastro novo (ou reativar o workflow na aba Actions) para o horário voltar.
- **Texto:** clube, temporada, tipo, fabricante, cidade (ou "Seleção · país"), quantas camisas daquele clube há na coleção e o começo da história, quando houver.
- **"Sortear outra"** troca por uma camisa qualquer e muda o título para "Sorteada agora". "Voltar à do dia" desfaz.
- A busca e o filtro dos cabides vazios não mexem nesse destaque.

## Feito: estatísticas (17/10/2026)

Página `/numeros/` (`src/pages/numeros.astro`), com "Números" no menu. Tudo é contado no build, sem biblioteca de gráficos e sem JavaScript (só uma linha que rola as colunas por ano até o fim no celular).

- **Placar do armário** no topo: placas pintadas penduradas num quadro verde, como um placar manual de várzea. Camisas, clubes e seleções, cidades, estados, países e fabricantes. As procuradas entram quando houver camisas na lista de desejos.
- **Fileiras de camisetinhas** em vez de barras: cada camisa da coleção vira uma camiseta pequena com o corpo na cor 1 e as mangas na cor 2. Dentro da fileira elas vão na ordem das cores. Tocar numa camiseta abre a camisa; o nome da fileira leva à grade já filtrada (ou à arara da região). Seções: por arara, tipo, país, fabricante e cor. Na cor, uma camisa conta em cada cor que tem, e uma faixa no topo mostra a proporção.
- **Por temporada**, em vez de década (você pediu para não separar por década): uma coluna por ano, de 1996 a 2026, com os anos vazios no meio. 2021/22 conta em 2021.
- **Chegada ao armário**: as mesmas colunas pelo ano da data de aquisição. É a "evolução da coleção" e só aparece quando alguma camisa tiver a data (testado com duas datas provisórias, já desfeitas).
- **Recordes**: temporada mais antiga e mais recente, clube e cidade com mais camisas e a que veio de mais longe (em linha reta da cidade do time do coração; hoje, Coreia do Sul, a 18.300 km de São Paulo).
- **Fichas preenchidas**: quantas camisas têm cada campo (fotos, fabricante, patrocinador, tamanho, conservação, como chegou, data e história). Serve de lembrete do que falta completar pelo CMS.

Ajuste no topo de todas as páginas: com seis botões, o menu quebrava em duas linhas no celular. No celular, os botões agora dividem a linha e ficam com menos margem interna.
