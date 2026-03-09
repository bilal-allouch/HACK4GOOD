# EcoPrompt

## Présentation

EcoPrompt est un outil web permettant d'analyser l'impact énergétique et environnemental des prompts envoyés aux modèles d'intelligence artificielle.

L'objectif du projet est d'aider les utilisateurs à mieux comprendre le coût écologique de l'utilisation des modèles d'IA et à adopter de meilleures pratiques pour réduire cet impact.

Grâce à une estimation du nombre de tokens d'un prompt et à des données énergétiques approximatives, EcoPrompt calcule la consommation d'énergie ainsi que les émissions de CO₂ associées.

---

## Objectif du projet

L'intelligence artificielle est aujourd'hui largement utilisée, mais son impact environnemental reste souvent méconnu.

EcoPrompt a pour objectif de :

* sensibiliser les utilisateurs au coût énergétique des requêtes envoyées aux modèles d'IA
* proposer une estimation simple de l'énergie consommée
* visualiser les émissions de CO₂ générées
* comparer cet impact avec des exemples concrets de la vie quotidienne
* encourager l'utilisation de prompts plus efficaces et plus responsables

---

## Fonctionnalités

EcoPrompt propose plusieurs fonctionnalités :

* Analyse d'un prompt écrit par l'utilisateur
* Estimation du nombre de tokens
* Calcul de l'énergie consommée
* Estimation des émissions de CO₂ selon le pays
* Score écologique du prompt
* Comparaisons avec des équivalences réelles :

  * recharge de smartphone
  * consommation d'une ampoule LED
  * utilisation d'un ordinateur portable
  * distance parcourue en voiture
  * nombre d'emails équivalents
  * absorption par un arbre

---

## Technologies utilisées

Le projet est développé uniquement avec des technologies web simples :

* HTML
* CSS
* JavaScript

Aucun backend n'est nécessaire : toutes les estimations sont calculées directement dans le navigateur.

---

## Structure du projet

```
EcoPrompt
│
├── index.html
├── analyse.html
├── app.js
│
└── css
    └── style.css
```

---

## Auteur

Projet réalisé dans le cadre d'un hackathon sur l'optimisation et l'impact écologique de l'intelligence artificielle.

EcoPrompt vise à encourager une utilisation plus responsable et plus consciente des technologies d'IA.
