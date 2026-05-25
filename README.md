# Association des Jeunes Al Kendi

Portail éducatif et communautaire moderne pour l'**Association des Jeunes Al Kendi**. Cette plateforme permet de gérer et de partager des cours, de diffuser des annonces officielles, d'exposer une galerie de photos d'événements et d'interagir avec un assistant virtuel intelligent.

## 🌟 Fonctionnalités Principales

- **📢 Gestion d'Annonces** : Publication d'annonces avec pièces jointes (images et vidéos), catégories (dont mentions urgentes) et possibilité de modification et suppression directe depuis l'espace d'administration.
- **📚 Partage de Cours** : Module de cours structuré par niveaux scolaires ou thématiques pour accompagner les élèves et membres de l'association.
- **📸 Galerie Interactive** : Exposition de photos d'événements marquants de l'association avec descriptions multilingues.
- **🤖 Assistant IA Al Kendi** : Module de chat interactif intelligent pour guider et répondre aux questions des visiteurs (intégrant l'API Gemini).
- **🌍 Support Multilingue** : Interface intégralement disponible en Français, Arabe (RTL supporté) et Anglais.
- **🔐 Espace Admin Sécurisé** : Dashboard de gestion réservé aux administrateurs pour piloter l'ensemble du contenu en temps réel via Firebase Firestore.

## 🛠️ Stack Technique

- **Frontend** : React 19, TypeScript, Tailwind CSS, Vite.
- **Animations** : Framer Motion / Motion.
- **Base de données & Auth** : Firebase Firestore & Firebase Authentication.
- **Assistant Virtuel** : SDK Google GenAI (Gemini).

---

## 🚀 Installation et Lancement Local

### Prérequis
- [Node.js](https://nodejs.org/) (version 18 ou supérieure recommandée)
- Un projet Firebase configuré

### Étape 1 : Cloner le projet et installer les dépendances
```bash
npm install
```

### Étape 2 : Configurer les variables d'environnement
Créez un fichier `.env.local` à la racine du projet et ajoutez vos clés de configuration Firebase ainsi que votre clé API Gemini :

```env
VITE_FIREBASE_API_KEY=votre_api_key
VITE_FIREBASE_AUTH_DOMAIN=votre_auth_domain
VITE_FIREBASE_PROJECT_ID=votre_project_id
VITE_FIREBASE_STORAGE_BUCKET=votre_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=votre_sender_id
VITE_FIREBASE_APP_ID=votre_app_id

# Optionnel : Clé API pour l'Assistant IA
GEMINI_API_KEY=votre_cle_gemini
```

### Étape 3 : Lancer le serveur de développement
```bash
npm run dev
```
L'application sera accessible localement à l'adresse suivante : [http://localhost:3000](http://localhost:3000)

### Étape 4 : Compiler pour la production
```bash
npm run build
```
Les fichiers statiques prêts pour la mise en production seront générés dans le dossier `/dist`.
