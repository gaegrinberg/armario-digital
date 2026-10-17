"""Remove o fundo das fotos de frente e verso das camisas.

Para cada foto citada em `fotos.frente` ou `fotos.verso` de um index.md que ainda
não tem recorte, cria `<nome>.recorte.webp` ao lado dela: fundo transparente,
sem o cabide e com a exposição ajustada. Um recorte que já existe nunca é refeito,
então dá para trocar um recorte ruim por um feito à mão.

Uso:
    python scripts/recortar.py            recorta o que falta em src/content/camisas
    python scripts/recortar.py --listar   só imprime quantas fotos faltam (n=3)
    python scripts/recortar.py PASTA...   recorta só nessas pastas de camisa

Detalhes em docs/arquitetura.md, seção 3.4.
"""

import re
import sys
import time
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
CAMISAS = RAIZ / "src" / "content" / "camisas"

MODELO = "birefnet-general-lite"
LADO_MAIOR = 1500       # px: o modelo trabalha bem nesse tamanho e o zoom do site usa ~1300
ABERTURA = 31           # px: remove o arame do cabide (mais fino que isso) no terço de cima
CORTE_CONTRASTE = 0.5   # % de pixels da camisa ignorados em cada ponta no ajuste de exposição
QUALIDADE = 88


def fotos_pendentes(pastas):
    """Fotos de frente e verso que ainda não têm recorte."""
    pendentes = []
    for pasta in pastas:
        indice = pasta / "index.md"
        if not indice.exists():
            continue
        cabecalho = indice.read_text(encoding="utf-8").split("---")[1]
        for nome in re.findall(r"^\s+(?:frente|verso):\s*['\"]?([^'\"\s]+)", cabecalho, re.M):
            foto = pasta / nome.removeprefix("./")
            recorte = foto.with_name(foto.stem + ".recorte.webp")
            if foto.exists() and not recorte.exists():
                pendentes.append(foto)
    return pendentes


def deslizar(mascara, raio, funcao):
    """Mínimo (erosão) ou máximo (dilatação) numa janela quadrada, separável em linhas e colunas."""
    import numpy as np

    saida = mascara
    for eixo in (0, 1):
        borda = [(0, 0), (0, 0)]
        borda[eixo] = (raio, raio)
        com_borda = np.pad(saida, borda, constant_values=False)
        n = saida.shape[eixo]
        pilha = [np.take(com_borda, np.arange(d, d + n), axis=eixo) for d in range(2 * raio + 1)]
        saida = funcao.reduce(pilha)
    return saida


def tirar_cabide(alfa):
    """Tira o arame e o gancho do cabide, que ficam no terço de cima da foto."""
    import numpy as np

    altura = alfa.shape[0]
    terco = altura // 3
    topo = alfa[:terco] > 127
    raio = ABERTURA // 2
    # Abertura: o que for mais fino que a janela some; o resto volta ao tamanho original
    aberto = deslizar(deslizar(topo, raio, np.logical_and), raio, np.logical_or)
    # Mantém a borda suave original onde a camisa continua existindo
    manter = deslizar(aberto, 4, np.logical_or)
    alfa[:terco][~manter] = 0

    # Sobrou um pedaço do gancho solto acima da camisa? Corta tudo acima da primeira faixa vazia.
    linhas = (alfa[:terco] > 127).sum(axis=1) > 0
    cheias = np.flatnonzero(linhas)
    if cheias.size:
        vazias = np.flatnonzero(~linhas[cheias[0]:])
        if vazias.size:
            fim = cheias[0] + vazias[0]
            if linhas[fim:].any():
                alfa[:fim] = 0
    return alfa


def ajustar_exposicao(rgb, alfa):
    """Estica o contraste usando só os pixels da camisa, para o branco voltar a ser branco."""
    import numpy as np

    camisa = rgb[alfa > 127]
    if camisa.size == 0:
        return rgb
    baixo, alto = np.percentile(camisa, [CORTE_CONTRASTE, 100 - CORTE_CONTRASTE])
    if alto - baixo < 10:
        return rgb
    esticado = (rgb.astype(np.float32) - baixo) * (255.0 / (alto - baixo))
    return np.clip(esticado, 0, 255).astype(np.uint8)


def recortar(foto, sessao):
    import numpy as np
    from PIL import Image, ImageOps
    from rembg import remove

    imagem = ImageOps.exif_transpose(Image.open(foto)).convert("RGB")
    imagem.thumbnail((LADO_MAIOR, LADO_MAIOR), Image.LANCZOS)
    mascara = remove(imagem, session=sessao, only_mask=True)

    alfa = tirar_cabide(np.array(mascara, dtype=np.uint8))
    rgb = ajustar_exposicao(np.array(imagem), alfa)

    linhas = np.flatnonzero((alfa > 8).any(axis=1))
    colunas = np.flatnonzero((alfa > 8).any(axis=0))
    if not linhas.size:
        raise RuntimeError("nenhuma camisa encontrada na foto")
    margem = 8
    y0, y1 = max(linhas[0] - margem, 0), min(linhas[-1] + margem + 1, alfa.shape[0])
    x0, x1 = max(colunas[0] - margem, 0), min(colunas[-1] + margem + 1, alfa.shape[1])

    saida = Image.fromarray(np.dstack([rgb, alfa])[y0:y1, x0:x1], "RGBA")
    destino = foto.with_name(foto.stem + ".recorte.webp")
    saida.save(destino, "WEBP", quality=QUALIDADE, method=6)
    return destino


def main(argumentos):
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
    listar = "--listar" in argumentos
    pastas = [Path(a).resolve() for a in argumentos if not a.startswith("--")]
    if not pastas:
        pastas = sorted(p for p in CAMISAS.iterdir() if p.is_dir())
    pendentes = fotos_pendentes(pastas)

    if listar:
        print(f"n={len(pendentes)}")
        return 0
    if not pendentes:
        print("Nenhuma foto sem recorte.")
        return 0

    from rembg import new_session

    sessao = new_session(MODELO)
    erros = 0
    for i, foto in enumerate(pendentes, 1):
        inicio = time.time()
        nome = foto.relative_to(RAIZ).as_posix()
        try:
            destino = recortar(foto, sessao)
            kb = destino.stat().st_size // 1024
            print(f"[{i}/{len(pendentes)}] {nome} → {destino.name} ({kb} KB, {time.time() - inicio:.0f} s)")
        except Exception as erro:  # uma foto ruim não pode travar as outras
            erros += 1
            print(f"[{i}/{len(pendentes)}] {nome}: ERRO {erro}", file=sys.stderr)
    return 1 if erros else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
