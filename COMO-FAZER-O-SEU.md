# Como fazer o seu Armário Digital

Este guia é para quem viu o [Armário Digital](https://gaegrinberg.github.io/armario-digital/)
e quer um igual para a própria coleção de camisas. Não precisa saber programar nem instalar
nada: tudo é feito pelo navegador, no site do GitHub. É de graça.

No fim, você terá um site como `https://SEU-USUARIO.github.io/armario-digital/` e uma página
de cadastro onde dá para incluir camisas pelo celular, com foto. O fundo das fotos é
recortado sozinho.

Leva uns 20 minutos. Onde aparecer `SEU-USUARIO`, troque pelo seu nome de usuário no GitHub.

## Antes de começar: o que fica público

O site e o repositório (a pasta com os arquivos do site) são **públicos**. Qualquer pessoa
pode ver as fotos, os textos e o histórico de mudanças, mesmo o que você apagar depois.
Não coloque preço pago, endereço, telefone ou qualquer coisa que você não mostraria a um
desconhecido. A página de cadastro também é pública, mas só quem tem a sua chave (o token
do passo 7) consegue gravar alguma coisa.

## 1. Crie uma conta no GitHub

Entre em <https://github.com/signup> e crie uma conta. O nome de usuário vai aparecer no
endereço do site, então escolha um que você goste.

## 2. Faça a sua cópia do projeto

Abra <https://github.com/gaegrinberg/armario-digital> com a sua conta já conectada.

- **Se aparecer o botão verde "Use this template"**, clique nele e escolha **Create a new
  repository**. Em *Repository name*, escreva `armario-digital` (ou outro nome, sem espaço
  nem acento: ele vira o fim do endereço do site). Deixe marcado **Public** e clique em
  **Create repository**.
- **Se não aparecer**, clique em **Fork** (no alto, à direita) e depois em **Create fork**.
  O fork traz também o histórico do Armário original, com as fotos antigas, por isso ocupa
  mais espaço. Funciona do mesmo jeito.

Agora você está no **seu** repositório: o endereço da página é
`https://github.com/SEU-USUARIO/armario-digital`. Todos os passos abaixo são nele.

## 3. Ligue o GitHub Pages

O GitHub Pages é o serviço que deixa o site no ar.

1. No seu repositório, clique em **Settings** (a engrenagem, no alto).
2. No menu da esquerda, clique em **Pages**.
3. Em *Build and deployment*, no campo **Source**, escolha **GitHub Actions**.

Não precisa salvar: a escolha vale na hora.

## 4. Libere o Actions

O GitHub Actions é o robô que recorta as fotos e publica o site a cada mudança.

Clique na aba **Actions**. Se aparecer uma mensagem pedindo para habilitar os workflows
(*"I understand my workflows, go ahead and enable them"*), clique no botão verde. Isso
acontece quando a cópia foi feita por fork. Se a aba já mostrar a lista de workflows, está
tudo certo.

Se a lista já tiver um **Site** com um X vermelho, não se preocupe: ele rodou antes de o
GitHub Pages estar ligado. A próxima publicação corrige.

## 5. Esvazie o armário

A cópia vem com as camisas do Armário original. Para apagá-las:

1. Na aba **Actions**, clique em **Começar do zero**, na lista da esquerda.
2. Clique em **Run workflow**, à direita.
3. Em *Quais clubes manter*, escolha:
   - **exemplos**: ficam só os grandes clubes brasileiros (Atlético-MG, Bahia, Botafogo,
     Cruzeiro, Flamengo, Fluminense, Grêmio, Internacional, Santos, São Paulo, Sport e
     Vasco) e a seleção brasileira. É a opção mais prática.
   - **nenhum**: você cadastra todos os clubes do zero.
   - **todos**: mantém os 31 clubes do Armário original.
4. Em *Para confirmar*, escreva `APAGAR`, em maiúsculas.
5. Clique no botão verde **Run workflow**.

Em cerca de um minuto, as camisas somem e o site é publicado pela primeira vez, ainda
vazio. Uma bolinha verde ao lado do nome do workflow quer dizer que deu certo; um X
vermelho, que algo falhou (clique nele para ver a mensagem).

<details>
<summary>Outro jeito: apagar as pastas à mão</summary>

1. Na aba **Code**, abra a pasta `src/content/camisas`.
2. Clique nos três pontinhos (**…**), no alto à direita, e em **Delete directory**. Confirme
   com **Commit changes**.
3. Se quiser, faça o mesmo com os clubes que não vai usar, dentro de `src/content/clubes`
   (um arquivo por clube: abra o arquivo, clique nos três pontinhos e em **Delete file**).

</details>

## 6. Dê o seu nome ao armário

1. Na aba **Code**, abra a pasta `src`, depois o arquivo `config.ts`.
2. Clique no lápis (**Edit this file**), no alto à direita do arquivo.
3. Troque o que está entre aspas simples:
   - `titulo`: o nome do site, que aparece no alto da página. Por exemplo,
     `'Armário do Zé'`.
   - `timeDoCoracao`: o time que ganha uma arara própria, em destaque. Use o nome do arquivo
     do clube na pasta `src/content/clubes`, sem o `.yml`: `'flamengo'`, `'gremio'`,
     `'sao-paulo'`. Se o seu time não estiver lá, cadastre-o primeiro (passo 8): o arquivo
     ganha o nome do clube em minúsculas, sem acento e com hífen no lugar do espaço
     (`Atlético Goianiense` vira `atletico-goianiense`).
   - Não mexa em mais nada. O repositório é descoberto sozinho.
4. Clique em **Commit changes** e de novo em **Commit changes** na janela que abrir.

O site é publicado de novo, sozinho. Em um ou dois minutos, abra
`https://SEU-USUARIO.github.io/armario-digital/` (troque `armario-digital` se você deu outro
nome ao repositório). O endereço exato também aparece em **Settings → Pages**.

## 7. Crie a chave do cadastro (token)

A página de cadastro precisa de uma chave para gravar as camisas no seu repositório. A
chave fica guardada só no navegador onde você a colar.

1. Clique na sua foto, no canto de cima à direita do GitHub, e em **Settings**.
2. No fim do menu da esquerda, clique em **Developer settings**.
3. Clique em **Personal access tokens** e depois em **Fine-grained tokens**.
4. Clique em **Generate new token** e preencha:
   - *Token name*: `Armário Digital`.
   - *Expiration*: escolha 1 ano (ou *Custom* com a data que preferir).
   - *Repository access*: **Only select repositories**, e escolha o seu `armario-digital`.
   - *Permissions*: clique em **Add permissions**, escolha **Contents** e mude o acesso
     para **Read and write**.
5. Clique em **Generate token** e copie o código, que começa com `github_pat_`. Ele só
   aparece uma vez. Se perder, é só gerar outro.

Não mande a chave para ninguém. Se perder o celular, apague a chave nessa mesma tela.

## 8. Cadastre as camisas

1. Abra `https://SEU-USUARIO.github.io/armario-digital/admin/`, de preferência no celular.
   Vale salvar na tela inicial.
2. Na primeira vez, toque em **Entrar Usando Token de Acesso** (*Sign In with Token*) e
   cole a chave do passo 7.
3. Se o clube ainda não existe, cadastre-o antes em **Clubes**. Clube brasileiro precisa do
   estado (UF), que decide em qual arara (região) ele fica. Seleções vão para a arara
   "Seleções" e clubes estrangeiros, para "Gringas".
4. Em **Camisas**, toque em **New** e preencha clube, temporada, tipo e cores (de 1 a 3, a
   principal primeiro). O resto é opcional e pode ficar para depois.
5. Em **Fotos**, tire ou escolha as fotos de frente e de verso.
6. Toque em **Save**.

Para a **lista de desejos**, escolha o status "Lista de desejos": a camisa aparece como um
cabide vazio com a etiqueta "procura-se". Quando ela chegar, troque o status e ponha as
fotos.

### Quanto tempo até aparecer no site

Depois de salvar, o robô recorta o fundo das fotos novas e publica o site. O andamento
aparece na aba **Actions** do repositório. As contas abaixo são estimativas:

- Cada foto leva cerca de 15 a 30 segundos para recortar. Uma camisa com frente e verso
  aparece no site em uns 3 minutos.
- Na **primeira** camisa com foto, conte uns 5 minutos a mais: o robô baixa o programa de
  recorte (224 MB), que depois fica guardado.
- Cadastrar várias camisas seguidas não atrapalha: cada publicação espera a anterior.

Sem foto, a camisa aparece como uma silhueta nas cores escolhidas.

### Dicas para fotografar

- Mesma parede e mesmo cabide em todas, com luz do dia indireta e sem flash.
- Celular reto, na altura do peito da camisa, com a camisa ocupando uns 70% da altura.
- Alise a camisa e as mangas. Fotografe a frente e, em seguida, o verso.

Se um recorte ficar ruim, apague a foto e envie de novo, ou peça ajuda a quem entende do
projeto: o arquivo `frente.recorte.webp`, na pasta da camisa, pode ser trocado por um feito
à mão.

## Dúvidas comuns

**O site não abriu.** Confira na aba **Actions** se o último workflow **Site** terminou com
a bolinha verde, e em **Settings → Pages** se a fonte é **GitHub Actions**. Se nunca rodou,
abra **Actions → Site → Run workflow**.

**A arara do coração não aparece.** O `timeDoCoracao` precisa ser exatamente o nome do
arquivo do clube, e o clube precisa ter pelo menos uma camisa.

**Errei um dado e o site parou de atualizar.** O workflow **Site** fica com um X vermelho e
a mensagem diz o arquivo e o campo com problema. Corrija pela página de cadastro e salve de
novo. Enquanto isso, o site continua mostrando a versão anterior.

**O texto do README fala do Armário original.** Pode editar ou ignorar: ele não aparece no
site.

**Quero mudar o endereço.** Em **Settings → General**, troque o nome do repositório
(*Repository name*). Depois, em **Actions → Site → Run workflow**, publique de novo para o
site passar a sair no endereço novo.
