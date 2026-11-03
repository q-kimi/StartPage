# Page d'accueil

Page de démarrage personnelle (thème OLED noir) : barre de recherche multi-moteurs, favoris en groupes, paramètres, PWA. Sans framework ni dépendance. Les données restent dans le `localStorage` du navigateur.

## Structure

```
index.html            squelette HTML, charge css/ et js/
manifest.webmanifest  PWA
sw.js                 service worker (coquille hors ligne, cache des icônes)
nginx.conf, security.conf, Dockerfile   deploiement (en-têtes de sécurité)
tests/                tests node:test (état, migration, syntaxe)
.github/workflows/    CI (npm test + build)
icons/                icônes de l'application
css/
  base.css            variables, reset, mise en page
  composer.css        titre, barre de recherche, moteurs
  links.css           groupes et favoris, mode édition, glisser-déposer
  controls.css        dock, boutons, champs
  overlays.css        dialogue, paramètres, toast
  motion.css          animations, responsive, tactile
js/  (une seule portée globale, l'ordre de chargement compte)
  data.js             favoris par défaut, moteurs, réglages par défaut
  util.js             helpers DOM, SVG, échappement, localStorage
  icons.js            récupération et cache des favicons
  symbols.js          symboles de groupes
  state.js            données, réglages, initialisation des moteurs
  core.js             références DOM, toast, animation de sortie
  settings.js         panneau Paramètres
  links.js            rendu des groupes et liens
  dnd.js              glisser-déposer
  dialog.js           dialogue d'ajout et de modification
  composer.js         recherche, moteurs, raccourcis
  greeting.js         salutation
  main.js             démarrage
build.js              assemble dist/ (un seul index.html autonome)
```

## Utilisation

```
npm start        serveur local sur http://127.0.0.1:8765
npm run build    génère dist/ (index.html autonome avec CSP par hash, sw, manifest, icônes)
npm test         tests (Node >= 22)
```

Le service worker et le manifeste exigent `http://` ou `https://` (pas `file://`). `dist/index.html` fonctionne en ouvrant le fichier directement, sans service worker.

## Données (localStorage)

| Clé | Contenu |
| --- | --- |
| `sp` | groupes et favoris (`{n,u,k?}`, séparateur `{sep:1}`) |
| `sps` | réglages, format v2 (moteurs stockés par id stable) |
| `spr` | recherches récentes |
| `spi`, `spm` | cache des icônes (site, Google 7 jours) |
| `spu` | nombre de clics par lien |

## Deploiement (Coolify)

`Dockerfile` : build Node (`node build.js`) puis nginx sert `dist/`. Dans Coolify : nouvelle ressource, Dockerfile, port 80, domaine en HTTPS (requis pour le service worker et la PWA). Les donnees restent dans le navigateur de chaque appareil.


## Réglages et raccourcis

- `Recherches récentes` (`hist`) : désactive l'historique et l'efface.
- `Icônes via Google seulement` (`priv`) : pas de requête de favicon vers d'autres services.
- Mode édition : `Alt+Haut/Bas` réordonne groupes et liens au clavier.
- Barre de moteurs : `Alt+Gauche/Droite` réordonne le moteur actif.
- Plusieurs onglets : une modification dans un onglet recharge les autres (sauf édition en cours).

## Apps et .exe locaux

- Apps par protocole (bouton "Ajouter une app") : Steam, Discord, Spotify, VS Code, Slack, Notion, Obsidian, Telegram, Zoom, Teams. Pour en ajouter : la liste `APPS` de `js/util.js`.
- `.exe` local : une page web ne peut pas lancer un programme. Le dossier `helper/` (Windows, PowerShell 5.1) enregistre le protocole `startpage://` pour ton utilisateur.
  1. `powershell -ExecutionPolicy Bypass -File helper\install.ps1` (une fois, le dossier `helper/` doit rester en place).
  2. Dans "Ajouter une app", bouton "Choisir un .exe..." : l'Explorateur s'ouvre, le lien `startpage://run/ID` est rempli.
  3. Seuls les exe choisis ainsi sont lançables (liste `%APPDATA%\startpage\apps.json`). Un lien ne contient qu'un identifiant, jamais un chemin.
  - Retrait : `helper\uninstall.ps1`.

## Historique et statistiques

- `Ctrl+Z` annule, `Ctrl+Maj+Z` (ou `Ctrl+Y`) rétablit (50 actions, hors champ de saisie).
- "Les plus utilisés" (réglage `top`) : compteur de clics par lien dans `spu`, affiche les 5 liens ouverts au moins 2 fois.
