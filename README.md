# Armário Digital

Site pessoal para catalogar uma coleção de camisas de futebol, publicado em
<https://gaegrinberg.github.io/armario-digital/>.

As camisas ficam penduradas numa arara por região do Brasil, com uma arara própria para o
time do coração, outra para seleções e outra para clubes estrangeiros ("Gringas"). A grade
tem busca, filtros e ordenação, e cada camisa tem uma página com fotos, história e ficha.

O plano do projeto está em [`armario-digital-plano.md`](armario-digital-plano.md), e as
decisões de design e arquitetura em [`docs/`](docs/).

**Quer um armário para a sua coleção?** Siga o guia
[`COMO-FAZER-O-SEU.md`](COMO-FAZER-O-SEU.md). Não precisa programar.

## Adicionar uma camisa

### Pelo celular (CMS)

1. Abra <https://gaegrinberg.github.io/armario-digital/admin/>.
2. Na primeira vez, toque em **Entrar Usando Token de Acesso** e cole um token do GitHub
   (ver abaixo).
3. Se o clube ainda não existe, cadastre-o antes em **Clubes**. Clube brasileiro precisa
   do estado (UF), que define a arara da região.
4. Em **Camisas**, toque em **New** e preencha clube, temporada, tipo e cores (de 1 a 3, a
   principal primeiro). O resto é opcional.
5. Em **Fotos**, escolha ou tire as fotos de frente e verso. O CMS converte para WebP no
   próprio celular antes de enviar, inclusive fotos HEIC do iPhone.
6. Salve. O CMS faz o commit, e o GitHub Actions recorta o fundo, valida os dados e publica.
   O andamento aparece na aba **Actions** do repositório.

Para a **lista de desejos**, use o status "Lista de desejos": só clube, temporada, tipo e
cores são necessários. Quando a camisa chegar, troque o status e acrescente as fotos.

O nome da pasta da camisa (`clube-temporada-tipo`) vira a URL dela. Evite renomear depois de
publicada, para os links compartilhados continuarem funcionando.

**Token do GitHub.** Em *Settings → Developer settings → Personal access tokens →
Fine-grained tokens*, crie um token com acesso **só a este repositório**, permissão
**Contents: Read and write** e validade de 1 ano. Ele fica guardado no navegador do aparelho.
Se perder o aparelho, revogue o token na mesma tela.

### Editando o arquivo

Cada camisa é uma pasta em `src/content/camisas/`, com um `index.md` e as fotos:

```
src/content/camisas/sao-paulo-2024-titular/
  index.md
  frente.webp              ← foto enviada
  frente.recorte.webp      ← criada pelo recorte
  verso.webp
  verso.recorte.webp
```

```markdown
---
clube: sao-paulo            # nome do arquivo em src/content/clubes, sem .yml
temporada: "2024"           # "2024" ou "2024/25"
tipo: titular               # titular, reserva, terceira, goleiro, treino, pre-jogo, comemorativa, passeio
cores: [branco, vermelho, preto]
padrao: faixa-peito         # usado na silhueta quando não há foto
fabricante: adidas
fotos:
  frente: frente.webp
  verso: verso.webp
status: colecao             # ou desejo
---
A história da camisa, em texto livre.
```

Todos os campos e valores aceitos estão em [`src/content.config.ts`](src/content.config.ts) e
[`src/opcoes.ts`](src/opcoes.ts). Um valor fora da lista quebra o build com uma mensagem como:

```
camisas → goias-2020-titular data does not match collection schema.
  tipo: valor inválido "titula". Esperado: titular | reserva | terceira | goleiro | …
```

As listas fechadas (tipos, tamanhos, paleta de cores, estados) ficam só em `src/opcoes.ts`. O
formulário do CMS é gerado a partir delas, então mudar uma lista ali muda as duas coisas.

### Configurações

[`src/config.ts`](src/config.ts) define o título do site e o time do coração
(`timeDoCoracao`, o id do clube que ganha a arara em destaque).

O endereço do site e o repositório onde o CMS grava vêm da variável `GITHUB_REPOSITORY`, que
o GitHub Actions preenche com `dono/repo`: o site sai em `https://dono.github.io/repo/` (ou na
raiz, num repositório `dono.github.io`). Fora do Actions, vale `gaegrinberg/armario-digital`;
para simular outro repositório no computador, defina a variável antes do build. A conta fica
em [`astro.config.mjs`](astro.config.mjs).

Numa cópia do projeto, `scripts/comecar-do-zero.py` (ou o workflow **Começar do zero**, na
aba Actions) apaga as camisas e os clubes do Armário original. Ele se recusa a rodar neste
repositório.

## Fotos

O caminho de uma foto até o site:

1. **Original:** fica no celular ou na pasta `Camisas/`, que está fora do Git.
2. **Envio:** WebP com até 2000 px, salvo na pasta da camisa. O CMS converte sozinho.
3. **Recorte:** `scripts/recortar.py` cria `frente.recorte.webp` ao lado da foto, com fundo
   transparente, sem cabide e com a exposição corrigida. Roda no GitHub Actions a cada push
   que traga foto nova. Um recorte que já existe nunca é refeito: se um ficar ruim, troque o
   arquivo por um feito à mão e ele será mantido.
4. **Build:** o Astro gera as versões do site (miniatura de 480 px, página de 1000 px e o
   zoom no tamanho do recorte), todas em WebP.

Sem recorte, o site mostra a foto enviada numa placa. Sem foto, mostra uma silhueta genérica
nas cores da camisa.

### Cadastrar um lote pelo computador

Para muitas camisas de uma vez, monte uma lista em JSON como
[`scripts/importacao-inicial.json`](scripts/importacao-inicial.json), com os campos de cada
camisa e os nomes das fotos de frente e verso em `Camisas/`. O script converte as fotos e cria
as pastas; depois é só recortar:

```bash
.venv/Scripts/python scripts/importar.py scripts/minha-lista.json
.venv/Scripts/python scripts/recortar.py
```

### Recortar no computador

Útil para muitas fotos de uma vez, ou para conferir o resultado antes de enviar. Precisa de
Python 3.10 ou mais novo. Na primeira vez, o modelo de recorte (224 MB) é baixado.

```bash
python -m venv .venv
.venv/Scripts/python -m pip install -r scripts/requirements.txt
.venv/Scripts/python scripts/recortar.py
```

No macOS ou Linux, troque `.venv/Scripts/` por `.venv/bin/`. Para recortar só algumas
camisas, passe as pastas: `scripts/recortar.py src/content/camisas/sao-paulo-2024-titular`.
Leva cerca de 15 s por foto num computador comum.

### Como fotografar

- Mesma parede e mesmo cabide, com luz do dia indireta e sem flash.
- Celular na altura do peito da camisa, reto, com a camisa ocupando uns 70% da altura.
- Alise a camisa e as mangas. Fotografe a frente e, em seguida, o verso.

## Rodar o site no computador

Precisa do Node.js 22 ou mais novo.

```bash
npm install
npm run dev
```

O site abre em <http://localhost:4321/armario-digital/>. Para gerar a versão final, como o
GitHub Actions faz, use `npm run build` (o resultado fica em `dist/`) e `npm run preview`.

## Publicação

O workflow [`.github/workflows/site.yml`](.github/workflows/site.yml) roda a cada push na
`main`: recorta as fotos novas (e faz commit dos recortes), gera o site e publica no GitHub
Pages. Os protótipos de design continuam em `prototipos/`, fora do site.
