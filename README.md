# Plateforme client / conseiller IA Sami

Ce projet propose un prototype front-end permettant à un client de saisir un formulaire
structuré puis de mettre ces informations à disposition d'un conseiller sous forme de fiche.
Tout est géré côté navigateur (HTML, CSS et JavaScript vanilla) et les données sont
stockées dans le `localStorage` du navigateur pour une mise en main immédiate.

## Aperçu des fonctionnalités

- **Accueil** : une page d'introduction expliquant le parcours et affichant le nombre de
  fiches prospects enregistrées localement.
- **Espace client** : un formulaire complet (coordonnées, projet, consentements) avec une
  prévisualisation en temps réel de la fiche qui sera générée.
- **Espace conseiller** : une vue tableau de bord listant les fiches, avec filtrage,
  recherche, tri, mise à jour du statut et suppression.

## Utilisation

1. Ouvrez `client.html` dans un navigateur moderne et remplissez le formulaire.
2. Validez : la fiche est stockée localement et un message de confirmation apparaît.
3. Ouvrez `conseiller.html` pour consulter, filtrer ou mettre à jour la fiche.

> ℹ️ Les données restent enregistrées uniquement sur la machine qui a servi à remplir le
> formulaire. Pour repartir de zéro, effacez l'historique de navigation ou utilisez le bouton
> "Supprimer" sur chaque fiche.

## Structure du projet

```
.
├── index.html             # Page d'accueil
├── client.html            # Formulaire dédié aux clients
├── conseiller.html        # Interface de suivi pour les conseillers
├── assets/
│   ├── css/
│   │   └── styles.css     # Styles globaux
│   └── js/
│       ├── client.js      # Logique du formulaire client
│       ├── conseiller.js  # Gestion de la vue conseiller
│       ├── home.js        # Mise à jour du compteur sur l'accueil
│       └── shared.js      # Fonctions utilitaires (stockage, formatage)
└── README.md
```

Aucun outil supplémentaire n'est requis : il suffit d'ouvrir les fichiers HTML dans un
navigateur compatible ES modules.

## Déployer sur votre dépôt GitHub

1. Créez un nouveau dépôt vide sur GitHub (sans README initial) et copiez l'URL `https`.
2. Depuis ce dossier de projet, initialisez le dépôt local si ce n'est pas déjà fait :
   ```bash
   git init
   git add .
   git commit -m "Initialisation du projet IA Sami"
   ```
3. Ajoutez votre dépôt distant et poussez le code :
   ```bash
   git remote add origin https://github.com/<votre-utilisateur>/<votre-depot>.git
   git push -u origin main
   ```
4. (Facultatif) Activez GitHub Pages via **Settings → Pages** pour publier le prototype ;
   choisissez la branche `main` et le dossier `/ (root)` pour servir le site statique.

Une fois ces étapes réalisées, vous pourrez accéder au formulaire et au tableau de bord
directement depuis votre environnement GitHub, que ce soit pour collaborer ou publier le
prototype via GitHub Pages.
