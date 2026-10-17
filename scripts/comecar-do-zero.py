"""Esvazia o armário para começar uma coleção nova numa cópia do projeto.

Apaga todas as camisas (com as fotos e a lista de desejos) e os clubes, deixando só
alguns clubes de exemplo, todos ou nenhum. Não mexe no código nem em src/config.ts.
Não roda no repositório original, gaegrinberg/armario-digital.

Uso:
    python scripts/comecar-do-zero.py [--clubes exemplos|nenhum|todos] [--sim]

Sem --clubes, o script pergunta. Sem --sim, pede para digitar APAGAR antes de apagar.
Depois, confira com "git status" e faça o commit. Pelo site do GitHub, o mesmo script
roda na aba Actions, no workflow "Começar do zero" (ver COMO-FAZER-O-SEU.md).
"""

import argparse
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
CAMISAS = RAIZ / "src" / "content" / "camisas"
CLUBES = RAIZ / "src" / "content" / "clubes"
IMAGENS = RAIZ / "public" / "imagens"  # media_folder do CMS, se algum dia for usado
ORIGINAL = "gaegrinberg/armario-digital"

# Clubes que ficam com --clubes exemplos: os grandes brasileiros já cadastrados e a seleção
EXEMPLOS = {
    "atletico-mineiro", "bahia", "botafogo", "brasil", "cruzeiro", "flamengo", "fluminense",
    "gremio", "internacional", "santos", "sao-paulo", "sport", "vasco",
}


def repositorio():
    """O "dono/repo" deste projeto: do GitHub Actions ou do remote origin do Git."""
    if os.environ.get("GITHUB_REPOSITORY"):
        return os.environ["GITHUB_REPOSITORY"]
    try:
        url = subprocess.run(
            ["git", "remote", "get-url", "origin"], cwd=RAIZ, capture_output=True, text=True, check=True,
        ).stdout.strip()
    except (OSError, subprocess.CalledProcessError):
        return None
    achado = re.search(r"github\.com[:/]([^/]+/[^/]+?)(?:\.git)?/?$", url)
    return achado.group(1) if achado else url


def esvaziar(pasta, manter=()):
    """Apaga o conteúdo da pasta, menos os nomes em manter. Devolve quantos itens saíram."""
    if not pasta.exists():
        return 0
    n = 0
    for item in pasta.iterdir():
        if item.name == ".gitkeep" or item.stem in manter:
            continue
        shutil.rmtree(item) if item.is_dir() else item.unlink()
        n += 1
    # O Git não guarda pasta vazia; o .gitkeep mantém a pasta que o site e o CMS esperam
    if not any(pasta.iterdir()):
        (pasta / ".gitkeep").touch()
    return n


def main():
    parser = argparse.ArgumentParser(description="Apaga as camisas e os clubes para começar uma coleção nova.")
    parser.add_argument("--clubes", choices=["exemplos", "nenhum", "todos"], help="quais clubes manter")
    parser.add_argument("--sim", action="store_true", help="não pedir confirmação")
    args = parser.parse_args()

    repo = repositorio()
    if repo and repo.lower() == ORIGINAL:
        sys.exit(
            f"Este é o repositório original ({ORIGINAL}). Nada foi apagado.\n"
            "O script serve para uma cópia do projeto: veja COMO-FAZER-O-SEU.md."
        )

    camisas = [p for p in CAMISAS.iterdir() if p.is_dir()] if CAMISAS.exists() else []
    clubes = sorted(p.stem for p in CLUBES.glob("*.yml"))

    clubes_opcao = args.clubes
    if not clubes_opcao:
        print("Quais clubes manter?")
        print(f"  1. alguns de exemplo ({', '.join(sorted(EXEMPLOS & set(clubes)))})")
        print("  2. nenhum")
        print(f"  3. todos os {len(clubes)}")
        resposta = input("Escolha 1, 2 ou 3: ").strip()
        clubes_opcao = {"1": "exemplos", "2": "nenhum", "3": "todos"}.get(resposta)
        if not clubes_opcao:
            sys.exit("Resposta inválida. Nada foi apagado.")
    manter = {"exemplos": EXEMPLOS, "nenhum": set(), "todos": set(clubes)}[clubes_opcao]
    saem = [c for c in clubes if c not in manter]

    print(f"\nRepositório: {repo or 'desconhecido'}")
    print(f"Vão ser apagadas {len(camisas)} camisas (com fotos e lista de desejos)")
    print(f"e {len(saem)} de {len(clubes)} clubes.")
    if not args.sim and input("Para confirmar, digite APAGAR: ").strip() != "APAGAR":
        sys.exit("Nada foi apagado.")

    esvaziar(CAMISAS)
    esvaziar(CLUBES, manter)
    if IMAGENS.exists():
        shutil.rmtree(IMAGENS)
    print("Pronto. O armário está vazio. Confira com git status e faça o commit.")


if __name__ == "__main__":
    main()
