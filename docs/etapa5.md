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

## Para decidir

1. Quais ideias entram, e em que ordem. Minha sugestão: 1, 2, 3 e 4 (parte simples), nessa ordem.
2. O fundo do mapa: OpenStreetMap ou SVG próprio.
