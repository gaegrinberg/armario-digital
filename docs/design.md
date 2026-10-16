# Armário Digital: direções de design

Etapa 2 do plano. Três direções, cada uma com um protótipo estático em `prototipos/`. Abra `prototipos/index.html` no navegador para comparar.

Os protótipos usam 8 camisas fictícias (clubes, marcas e histórias inventados) desenhadas com a silhueta genérica. Tocar numa camisa abre a ficha dela, para dar uma ideia também da página da camisa. Cada protótipo tem um botão de tema (automático, claro, escuro).

## O que vale para as três

- **Foto em proporção 4:5**, sempre inteira (sem corte), centralizada num fundo neutro chamado aqui de "placa". A placa tem a mesma cor em todas as camisas, o que uniformiza fotos tiradas em lugares diferentes.
- **Silhueta genérica** no lugar da foto quando não houver foto: corpo na cor 1, mangas e gola na cor 2, e um padrão opcional (liso, listras verticais, listras horizontais, faixa diagonal, metade). Camisa branca recebe contorno fino para não sumir na placa.
- **Cor só nas camisas.** A interface usa tons neutros e um único acento, usado em links e no filtro ativo.
- **Texto:** corpo com no mínimo 16 px, contraste AA (4,5:1) ou melhor em claro e escuro, áreas de toque de pelo menos 44 px.
- **Celular primeiro:** 2 colunas na grade a partir de 320 px de largura; filtros em uma linha rolável de chips; ficha da camisa abre como painel de baixo para cima.

Proposta para o esquema (Etapa 3): incluir o campo **padrão** da camisa (liso, listras verticais etc.). Ele é genérico, ajuda a silhueta a ficar reconhecível e ainda serve de filtro.

---

## A. Vitrine de museu

**Conceito.** A coleção como acervo de museu: cada camisa é um objeto com número de inventário, etiqueta discreta e uma história. Silêncio visual para a foto aparecer.

**Paleta**

| Papel | Claro | Escuro |
|---|---|---|
| Fundo | `#F6F4EF` papel | `#141312` |
| Placa da foto | `#E9E5DD` | `#211F1D` |
| Texto | `#1D1B18` | `#EDE9E2` |
| Texto secundário | `#5C564E` | `#A9A296` |
| Acento | `#8A2D1C` terracota | `#E89A82` |

**Tipografia.** Títulos em **Source Serif 4**, textos e etiquetas em **Inter**. Números de inventário em algarismos tabulares ("Nº 007").

**Tratamento de imagem.** Placa plana sem borda nem sombra. Muito espaço em branco entre os itens.

**Tela principal.** Cabeçalho com nome e contagem ("48 camisas · 14 países"). Busca e chips de filtro com contagem. Grade de 2 colunas no celular, até 5 no computador. Sob cada foto, uma etiqueta de museu: número, clube, temporada · tipo.

**Positivos**
- É a direção que menos compete com as fotos e envelhece melhor.
- É a mais simples de implementar: grade CSS e tipografia.
- Funciona igual com foto com fundo, foto recortada ou silhueta.
- A ficha de museu (história antes da ficha técnica) encaixa naturalmente.

**Negativos**
- Pode parecer fria ou genérica, sem nada que lembre futebol.
- O serifado nos títulos precisa de tamanho; em telas pequenas os nomes longos de clube quebram em duas linhas.

**Dificuldade:** baixa. **Celular:** muito bom.

---

## B. Álbum de figurinhas

**Conceito.** A coleção como álbum: cada camisa é uma figurinha numerada colada na página do seu país. A lista de desejos aparece como figurinha faltando, um espaço tracejado esperando ser preenchido.

**Paleta**

| Papel | Claro | Escuro |
|---|---|---|
| Fundo (página do álbum) | `#FBF6EA` creme | `#11161B` |
| Figurinha | `#FFFFFF` | `#1B2229` |
| Placa da foto | `#EFEADF` | `#252D35` |
| Texto | `#1A1F24` | `#ECEFF2` |
| Texto secundário | `#55606B` | `#A3AEB9` |
| Acento | `#0B6E4F` verde gramado | `#5FD3A6` |

**Tipografia.** **Barlow Condensed** (negrito) para números, clubes e títulos de página; **Barlow** para o resto. A tipografia condensada lembra a de figurinhas e placares sem copiar nenhum álbum real.

