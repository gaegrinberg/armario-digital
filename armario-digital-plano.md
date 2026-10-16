# Armário Digital: plano de projeto

Você vai construir comigo um site pessoal para catalogar minha coleção de camisas de futebol. O site será estático, hospedado no GitHub Pages, e deve permitir navegar pela coleção por clube, país, tipo de camisa, temporada e outros atributos. As imagens serão fotos que eu mesmo vou tirar das minhas camisas.

Trabalhe em etapas. Ao final de cada etapa marcada com **[CHECKPOINT]**, pare, me apresente o resultado e espere minha aprovação antes de seguir. Não pule etapas e não comece a implementação antes de eu aprovar a direção de design.

O site e toda a interface devem estar em português.

---

## Restrições que valem para o projeto inteiro

1. **Hospedagem estática.** GitHub Pages não executa backend. Qualquer funcionalidade que dependa de servidor precisa de uma solução compatível com site estático, e você deve explicar a troca envolvida antes de adotá-la.
2. **Repositório provavelmente público.** Tudo o que estiver no repositório e no site pode ser visto por qualquer pessoa. Não inclua no site público campos como preço pago ou valor estimado sem me perguntar. Se fizer sentido ter campos privados, proponha uma forma de mantê-los fora do build público.
3. **Imagens próprias apenas.** Não use fotos oficiais de lojas, escudos baixados da internet ou imagens de terceiros. As únicas imagens são minhas fotos e elementos gráficos criados por nós (como a silhueta genérica descrita abaixo).
4. **Tamanho do repositório.** Fotos originais de celular são pesadas. Defina um pipeline que gere versões otimizadas (WebP ou AVIF, mais miniaturas) e mantenha os originais fora do repositório. Estabeleça uma meta de tamanho por imagem e justifique.
5. **Manutenção de qualquer lugar.** Preciso conseguir adicionar uma camisa nova sem depender do meu computador principal, idealmente pelo celular. Avalie as opções na Etapa 3.
6. **Simplicidade antes de recurso.** Prefira poucas dependências e uma estrutura que eu consiga entender e editar. Se uma funcionalidade aumentar muito a complexidade, sinalize e proponha deixá-la para depois.

---

## Etapa 1: pesquisa de referências

Objetivo: entender o que já existe antes de desenhar qualquer coisa.

Pesquise na web e organize em `docs/referencias.md`:

1. **Catálogos de camisas de futebol.** Arquivos de uniformes históricos, lojas de camisas retrô, sites e perfis de colecionadores. Observe como organizam os dados, que filtros oferecem e como apresentam as fotos.
2. **Acervos digitais de museus e coleções.** Sites de coleções de museus de design, moda e esporte costumam ter boas soluções para navegar por muitos objetos (busca por cor, por período, visualizações em grade, páginas de objeto detalhadas).
3. **Visualizações de coleção.** Formas não convencionais de navegar por um conjunto de itens: ordenação e agrupamento por cor, linha do tempo, mapa, metáforas físicas (cabides, prateleiras, gavetas), comparação lado a lado.
4. **Aplicativos de catálogo pessoal.** Apps para catalogar discos, livros, tênis ou guarda-roupa. Observe principalmente o fluxo de cadastro de um item novo.

Para cada referência, registre: link, o que ela faz bem, o que faz mal ou não serve para o meu caso, e o que vale adaptar. Feche o documento com uma síntese de 5 a 10 ideias concretas que você recomendaria para o projeto, separando as que entram na primeira versão das que ficam para depois.

**[CHECKPOINT 1]** Me apresente a síntese.

---

## Etapa 2: direção de design

Com base na pesquisa, proponha **três direções visuais diferentes** em `docs/design.md`. Cada uma deve ter:

1. Um conceito em uma ou duas frases (por exemplo: vitrine de museu, vestiário, álbum de figurinhas, catálogo editorial).
2. Paleta de cores, tipografia (fontes gratuitas, como Google Fonts) e tratamento de imagem.
3. Como a tela principal da coleção se organiza.
4. Pontos positivos e negativos da direção, incluindo dificuldade de implementação e como ela se comporta no celular.

Depois de escrever o documento, construa um protótipo HTML simples de cada direção (uma página estática por direção, com 6 a 8 camisas fictícias usando a silhueta genérica) para eu comparar visualmente.

Requisitos para qualquer direção:

- Funciona bem no celular, que é onde vou olhar a coleção com mais frequência.
- Modo claro e escuro.
- As fotos são o centro da interface; o design não deve competir com elas.
- Contraste e tamanhos de texto acessíveis.

**[CHECKPOINT 2]** Eu escolho uma direção ou peço uma combinação.

---

## Etapa 3: modelo de dados e arquitetura

### 3.1 Modelo de dados

Proponha o esquema de uma camisa. Ponto de partida, que você pode ajustar e justificar:

