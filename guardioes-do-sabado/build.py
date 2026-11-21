#!/usr/bin/env python3
"""Junta src/ nas versões do jogo.

  python3 build.py                        -> index.html: arquivo único, SEM login (demonstração / hospedagem simples)
  python3 build.py --server [PASTA]       -> versão COM login para o servidor (padrão: server/public/), CSS/JS separados com hash
  python3 build.py --artifact CAMINHO     -> fragmento para o Artifact do claude.ai (sem login)
  python3 build.py --debug CAMINHO        -> arquivo único de teste que expõe internos em window.__GS
  python3 build.py --server PASTA --debug -> versão do servidor com window.__GS (só para testes automatizados)
  python3 build.py --check                -> confere se server/public e index.html estão em dia com src/ (sai com erro se não)
"""
import hashlib, json, pathlib, shutil, sys

root = pathlib.Path(__file__).resolve().parent
src = root / 'src'
read = lambda name: (src / name).read_text(encoding='utf-8')

css_base = read('style.css')
css_page = read('page.css')
tpl_raw = read('template.html')
PARTS = ['content-a.js', 'content-b.js', 'faq.js', 'engine1.js', 'auth.js', 'engine2.js']
js_body = '\n'.join(read(p) for p in PARTS)

DEBUG_HOOK = ("\nwindow.__GS = { get S(){return S}, set S(v){S=v}, get ME(){return ME}, get GAME_ON(){return GAME_ON}, get RK(){return RK}, MODE, SERVER, "
              "norm, wc, evalConcepts, listItems, findFAQ, CH, CHM, FAQ, F4, SEQ, ROLES, unlocked, isDone, openChannel, runCommand, addXP, roleIdx, "
              "WEEK_ITEMS, weekState, toggleWeek, CRISIS, md, pledgeData, pledgeBlob, openPledge, savePledgePNG, get AW(){return AW}, dilemmasDone, progressPayload, syncNow, fetchRank };\n")

def wrap(debug=False):
    return "(function(){\n'use strict';\n" + js_body + (DEBUG_HOOK if debug else '') + "\n})();"

def css_for(page):
    return css_base + ('\n' + css_page if page else '')

def tpl_for(mode):
    return tpl_raw.replace('{{MODE}}', mode)

FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com">'
         '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
         '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap">')
TITLE = '<title>Guardiões do Sábado</title>'
DESC = 'Jogo interativo para adolescentes: entender e praticar pela fé a guarda do sábado.'

def fragment(debug=False):
    """Artifact do claude.ai: sem <html>/<head>; o esqueleto cuida das áreas seguras."""
    return f"{TITLE}\n{FONTS}\n<style>\n{css_for(False)}\n</style>\n{tpl_for('artifact')}\n<script>\n{wrap(debug)}\n</script>\n"

def single_file(debug=False, mode='static'):
    """Arquivo único (sem servidor, sem login). Tudo embutido."""
    return ('<!doctype html>\n<html lang="pt-BR">\n<head>\n<meta charset="utf-8">\n'
            '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
            f'<meta name="theme-color" content="#1b1b26">\n<meta name="description" content="{DESC}">\n'
            f'{TITLE}\n{FONTS}\n<style>\n{css_for(True)}\n</style>\n</head>\n<body>\n{tpl_for(mode)}\n<script>\n{wrap(debug)}\n</script>\n</body>\n</html>\n')

