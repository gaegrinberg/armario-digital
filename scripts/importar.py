"""Cadastra várias camisas de uma vez a partir das fotos originais.

Lê uma lista em JSON (veja scripts/importacao-inicial.json), converte as fotos de
frente e verso como o CMS faz (WebP, até 2000 px, qualidade 85) e cria a pasta de
cada camisa com o index.md. Depois, rode scripts/recortar.py para tirar o fundo.

Uso:
    python scripts/importar.py LISTA.json [--fotos PASTA]

PASTA é onde estão as fotos originais (padrão: Camisas/). Cada item da lista tem
os campos do esquema (clube, temporada, tipo, cores…), os nomes das fotos em
"frente" e "verso" (sem extensão) e, se quiser, a "historia". Uma camisa que já
tem pasta não é sobrescrita.
"""

import json
import re
import sys
from pathlib import Path

from PIL import Image, ImageOps

RAIZ = Path(__file__).resolve().parent.parent
CAMISAS = RAIZ / "src" / "content" / "camisas"
LADO_MAIOR = 2000
QUALIDADE = 85

# Ordem dos campos no index.md, a mesma do formulário do CMS
CAMPOS = [
    "clube", "temporada", "tipo", "status", "cores", "padrao", "fabricante", "patrocinador",
    "versao", "manga", "tamanho", "nomeNumero", "patches", "autografada", "retro", "esporte",
    "conservacao", "origem", "aquisicao", "tags",
]


def slug(item):
    texto = f"{item['clube']}-{item['temporada']}-{item['tipo']}"
    return re.sub(r"[^a-z0-9]+", "-", texto.lower()).strip("-")


def valor_yaml(v):
    if isinstance(v, bool):
        return "true" if v else "false"
    if isinstance(v, list):
        return "[" + ", ".join(valor_yaml(x) for x in v) + "]"
    return json.dumps(str(v), ensure_ascii=False)


def converter(original, destino):
    imagem = ImageOps.exif_transpose(Image.open(original)).convert("RGB")
    imagem.thumbnail((LADO_MAIOR, LADO_MAIOR), Image.LANCZOS)
    imagem.save(destino, "WEBP", quality=QUALIDADE, method=6)


def main(argumentos):
    sys.stdout.reconfigure(encoding="utf-8")
    if not argumentos:
        print(__doc__)
        return 1
    lista = json.loads(Path(argumentos[0]).read_text(encoding="utf-8"))
    fotos = Path(argumentos[argumentos.index("--fotos") + 1]) if "--fotos" in argumentos else RAIZ / "Camisas"

    for item in lista:
        pasta = CAMISAS / slug(item)
        if pasta.exists():
            print(f"{pasta.name}: já existe, pulei")
            continue
        pasta.mkdir(parents=True)
        cabecalho = [f"{campo}: {valor_yaml(item[campo])}" for campo in CAMPOS if campo in item]
        lados = [lado for lado in ("frente", "verso") if item.get(lado)]
        if lados:
            cabecalho.append("fotos:")
            for lado in lados:
                converter(fotos / f"{item[lado]}.jpg", pasta / f"{lado}.webp")
                cabecalho.append(f"  {lado}: {lado}.webp")
        texto = "---\n" + "\n".join(cabecalho) + "\n---\n"
        if item.get("historia"):
            texto += item["historia"] + "\n"
        (pasta / "index.md").write_text(texto, encoding="utf-8", newline="\n")
        print(f"{pasta.name}: {', '.join(lados) or 'sem fotos'}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
