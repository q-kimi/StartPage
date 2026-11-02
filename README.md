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

## Deploiement (Coolify)

`Dockerfile` : build Node (`node build.js`) puis nginx sert `dist/`. Dans Coolify : nouvelle ressource, Dockerfile, port 80, domaine en HTTPS (requis pour le service worker et la PWA). Les donnees restent dans le navigateur de chaque appareil.


## Réglages et raccourcis

- `Recherches récentes` (`hist`) : désactive l'historique et l'efface.
- `Icônes via Google seulement` (`priv`) : pas de requête de favicon vers d'autres services.
- Mode édition : `Alt+Haut/Bas` réordonne groupes et liens au clavier.
- Barre de moteurs : `Alt+Gauche/Droite` réordonne le moteur actif.
- Plusieurs onglets : une modification dans un onglet recharge les autres (sauf édition en cours).