def build_server(out, debug=False):
    """Versão com login: arquivos separados (a CSP do servidor proíbe script/estilo embutido) e sem fontes externas."""
    out.mkdir(parents=True, exist_ok=True)
    for old in list(out.glob('app.*.js')) + list(out.glob('app.*.css')):
        old.unlink()
    css, js = css_for(True), wrap(debug)
    h = lambda t: hashlib.sha256(t.encode('utf-8')).hexdigest()[:10]
    css_name, js_name = f'app.{h(css)}.css', f'app.{h(js)}.js'
    (out / css_name).write_text(css, encoding='utf-8')
    (out / js_name).write_text(js, encoding='utf-8')
    html = ('<!doctype html>\n<html lang="pt-BR">\n<head>\n<meta charset="utf-8">\n'
            '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover,interactive-widget=resizes-content">\n'
            '<meta name="theme-color" content="#1b1b26">\n'
            f'<meta name="description" content="{DESC}">\n'
            '<meta name="mobile-web-app-capable" content="yes">\n<meta name="apple-mobile-web-app-capable" content="yes">\n'
            '<meta name="apple-mobile-web-app-title" content="Guardiões">\n<meta name="robots" content="noindex,nofollow">\n'
            '<link rel="manifest" href="/manifest.webmanifest">\n<link rel="icon" href="/icon.svg" type="image/svg+xml">\n'
            '<link rel="apple-touch-icon" href="/apple-touch-icon.png">\n'
            f'{TITLE}\n<link rel="stylesheet" href="/{css_name}">\n</head>\n<body>\n{tpl_for("server")}\n<script src="/{js_name}"></script>\n</body>\n</html>\n')
    (out / 'index.html').write_text(html, encoding='utf-8')
    manifest = {
        'name': 'Guardiões do Sábado', 'short_name': 'Guardiões', 'description': DESC, 'lang': 'pt-BR',
        'id': '/', 'start_url': '/', 'scope': '/', 'display': 'standalone', 'background_color': '#1b1b26', 'theme_color': '#1b1b26',
        'icons': [
            {'src': '/icon-192.png', 'sizes': '192x192', 'type': 'image/png'},
            {'src': '/icon-512.png', 'sizes': '512x512', 'type': 'image/png'},
            {'src': '/icon-maskable-512.png', 'sizes': '512x512', 'type': 'image/png', 'purpose': 'maskable'}]}
    (out / 'manifest.webmanifest').write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf-8')
    icons = src / 'icons'
    if icons.is_dir():
        for f in icons.iterdir():
            shutil.copy2(f, out / f.name)
    print('servidor ->', out, '|', css_name, f'({len(css)//1024} KB)', js_name, f'({len(js)//1024} KB)')

args = sys.argv[1:]
arg_after = lambda flag: pathlib.Path(args[args.index(flag) + 1]) if flag in args and args.index(flag) + 1 < len(args) and not args[args.index(flag) + 1].startswith('--') else None

if '--check' in args:
    # confere se o que está commitado (server/public e index.html) é exatamente o que o código-fonte gera
    import tempfile
    tmp = pathlib.Path(tempfile.mkdtemp())
    build_server(tmp / 'public')
    arq = lambda d: {f.name: f.read_bytes() for f in d.iterdir() if f.is_file()}
    pub_ok = arq(root / 'server' / 'public') == arq(tmp / 'public')
    idx_ok = (root / 'index.html').read_text(encoding='utf-8') == single_file()
    print('server/public em dia com src/:', 'sim' if pub_ok else 'NÃO — rode: python3 build.py --server')
    print('index.html em dia com src/:   ', 'sim' if idx_ok else 'NÃO — rode: python3 build.py')
    shutil.rmtree(tmp, ignore_errors=True)
    sys.exit(0 if pub_ok and idx_ok else 1)
elif '--server' in args:
    build_server(arg_after('--server') or (root / 'server' / 'public'), debug='--debug' in args)
elif '--debug' in args:
    out = arg_after('--debug')
    out.write_text(single_file(True), encoding='utf-8'); print('debug ->', out)
else:
    (root / 'index.html').write_text(single_file(), encoding='utf-8'); print('index.html ->', (root / 'index.html').stat().st_size, 'bytes')
    if '--artifact' in args:
        out = arg_after('--artifact'); out.write_text(fragment(), encoding='utf-8'); print('artifact ->', out, out.stat().st_size, 'bytes')
