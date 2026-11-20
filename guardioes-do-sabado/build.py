#!/usr/bin/env python3
"""Junta src/ em páginas únicas.
   python3 build.py                      -> index.html (página completa, para hospedar)
   python3 build.py --artifact CAMINHO   -> também gera o fragmento para o Artifact do claude.ai
   python3 build.py --debug CAMINHO      -> versão de teste que expõe internos em window.__GS
"""
import pathlib, sys
root = pathlib.Path(__file__).resolve().parent
src = root / 'src'
css = (src / 'style.css').read_text(encoding='utf-8')
tpl = (src / 'template.html').read_text(encoding='utf-8')
parts = ['content-a.js', 'content-b.js', 'faq.js', 'engine1.js', 'engine2.js']
js = '\n'.join((src / p).read_text(encoding='utf-8') for p in parts)

def wrap(debug=False):
    extra = ''
    if debug:
        extra = ("\nwindow.__GS = { get S(){return S}, set S(v){S=v}, norm, wc, evalConcepts, listItems, findFAQ, CH, CHM, FAQ, F4, SEQ, ROLES, "
                 "unlocked, isDone, openChannel, runCommand, addXP, roleIdx, WEEK_ITEMS, weekState, toggleWeek, CRISIS, md, pledgeData, pledgeBlob, get AW(){return AW}, dilemmasDone };\n")
    return "(function(){\n'use strict';\n" + js + extra + "\n})();"

FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com">'
         '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
         '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap">')
TITLE = '<title>Guardiões do Sábado</title>'

def fragment(debug=False):
    return f"{TITLE}\n{FONTS}\n<style>\n{css}\n</style>\n{tpl}\n<script>\n{wrap(debug)}\n</script>\n"

def full(debug=False):
    return ('<!doctype html>\n<html lang="pt-BR">\n<head>\n<meta charset="utf-8">\n'
            '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
            '<meta name="theme-color" content="#1b1b26">\n<meta name="description" content="Jogo interativo para adolescentes: entender e praticar pela fé a guarda do sábado.">\n'
            f'{TITLE}\n{FONTS}\n<style>\n{css}\n</style>\n</head>\n<body>\n{tpl}\n<script>\n{wrap(debug)}\n</script>\n</body>\n</html>\n')

args = sys.argv[1:]
if '--debug' in args:
    out = pathlib.Path(args[args.index('--debug') + 1]); out.write_text(full(True), encoding='utf-8'); print('debug ->', out)
else:
    (root / 'index.html').write_text(full(), encoding='utf-8'); print('index.html ->', (root / 'index.html').stat().st_size, 'bytes')
    if '--artifact' in args:
        out = pathlib.Path(args[args.index('--artifact') + 1]); out.write_text(fragment(), encoding='utf-8'); print('artifact ->', out, out.stat().st_size, 'bytes')
