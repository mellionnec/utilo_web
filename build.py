#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Construit le site statique Utilo à partir de l'export YesWiki."""
import json, re, html, os

SRC = '/home/user/knowledge/site-utilo/entries.json'
OUT = '/home/user/utilo-site/out'
os.makedirs(OUT, exist_ok=True)

THEMES = {
 'se_rencontrer_differement': ('Se rencontrer différemment', '🤝', "Brise-glace et exercices pour permettre à des personnes qui ne se connaissent pas de se rencontrer"),
 'federer_une_equipe': ('Fédérer une équipe', '🧩', "Exercices de cohésion pour fédérer un groupe de personnes ou renforcer leurs liens"),
 'reveiller_un_groupe': ('Réveiller un groupe', '⚡', "Activités pour redonner de l'énergie au groupe, réveiller le corps et l'esprit"),
 'se_reunir_autrement': ('Se réunir autrement', '🗓️', "Idées pour se réunir différemment, en équipe ou en grand groupe"),
 's_exprimer': ("S'exprimer", '💬', "Trouver des manières de s'exprimer différemment, répartir la parole, représenter ses idées autrement"),
 's_ameliorer_collectivement': ("S'améliorer collectivement", '🌱', "Revenir sur une période ou un projet passé pour faire mieux la prochaine fois"),
 'p_reparer_une_collaboration': ('Préparer une collaboration', '🧭', "Préparer le terrain avant un projet collaboratif, préparer une démarche commune"),
 'explorer_le_projet_en_amont': ('Explorer le projet en amont', '🔍', "Faire le point sur le contexte du projet, en comprendre les tenants et les aboutissants"),
 'se_projeter_planifier': ('Se projeter, planifier', '🗺️', "Planifier et garder en tête les étapes importantes tout au long d'un projet"),
 'comprendre_les_beneficiaires': ('Comprendre les bénéficiaires', '👤', "Mieux comprendre les usager·es auxquel·les on destine le service"),
 'trouver_de_nouvelles_idees': ('Trouver de nouvelles idées', '💡', "Faire pleuvoir les idées, en nombre et en qualité"),
 'passer_de_l_idee_au_concret': ("Passer de l'idée au concret", '🛠️', "Donner une forme à ses idées et pouvoir les partager"),
 'tester_ses_hypoteses': ('Tester ses hypothèses', '🧪', "Confronter ses idées et hypothèses au vaste monde"),
 'decider': ('Décider', '⚖️', "Choisir, c'est renoncer : des pratiques pour choisir plus aisément"),
}
NIVEAUX = {
 'niveau_1': ('1', 'Débutant', "Ces ateliers sont parfaits pour se jeter à l'eau : tu es familier·ère avec les pratiques collaboratives et tu as assisté à plusieurs ateliers ou réunions participatives."),
 'niveau_2': ('2', 'Intermédiaire', "Tu maîtrises la posture et les bases de la facilitation et tu as déjà animé plusieurs temps collaboratifs."),
 'niveau_3': ('3', 'Confirmé', "Tu es un·e facilitant·e aguerri·e : tu conçois et animes régulièrement des dispositifs participatifs complexes."),
}

def clean_yeswiki(text):
    if not text: return ''
    t = text
    t = t.replace('""', '"')          # échappement YesWiki des guillemets
    t = re.sub(r'======+\s*', '', t)
    t = re.sub(r'======+', '', t)
    t = re.sub(r'=====+', '', t)
    t = re.sub(r'====+', '', t)
    t = re.sub(r'===+', '', t)
    t = re.sub(r'==+', '', t)          # titres
    t = re.sub(r'----+', '', t)
    t = re.sub(r'\{\{.*?\}\}', '', t)  # actions/iframe wiki
    t = re.sub(r'\[\[.*?\]\]', '', t)
    t = re.sub(r'<[^>]+>', '', t)      # balises html
    t = t.replace('&nbsp;', ' ').replace('&amp;', '&')
    t = re.sub(r'[ \t]+', ' ', t)
    t = re.sub(r'\n\s*\n+', '\n\n', t)
    return t.strip().strip('"').strip()

