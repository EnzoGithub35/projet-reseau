# Backend - Gestion des Demandes d'Accès Web

## Lancement du backend

Ce backend est en PHP (pas Node.js). Il n'y a donc pas de `npm start` : il faut utiliser un serveur web compatible PHP (Apache, Nginx, ou le serveur PHP intégré).

### 1. Serveur PHP intégré (pour développement)

Dans le dossier `backend/`, lance la commande suivante :

```powershell
php -S localhost:8080 -t public
```

- L'API sera accessible sur http://localhost:8080
- Les routes sont gérées par `public/index.php`

### 2. Avec Apache/Nginx
- Configure le DocumentRoot sur le dossier `public/`
- PHP 8.x requis

## Structure des dossiers
- `public/` : point d'entrée (index.php)
- `routes/` : routes REST (auth, requests, test_results...)
- `controllers/` : logique métier
- `models/` : accès base de données
- `config/` : configuration
- `src/` : utilitaires (connexion DB...)

## Variables d'environnement
- Adapter `config/config.php` si besoin (host, user, pass...)

## Endpoints disponibles
- POST `/auth/register` : création de compte
- POST `/auth/login` : connexion

## Pour ajouter d'autres routes
- Ajouter un fichier dans `routes/` et référencer dans `public/index.php`