**Tratamento de imagem.** Figurinha branca com cantos levemente arredondados, borda fina e número no canto. Uma faixa fina com as cores da camisa no pé da figurinha.

**Tela principal.** Agrupada em "páginas" por década, país ou tipo (seletor "páginas por"). O protótipo abre por década porque, com 8 camisas em 8 países, a página por país fica com uma figurinha cada. Título de página com contagem ("Itália · 3 de 4", contando as faltantes da lista de desejos). Grade de 2 colunas no celular.

**Positivos**
- A mais divertida e a que mais tem cara de futebol.
- A metáfora da figurinha faltante resolve a lista de desejos de um jeito próprio, sem tela separada.
- O agrupamento por página dá o "resumo visual" da pesquisa (quantas por país) sem gráficos.

**Negativos**
- A moldura da figurinha (borda, número, faixa) disputa atenção com a foto. Exige disciplina para ficar sutil.
- Agrupamento fixo por país fica estranho quando o usuário aplica um filtro que esvazia quase todas as páginas.
- Corre o risco de lembrar demais um álbum comercial específico; o protótipo evita isso, mas é um cuidado constante.

**Dificuldade:** média (agrupamento, contagens com lista de desejos). **Celular:** bom.

---

## C. Arara de vestiário

**Conceito.** A coleção pendurada: cada década (ou país, ou tipo) é uma arara com as camisas em cabides, rolando para o lado como num vestiário ou numa loja.

**Paleta**

| Papel | Claro | Escuro |
|---|---|---|
| Fundo | `#ECEEF1` concreto claro | `#0E1013` |
| Superfície | `#FFFFFF` | `#181C21` |
| Barra e cabide | `#8E959E` | `#5C646E` |
| Texto | `#14171B` | `#E9ECEF` |
| Texto secundário | `#535B65` | `#A1A9B3` |
| Acento | `#1D5BC4` azul | `#7FA8F0` |

**Tipografia.** **Archivo** em duas larguras: estreita (Archivo Narrow) para títulos e nomes de clube, normal para o resto. Aspecto de etiqueta técnica e sinalização de vestiário.

**Tratamento de imagem.** Camisa "pendurada": um cabide em SVG simples acima de cada item e uma barra horizontal atravessando a linha. Sem placa: a foto fica direto sobre o fundo. Por isso **pede foto com fundo removido**; com fundo, o retângulo da foto pendurado no cabide fica estranho.

**Tela principal.** Uma arara por grupo ("Anos 2020", "Anos 2010"...), cada uma rolando na horizontal com encaixe (scroll-snap). Seletor "agrupar por: década, país, tipo". Abaixo do cabide, só clube e temporada.

**Positivos**
- É a visão mais memorável e a que mais parece uma coleção física.
- A rolagem horizontal por linha é um gesto natural no celular (como carrosséis de apps de streaming).
- Mostra a coleção agrupada sem precisar de filtros.

**Negativos**
- Mostra menos camisas por tela e dificulta "ver tudo de uma vez", que foi a ideia 1 da síntese.
- Depende da remoção de fundo (ideia 10, deixada para depois). Sem ela o visual perde boa parte da graça.
- Rolagem horizontal é pouco descobrível no computador e tem problemas de acessibilidade (precisa de botões de avançar para teclado).
- Com filtros aplicados, araras quase vazias ficam desajeitadas.

**Dificuldade:** média para alta. **Celular:** bom para passear, pior para buscar.

---

## Verificação dos protótipos

- Testados em 375 px de largura e no computador, em claro e escuro. Nenhum gera rolagem horizontal da página.
- Contraste dos textos (texto secundário sobre fundo e sobre placa, texto sobre acento) entre 5,3:1 e 16:1 nas seis paletas, todos acima do mínimo AA de 4,5:1.
- Para rodar: `python -m http.server 8123 --directory prototipos` e abrir <http://localhost:8123>. Abrir o arquivo direto pelo explorador também funciona na maioria dos navegadores.

---

## Minha leitura

A **A (museu)** é a base mais segura para a tela principal, por respeitar as fotos e ser simples. A **C (arara)** brilha mais como a "visão armário" da Etapa 5 do que como tela principal. A **B (álbum)** tem a melhor ideia isolada: a lista de desejos como figurinhas faltando.

Uma combinação possível: estrutura e tipografia da A, figurinhas faltantes da B na lista de desejos, e a arara da C guardada para a Etapa 5.