| Campo | Observação |
|---|---|
| id / slug | identificador estável, usado na URL |
| clube ou seleção | |
| tipo de equipe | clube ou seleção |
| país | do clube ou da seleção |
| liga ou confederação | |
| temporada | ex.: 2014/15 ou 2014 |
| tipo de camisa | titular, reserva, terceira, goleiro, treino, comemorativa, pré-jogo |
| versão | jogador ou torcedor |
| fabricante | |
| patrocinador principal | |
| tamanho | |
| nome e número | opcional |
| patches | opcional, lista |
| autografada | sim ou não |
| estado de conservação | escala definida por nós |
| como conseguiu | presente, compra, troca, viagem etc. |
| data de aquisição | opcional |
| cores principais | usadas para filtros e para a silhueta genérica |
| fotos | frente, costas e detalhes opcionais |
| observações | texto livre, história da camisa |
| status | na coleção ou lista de desejos |

Os dados devem ter validação de esquema, para que um erro de digitação (como um tipo de camisa inexistente) quebre o build com uma mensagem clara em vez de aparecer errado no site.

Avalie se as cores principais devem ser preenchidas por mim ou extraídas automaticamente das fotos, e apresente os prós e contras.

### 3.2 Stack

Recomende uma stack e justifique em comparação com pelo menos duas alternativas. Considere geradores de site estático com suporte a coleções de conteúdo tipadas e otimização de imagem no build (Astro é um candidato que vale avaliar), e o deploy automático via GitHub Actions.

### 3.3 Fluxo de cadastro

Esta é a decisão que mais afeta o uso no dia a dia. Compare pelo menos estas opções:

1. Editar um arquivo de dados (JSON, YAML ou Markdown com frontmatter) diretamente no GitHub, inclusive pelo navegador do celular.
2. Um CMS baseado em Git que oferece formulário e faz commit no repositório (pesquise as opções atuais compatíveis com GitHub Pages e o que cada uma exige de autenticação).
3. Um script local que recebe as fotos e um pequeno formulário no terminal e gera a entrada pronta.

Para cada uma: esforço de configuração, como fica o upload de fotos, se funciona pelo celular e o que pode dar errado. Recomende uma, ou uma combinação.

### 3.4 Pipeline de fotos

Defina:

- Formato e dimensões das versões geradas (miniatura, tamanho de página).
- Onde ficam os originais.
- Se vale aplicar remoção de fundo automática para uniformizar as fotos, com os prós e contras (qualidade do recorte, peso da dependência, se roda localmente ou no build).
- Um guia curto de como eu devo fotografar para o resultado ficar consistente (fundo, luz, enquadramento, ângulos).

### 3.5 Silhueta genérica

Para camisas ainda sem foto, o site exibe uma silhueta SVG de camisa preenchida com as cores principais do registro. Ela deve ser genérica: sem escudos, logos ou desenhos que imitem uma camisa real específica.

**[CHECKPOINT 3]** Me apresente o esquema, a stack, a recomendação de fluxo de cadastro e o pipeline de fotos.

---

## Etapa 4: primeira versão

Implemente o mínimo útil:

1. **Coleção.** Grade de camisas com miniatura, clube, temporada e tipo.
2. **Filtros e busca.** Por clube, país, liga, tipo de camisa, versão, fabricante, década e cor. Busca por texto. Filtros refletidos na URL, para eu poder compartilhar uma visão filtrada.
3. **Ordenação.** Por data de aquisição, temporada, clube e cor.
4. **Página da camisa.** Fotos com alternância entre frente e costas, zoom nos detalhes, todos os campos e as observações.
5. **Lista de desejos.** Separada da coleção, com a mesma estrutura.
6. **Dez camisas de exemplo** com dados fictícios e silhuetas, que eu vou substituir pelas reais.
7. **Deploy** funcionando no GitHub Pages via GitHub Actions.
8. **README** explicando como adicionar uma camisa, como processar fotos e como rodar o projeto localmente.

Antes de considerar a etapa concluída, verifique: build sem erros, site funcionando no celular (teste em viewport estreita), modo escuro, tempo de carregamento da página inicial com 50 camisas fictícias e links de filtro funcionando ao abrir em nova aba.

**[CHECKPOINT 4]** Me envie o link do site publicado e uma lista do que foi feito e do que ficou pendente.

---

## Etapa 5: visualizações e recursos adicionais

Depois que a primeira versão estiver em uso, vamos priorizar juntos entre estas ideias (e as que surgirem na pesquisa):

- **Mapa** com os países e clubes representados.
- **Linha do tempo** por temporada.
- **Visão por cor**, organizando a coleção como um degradê.
- **Visão armário**, com as camisas penduradas em cabides e rolagem horizontal.
- **Estatísticas**: camisas por país, fabricante, década, tipo; evolução da coleção ao longo do tempo.
- **Comparação lado a lado** de duas camisas, por exemplo o mesmo clube em temporadas diferentes.
- **Camisa aleatória** ou camisa do dia.
- **Histórias**: camisas com observações longas ganham destaque.

Para cada uma, estime esforço e diga o que ela acrescenta de fato. Não implemente nenhuma sem eu escolher.

---

## Como trabalhar comigo

- Seja direto. Quando uma ideia minha tiver problema, diga qual é e proponha uma alternativa.
- Explique decisões técnicas em poucas linhas; não preciso de tutorial, mas preciso entender o motivo.
- Faça commits pequenos e com mensagens claras.
- Se encontrar uma decisão que não está coberta aqui e que seja difícil de desfazer, pergunte antes.

Comece pela Etapa 1.
