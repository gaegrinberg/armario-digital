# Armário Digital: pesquisa de referências

Etapa 1 do plano. Pesquisa feita em outubro de 2026.

Alguns sites (Football Kit Archive, Classic Football Shirts) bloqueiam acesso automatizado. Nesses casos, as observações vêm de matérias sobre o site e das páginas que consegui abrir. Vale você dar uma olhada direta antes da Etapa 2.

---

## 1. Catálogos de camisas de futebol

### Football Kit Archive
<https://www.footballkitarchive.com/>

- **Faz bem:** organização em três eixos que funcionam bem juntos (clube, país, liga). Cada clube tem uma página de histórico que agrupa as camisas por temporada e mostra os fornecedores por período (ex.: "adidas 2010–2018, Nike 2018–hoje"). Nome de cada item é padronizado: "Clube 2024-25 Home Kit". Desde janeiro de 2026, usuários podem montar a própria coleção e subir fotos ([Footy Headlines](https://www.footyheadlines.com/2026/01/football-kit-archive-launches-all-new.html)).
- **Faz mal / não serve:** imagens são fotos oficiais de divulgação, que não podemos usar. Votação, seguidores e mensagens não fazem sentido para um site pessoal. Fotos próprias são recurso pago (plano Plus).
- **Adaptar:** o nome padronizado gerado a partir dos campos (clube + temporada + tipo) e a faixa de fornecedores por período na página do clube.

### Historical Football Kits
<https://www.historicalkits.co.uk/>

- **Faz bem:** usa ilustrações desenhadas em um molde padrão, em vez de fotos. Isso deixa centenas de camisas visualmente comparáveis. Galerias por temporada e liga. Log de atualizações datado.
- **Faz mal / não serve:** visual antigo, navegação por pastas, sem filtros nem busca. O autor parou de atualizar.
- **Adaptar:** a ideia do molde padrão é exatamente a nossa silhueta genérica. Prova que um desenho simples com as cores certas já basta para reconhecer uma camisa.

### FKApi e FootyCollect (código aberto)
<https://mintlify.wiki/sunr4y/FootyCollect/features/collection-management>

- **Faz bem:** é o modelo de dados mais completo que encontrei para colecionador. Camisa tem: jogador, número, se tem nome/número aplicado, tamanho, versão (torcedor/jogador), tipo de manga (curta/longa), autografada. Campos comuns: clube, temporada, fabricante, competições, conservação, cores, país, tags. Conservação em duas camadas: nota de 1 a 10 e rótulo de colecionador (BNWT, BNWOT, Excelente, Muito boa, Boa, Regular, Ruim). Nome do item gerado automaticamente. Visibilidade por item: público, privado, rascunho.
- **Faz mal / não serve:** é uma aplicação Django com banco de dados, incompatível com GitHub Pages. Depende de uma API que você precisa popular via scraping.
- **Adaptar:** os campos "manga" e "nome/número aplicado", a escala de conservação com rótulos e o campo de visibilidade por item.

### ShirtSociety
<https://shirtsociety.eu/articles/shirtsociety-may-2026-update>

- **Faz bem:** catálogo com 55 mil camisas. Você escolhe a camisa do catálogo e só preenche tamanho, conservação e preço. Estatísticas por clube, fabricante e época, e crescimento da coleção ao longo do tempo.
- **Faz mal / não serve:** registra preço pago e gasto total, que no nosso caso não pode ir para o site público. Plataforma fechada, dados não são seus.
- **Adaptar:** a tela de estatísticas (Etapa 5) e o gráfico de evolução da coleção, que só precisa da data de aquisição.

### Shirt Squad e Kit Collector (apps de celular)
<https://apps.apple.com/gw/app/6479617183>

- **Faz bem:** Shirt Squad registra tamanho, manga, nome aplicado, conservação e preço. Kit Collector permite tirar a foto direto do app, guarda tudo no aparelho, sem conta, e mostra estatísticas por país, temporada e conservação.
- **Faz mal / não serve:** dados presos ao app e ao aparelho. Não geram um site navegável e compartilhável. Kit Collector só tem uma listagem de terceiros, não consegui confirmar os detalhes.
- **Adaptar:** o cadastro que começa pela câmera.

### Lojas de camisas retrô (Classic Football Shirts, Cult Kits, First11)
<https://www.classicfootballshirts.co.uk/>, <https://www.cultkits.com/>

- **Faz bem:** filtros por time, liga, década, fabricante, tamanho e conservação. Várias fotos por produto (frente, costas, detalhes de escudo, etiqueta e patches).
- **Faz mal / não serve:** a navegação é pensada para venda (preço, estoque, promoção). Muitas páginas de coleção nem têm filtros.
- **Adaptar:** a convenção de fotos (frente, costas e close de detalhes) e o filtro por década, que é mais útil que por temporada exata para navegar.

---

## 2. Acervos digitais de museus

### Museum Wales: página de objeto de uma camisa
<https://museum.wales/collections/online/object/627020ff-072b-337e-bf50-a90c441df3f3>

- **Faz bem:** é o exemplo mais próximo do nosso caso: uma camisa pré-jogo do Wrexham 2025/26 tratada como objeto de museu. Título curto, depois um parágrafo contando a história do desenho (padrão inspirado em cobertores tradicionais), depois a ficha técnica (número de registro, data e forma de aquisição, classificação). No fim, "itens relacionados" com miniaturas de outras camisas, com fabricante e ano.
- **Faz mal / não serve:** visual institucional genérico, ficha com campos que não nos interessam (localização no depósito).
- **Adaptar:** a ordem **história antes da ficha** e o bloco de relacionadas no rodapé (mesmo clube, mesma temporada, mesmo fabricante).

### Cooper Hewitt (Smithsonian)
<https://collection.cooperhewitt.org/>, [blog do Labs](https://labs.cooperhewitt.org/)

- **Faz bem:** busca por cor. Cada objeto tem até 5 cores extraídas automaticamente da foto. As cores são "encaixadas" numa paleta fixa (116 cores CSS) para a busca não virar uma infinidade de tons. A versão beta de 2013 abria com uma grade de cores como porta de entrada.
- **Faz mal / não serve:** o próprio Labs admite que a extração automática às vezes pega a cor do fundo da foto. 116 cores é demais para um acervo pequeno.
- **Adaptar:** a ideia de **guardar a cor exata e também a cor encaixada numa paleta curta**. Para nós, uma paleta de 10 a 14 cores nomeadas em português (vermelho, grená, azul-marinho, celeste, verde, amarelo, laranja, roxo, preto, branco, cinza, rosa).

### Rijksmuseum (Rijksstudio e "Infinite Rijksmuseum")
<https://www.rijksmuseum.nl/>, [MuseumNext](https://www.museumnext.com/article/inside-the-infinite-rijksmuseum-how-one-museum-is-rethinking-digital-collections/)

- **Faz bem:** imagens com zoom profundo. Desde 2024, a navegação vai de uma obra para o artista, para o tema, para histórias mais amplas, sem precisar voltar à busca. Cada atributo do objeto é um link.
- **Faz mal / não serve:** escala de 800 mil objetos, com grafo de dados e IA. Nada disso se justifica para centenas de camisas.
- **Adaptar:** **todo atributo na página da camisa é um link para a coleção filtrada** (clicar em "Umbro" mostra todas as Umbro). É barato de fazer e cria navegação lateral de graça.

### V&A (Victoria and Albert Museum)
[Blog: discoverability](https://www.vam.ac.uk/blog/digital/making-the-vas-collections-more-discoverable-online), [Blog: Explore the Collections](https://www.vam.ac.uk/blog/digital/reimagining-the-vas-explore-the-collections-designing-a-more-inspiring-way-in)

- **Faz bem:** a página de entrada da coleção dá peso igual a busca, agrupamentos temáticos, histórias editoriais e objetos individuais. Vocabulários controlados ligam objetos a textos relacionados.
- **Faz mal / não serve:** pensado para quem não conhece o acervo. Você conhece o seu.
- **Adaptar:** o vocabulário controlado (lista fechada de tipos, fabricantes, ligas) é o que a validação de esquema vai garantir. Agrupamentos temáticos ficam para depois.

### National Football Museum (Manchester)
[Collections Online](https://nationalfootballmuseum.com/stories/collections-online-goes-live/), [STRIP!](https://nationalfootballmuseum.com/news/strip-exhibition-makes-debut-online/)

- **Faz bem:** página de objeto com foto, descrição e etiquetas temáticas. A exposição STRIP! organizou 200 camisas por design e contexto, não só por clube.
- **Faz mal / não serve:** não consegui confirmar se o acervo online ainda está no ar.
- **Adaptar:** etiquetas livres (tags) como complemento aos campos fixos, para agrupamentos como "Copa de 94" ou "camisa de viagem".

### "Generous interfaces" (Mitchell Whitelaw)
[Artigo na DHQ, 2015](https://dhq-static.digitalhumanities.org/pdf/000205.pdf), [Explore Australian Prints](https://printsandprintmaking.gov.au/explore/)

- **Faz bem:** é a base teórica de várias interfaces acima. Argumenta que uma caixa de busca vazia é "mesquinha": esconde o acervo até você saber o que procurar. Propõe mostrar a coleção inteira logo de cara, com resumos visuais (contagens por categoria, distribuição no tempo).
- **Faz mal / não serve:** é um princípio, não um produto.
- **Adaptar:** a tela inicial **mostra todas as camisas** e os filtros exibem **contagens** ("Brasil (12)", "Anos 90 (8)"). Busca é complemento, não porta de entrada.

---

## 3. Visualizações de coleção

### Ordenação e busca por cor
Cooper Hewitt (acima) e o [Art Palette do Google Arts & Culture](https://artsandculture.google.com/theme/kwKSLHCd3edAIg), que extrai 5 cores representativas de cada imagem e encontra obras com paleta parecida.

- **Faz bem:** cor é como colecionadores de camisa pensam ("minhas camisas verdes"). Ordenar por matiz cria um degradê bonito sem esforço de design.
- **Faz mal / não serve:** extração automática erra com fundo, sombra e listras finas. Camisas listradas ou com duas cores fortes não têm "uma" cor.
- **Adaptar:** ordenar pela cor principal (matiz, depois luminosidade). Brancas, pretas e cinzas ficam num grupo separado, senão quebram o degradê.

### Linha do tempo
[Kitbliss: Football Kit Design Timeline](https://kitbliss.co.nz/timeline-home.html), [Historical Football Kits](https://www.historicalkits.co.uk/)

- **Faz bem:** temporadas agrupadas sob títulos de década, dos anos 1920 aos 2020. Simples de ler e de construir.
- **Faz mal / não serve:** temporadas sem conteúdo aparecem como texto morto. Para uma coleção pessoal, vários anos vão ficar vazios.
- **Adaptar:** agrupar por década mostrando só as décadas com camisas. Na v1, isso já pode ser o "agrupar por década" da grade.

### Metáforas físicas (prateleira, cabide)
[Delicious Library](https://tidbits.com/?p=14258), [LibraryThing Shelf Browse](https://blog.librarything.com/thingology/2010/01/new-stuff-shelf-browse/), [Open Library Virtual Shelf](https://www.openlibrary.org/docs/virtualshelf), [virtual-bookshelf (GitHub)](https://github.com/Adityam582/virtual-bookshelf)

- **Faz bem:** Delicious Library mostrava itens em prateleiras de madeira e virou referência do estilo. O projeto do GitHub mostra que o efeito de "puxar o livro da prateleira" ao passar o mouse sai com poucas linhas de CSS. Shelf Browse mostra os vizinhos do item, o que estimula descoberta.
- **Faz mal / não serve:** a metáfora ocupa espaço e mostra menos itens por tela. No celular, rolagem horizontal compete com o gesto de voltar do navegador. Fica datada rápido se for muito literal (texturas de madeira).
- **Adaptar:** a "visão armário" da Etapa 5 como **visão alternativa**, não como tela principal. Cabides estilizados em SVG, sem textura realista. O efeito de destacar o item ao tocar.

### Comparação lado a lado
Nenhuma referência boa encontrada especificamente para camisas. Lojas e museus não oferecem. Fica como ideia própria para a Etapa 5, com a silhueta genérica permitindo comparar até camisas sem foto.

---

## 4. Aplicativos de catálogo pessoal

### Discogs (discos)
[Changelogs do app](https://www.apkmirror.com/apk/discogs/discogs-catalog-collect/discogs-3-0-17-release/)

- **Faz bem:** cadastro começa por busca num catálogo enorme ou pelo código de barras. Campos personalizados e notas por cópia. Aceita várias cópias do mesmo item. Busca dentro das notas.
- **Faz mal / não serve:** depende de um catálogo central; camisas não têm código de barras útil depois de arrancada a etiqueta.
- **Adaptar:** **notas pesquisáveis** (a busca de texto deve incluir as observações) e suporte a duas cópias da mesma camisa (por exemplo, versão jogador e torcedor) via slug distinto.

### Delicious Library (livros, filmes, jogos)
[TidBITS](https://tidbits.com/?p=14258)

- **Faz bem:** várias formas de entrada: digitar, buscar, arrastar um link, escanear. "Prateleiras inteligentes" que se preenchem por regra.
- **Faz mal / não serve:** dependia da Amazon para metadados, o que quebrou com o tempo. Lição: não depender de serviço externo para os dados.
- **Adaptar:** as "prateleiras inteligentes" são exatamente **visões filtradas salvas na URL**, que já estão no plano.

### Apps de guarda-roupa (GetWardrobe, My AI Wardrobe, Wearform)
[GetWardrobe: adicionar itens](https://help.getwardrobe.com/latest/items/add-items), [Wearform](https://www.producthunt.com/p/wearform/wearform)

- **Faz bem:** é o melhor fluxo de cadastro que encontrei. Você tira a foto, o app remove o fundo, detecta categoria e cor, e você só corrige. Se o recorte ficar ruim, um toque volta à foto original. Wearform remove o fundo no próprio aparelho e cai para a foto original quando não acha um objeto claro.
- **Faz mal / não serve:** detecção automática de categoria não sabe nada de futebol (temporada, clube, versão). Tudo fechado e em nuvem proprietária.
- **Adaptar:** **foto primeiro, dados depois**; remoção de fundo **sempre com saída para a foto original**; cor sugerida a partir da foto mas editável. Isso alimenta a decisão de pipeline de fotos da Etapa 3.

### Shirt Squad / Kit Collector / ShirtSociety
Ver seção 1. O padrão comum é: escolher a camisa num catálogo e preencher só o que é seu (tamanho, conservação, preço). Como não teremos catálogo externo, o equivalente é **um formulário com poucos campos obrigatórios** e o resto opcional.

---

## Síntese: ideias recomendadas

### Entram na primeira versão

1. **Coleção inteira à vista, com contagens nos filtros.** A tela inicial é a grade com todas as camisas; cada opção de filtro mostra quantas camisas tem ("Itália (7)"). Busca é complemento. *(Whitelaw, Cooper Hewitt)*
2. **Página da camisa como ficha de museu.** Fotos no topo, título gerado dos campos ("Palmeiras 1993 · Titular"), depois a história (observações), depois a ficha técnica, depois "relacionadas" (mesmo clube, mesma temporada, mesmo fabricante). *(Museum Wales, Football Kit Archive)*
3. **Todo atributo é um link.** Na página da camisa, clicar em "Umbro", "Série A" ou "Anos 90" abre a coleção já filtrada. Custa pouco porque os filtros já estão na URL. *(Rijksmuseum)*
4. **Cor exata + cor de paleta.** Cada camisa guarda até 3 cores em hex (usadas na silhueta) e cada uma é encaixada numa paleta fixa de 12 cores nomeadas, que é o que aparece no filtro. Ordenação por cor usa matiz, com neutros (branco, preto, cinza) num grupo à parte. *(Cooper Hewitt, Art Palette)*
5. **Ajustes no esquema de dados**, a confirmar na Etapa 3: incluir **manga** (curta/longa), **nome/número aplicado** separado de jogador, **tags livres** e **visibilidade** (pública/privada). Conservação com rótulos de colecionador traduzidos (Nova com etiqueta, Nova sem etiqueta, Excelente, Muito boa, Boa, Regular, Ruim). *(FootyCollect, Shirt Squad)*
6. **Agrupar por década** como opção da grade, mostrando só décadas que existem na coleção. Atende a "linha do tempo" básica sem tela nova. *(Kitbliss, Historical Kits)*
7. **Fluxo de cadastro "foto primeiro", poucos campos obrigatórios.** Obrigatórios: clube, temporada, tipo, cores. Resto opcional. Camisa sem foto aparece com a silhueta. *(Apps de guarda-roupa, Shirt Squad)*
8. **Busca de texto inclui as observações.** Encontrar "presente do meu pai" ou "Copa de 98" mesmo que não esteja num campo. *(Discogs)*

### Ficam para depois

9. **Visões alternativas:** degradê por cor, armário com cabides, linha do tempo dedicada, estatísticas com evolução da coleção. Todas reaproveitam os dados da v1. *(Delicious Library, LibraryThing, ShirtSociety)*
10. **Remoção de fundo automática** com fallback para a foto original. Muito útil para uniformizar, mas o peso da dependência e onde ela roda precisam ser avaliados na Etapa 3.4. *(GetWardrobe, Wearform)*

### O que deliberadamente não vamos copiar

- Recursos sociais (votos, seguidores, mensagens), que pressupõem backend e comunidade.
- Importar dados ou imagens de catálogos externos (Football Kit Archive, FKApi): esbarra na restrição de imagens próprias e cria dependência de serviço de terceiros.
- Preço e gasto total no site público (ShirtSociety, Shirt Squad). Se você quiser esses dados, eles ficam fora do build público; proposta na Etapa 3.

---

## Segunda rodada: referências brasileiras e menos óbvias

Feita depois do Checkpoint 2, quando você escolheu a arara mas achou a proposta genérica. Desta vez, em vez de catálogos e museus estrangeiros, a busca foi por cultura visual brasileira e por interfaces de moda com interação física. Também incorpora o perfil real da coleção: quase toda brasileira, quase toda da última década, com o São Paulo FC como núcleo.

### Abridores de letras de Pernambuco
[Revista Pesquisa FAPESP](https://revistapesquisa.fapesp.br/abridores-de-letras-inserem-sotaque-proprio-no-espaco-publico/), [tese de Fátima Finizola (UFPE)](https://repositorio.ufpe.br/handle/123456789/17371)

- **O que é:** pesquisa iniciada em 2007 sobre os pintores de letreiros à mão em seis cidades de Pernambuco. Rendeu livro (Blucher, 2013), exposição no Sesc e fontes digitais baseadas nessas letras.
- **Faz bem:** é uma linguagem gráfica brasileira, popular e reconhecível. Placas de comércio pintadas à mão são exatamente o tipo de sinalização que fica em cima de uma arara numa loja de bairro.
- **Não serve:** copiar o estilo de um pintor específico seria apropriação. Letras muito ornamentadas competem com as camisas.
- **Adaptar:** **o nome de cada região escrito numa placa pintada**, com fonte de pôster brasileira, leve inclinação e borda irregular. É o único elemento "decorado" da tela.

### Letras de barco do Pará (Letras que Flutuam)
[O Liberal](https://www.oliberal.com/cultura/letras-de-barcos-e-oficio-dos-abridores-de-letras-sao-reconhecidos-como-patrimonio-imaterial-1.1140110), [Brasil de Fato](https://www.brasildefato.com.br/2024/10/15/belem-tem-primeiro-espaco-de-promocao-e-preservacao-da-tipografia-de-barcos-da-amazonia), [Tipo Aquilo #45](https://tipoaquilo.substack.com/p/tipo-aquilo-45-letras-que-flutuam)

- **O que é:** letras pintadas em embarcações, tradição de cerca de 100 anos reconhecida como patrimônio imaterial do Pará. Belém tem um instituto dedicado a ela.
- **Faz bem:** mostra que cada região tem sua própria cultura de letreiro.
- **Não serve:** dar a cada região um estilo de letra "típico" corre o risco de virar caricatura, e é trabalho de design para cada uma.
- **Adaptar:** fica como ideia para depois: placas regionais com tratamentos diferentes, se um dia fizer sentido. Na v1, uma placa só para todas.

### Fontes brasileiras gratuitas: Londrina e Coiny
[Marcelo Magalhães na Adobe Fonts](https://fonts.adobe.com/designers/marcelo-magalhaes), [Coiny (OFL)](https://www.serbyte.net/fonts/coiny)

- **O que é:** famílias do designer paulistano Marcelo Magalhães, publicadas no Google Fonts com licença aberta. Londrina (2012) foi feita para pôsteres e tem versões sólida, contorno, sombra e rascunho.
- **Faz bem:** Londrina Solid tem cara de letra pintada sem imitar ninguém, é gratuita e tem acentos.
- **Não serve:** Coiny é arredondada e infantil demais para o tom.
- **Adaptar:** **Londrina Solid nas placas e no título**; texto corrido continua numa sans legível (Archivo).

### Shopping Varal (São Luís)
[O Imparcial](https://oimparcial.com.br/colunas/antonio-nelson-faria-jornalista/adeus-shopping-varal/)

- **O que é:** ponto de venda de rua onde ambulantes penduravam camisas de clubes locais, nacionais e da Seleção em varais, numa rotatória da cidade. Foi removido por uma obra viária.
- **Faz bem:** é a vitrine popular brasileira de camisa de futebol: pendurada, à vista, agrupada pela origem do time. Confirma que a arara é a metáfora certa para o seu caso.
- **Adaptar:** **camisas sempre penduradas, agrupadas por região**, e a **etiqueta de papel presa ao cabide** como o lugar onde vão clube e temporada.

### Exposição "Mantos Campeões" (Alambrado Futebol e Cultura)
[Lance](https://www.lance.com.br/fora-de-campo/exposicao-reune-camisas-historicas-da-selecao-brasileira-em-sao-paulo.html), [Jornal do Brás](https://jornaldobras.com.br/noticia/131357/ferias-em-sao-paulo-exposicao-mantos-campeoes-que-reune-camisas-originais-do-futebol-mundial-se-encerra-neste-final-de-semana)

- **O que é:** exposição de 2026 em São Paulo, com curadoria do maior colecionador de camisas do mundo (mais de 7 mil peças). Mostrou poucas camisas, escolhidas pela história de cada uma.
- **Faz bem:** curadoria vence quantidade; cada peça tem um porquê.
- **Adaptar:** **o destaque para o time do coração** é a sua "exposição permanente": arara própria, camisas maiores, mais espaço.

### Camisa de futebol como objeto de memória
[TCC de Mateus Alcoforado (UFPE)](https://repositorio.ufpe.br/jspui/bitstream/123456789/65935/1/TCC%20Mateus%20Alcoforado%20de%20Melo.pdf)

- **O que é:** monografia que entrevista colecionadores de Pernambuco e trata a camisa como memória pessoal e coletiva.
- **Adaptar:** reforça a ficha com a **história antes dos dados**, já aprovada na síntese.

### Memorial de Conquistas do São Paulo FC
[Gazeta Esportiva](https://www.gazetaesportiva.com/?p=3425407)

- **O que é:** espaço no Morumbi com troféus, camisas históricas, faixas e medalhas, reaberto depois de ficar fechado desde 2019.
- **Adaptar:** a arara do São Paulo FC funciona como um memorial pessoal: fundo próprio e as três cores do clube numa faixa fina (só as cores, sem escudo).

### Cartograma hexagonal do Brasil
[InfoDesign, 2018](https://infodesign.emnuvens.com.br/infodesign/article/download/563/360/1800)

- **O que é:** artigo brasileiro que representa os estados como células iguais, mantendo a posição aproximada, para comparar valores sem que o tamanho do Amazonas domine o mapa.
- **Faz bem:** resume a coleção pelo território de um jeito compacto, e é desenho nosso, sem imagem de terceiros.
- **Adaptar:** **um mapa de quadradinhos das 27 UFs** no topo, cada quadrado mais forte conforme o número de camisas daquele estado. Tocar num estado leva à arara da região.

### Virtual Fashion Archive (Museum at FIT) e lookbook da Stylepit
[Virtual Fashion Archive](https://ctrl.yuco.com/project/visual-fashion-archive/), [Stylepit no D&AD](https://www.dandad.org/work/d-ad-awards-archive/stylepit)

- **O que é:** o primeiro deixa girar e animar roupas de acervo em 3D; o segundo faz a roupa se mover conforme a rolagem da página.
- **Não serve:** 3D exige modelar cada camisa, inviável com fotos de celular.
- **Adaptar:** **física leve sem 3D**: as camisas balançam no cabide quando a arara é rolada e param sozinhas. Desligado para quem pede menos movimento no sistema.

### Síntese da segunda rodada

Entram no protótipo revisado:

1. Araras por **região do Brasil**, mais uma arara de **"gringas"** para as camisas estrangeiras.
2. **Arara do coração** para o São Paulo FC, dentro do Sudeste, em destaque.
3. **Placas pintadas** com Londrina Solid para os nomes das regiões.
4. **Etiqueta de papel** pendurada no cabide com clube, temporada e UF.
5. **Cabides vazios** com etiqueta "procura-se" para a lista de desejos, dentro da arara da região (herda a ideia da figurinha faltante).
6. **Mapa de quadradinhos** das UFs como resumo e atalho.
7. **Balanço** das camisas ao rolar a arara.
8. Ficha técnica como **etiqueta costurada** de roupa.

Ficam para depois: placas com letreiro diferente por região; mapa com cidades.