def bullets_to_html(text):
    """Convertit les lignes ' - xxx' en <ul><li>."""
    t = clean_yeswiki(text)
    if not t: return ''
    lines = t.split('\n')
    out, in_ul, buf = [], False, []
    def flush():
        nonlocal in_ul, buf
        if buf:
            out.append('<ul>' + ''.join(f'<li>{x}</li>' for x in buf) + '</ul>')
            buf, in_ul = [], False
    for ln in lines:
        s = ln.strip()
        if s.startswith('- '):
            s = s[2:].strip()
        if re.match(r'^-\s+\S', ln) or (s and not ln.startswith('  ') and ln.lstrip().startswith('-')):
            buf.append(html.escape(s).replace('"','"'))
            in_ul = True
        elif s:
            if in_ul: flush()
            out.append('<p>' + html.escape(s) + '</p>')
    flush()
    return '\n'.join(out)

def parse_meta(text):
    """bf_description6 -> (duree, preparation, participants)"""
    duree = prep = parts = ''
    for ln in (text or '').split('\n'):
        s = ln.strip().lstrip('-').strip()
        if 'exercice' in s: duree = s.replace("d'exercice",'').replace("d’exercice",'').strip()
        elif 'préparation' in s or 'préparation' in s: prep = s.replace('de préparation','').replace('de préparation','').strip()
        elif 'parti' in s:
            cleaned = re.sub(r'\s*parti[cp]\w*\.?e?\.?s?\s*(\(dès \d+ équipes\))?\s*$', '', s).strip()
            parts = cleaned if re.search(r'\d', cleaned) else s.strip()
    if not parts:
        for ln in (text or '').split('\n'):
            s = ln.strip().lstrip('-').strip()
            if re.search(r'\d', s) and 'min' not in s and 'préparation' not in s:
                parts = s
    return duree, prep, parts

def parse_range(parts):
    nums = [int(n) for n in re.findall(r'\d+', parts)]
    if not nums:
        return None, None
    if len(nums) == 1:
        return nums[0], nums[0]
    return min(nums), max(nums)

def build_fiches():
    data = json.load(open(SRC))
    fiches = []
    for d in data:
        theme_code = d.get('bf_choice1') or ''
        niveau_code = d.get('bf_choice') or ''
        duree, prep, parts = parse_meta(d.get('bf_description6',''))
        minP, maxP = parse_range(parts)
        actions = [a.strip() for a in re.split(r'\s*[-–]\s*', d.get('bf_motscles','') or '') if a.strip()]
        fiches.append({
            'id': d.get('id_fiche'),
            'titre': html.escape(clean_yeswiki(d.get('bf_titre',''))),
            'theme': theme_code,
            'niveau': NIVEAUX.get(niveau_code, ('','',''))[0],
            'niveauLabel': NIVEAUX.get(niveau_code, ('','?',''))[1],
            'duree': duree, 'preparation': prep,
            'participants': parts, 'minP': minP, 'maxP': maxP,
            'actions': actions,
            'description': clean_yeswiki(d.get('bf_description','')).replace('"','"'),
            'materiel': bullets_to_html(d.get('bf_description1','')),
            'deroule': bullets_to_html(d.get('bf_description2','')),
            'conseils': bullets_to_html(d.get('bf_description3','')),
            'variante': bullets_to_html(d.get('bf_description4','')),
            'source': clean_yeswiki(d.get('bf_description5','')),
            'pdf': ('https://tilab.bzh/files/' + d['fichierbf_file']) if d.get('fichierbf_file') else '',
            'original': 'https://tilab.bzh/?' + d.get('id_fiche',''),
        })
    fiches.sort(key=lambda f: f['titre'].lower())
    return fiches

def main():
    fiches = build_fiches()
    themes = {code: {'label': v[0], 'emoji': v[1], 'desc': v[2]} for code, v in THEMES.items()}
    with open(os.path.join(OUT, 'themes.js'), 'w', encoding='utf-8') as f:
        f.write('const THEMES = ' + json.dumps(themes, ensure_ascii=False, indent=1) + ';\n')
    with open(os.path.join(OUT, 'fiches.js'), 'w', encoding='utf-8') as f:
        f.write('const FICHES = ' + json.dumps(fiches, ensure_ascii=False, indent=1) + ';\n')
    print('Fiches:', len(fiches))
    # stats
    for f_ in fiches:
        assert f_['id'] and f_['titre'], f_
    print('OK ->', OUT)

if __name__ == '__main__':
    main()
