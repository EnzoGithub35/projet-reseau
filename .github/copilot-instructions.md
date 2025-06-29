# Projet Infrastructure de Gestion des Demandes d'Accès Web

## Contexte du projet

Application web de gestion des demandes d'accès à des sites externes dans un environnement d'entreprise sécurisé.

### Architecture

- **PFSense** : Pare-feu principal (configuration manuelle des règles)
- **VM Frontend** : Interface web utilisateur (React + PHP)
- **VM Backend** : API REST + Base de données MySQL
- **VM Test** : Scripts de test automatiques
- **Poste utilisateur** : Point d'accès des employés

## Structure du projet

### `/frontend/` - VM Frontend (Serveur Web)

Interface utilisateur avec rôles différenciés

- **Technologies** : React, PHP 8.x
- **Fonctionnalités** :
  - Portail de connexion unique
  - Interface demandeur (créer/suivre demandes)
  - Interface admin (valider/refuser, gérer utilisateurs)
  - Tests manuels depuis l'interface
- **Sécurité** : HTTPS, validation stricte des entrées

### `/backend/` - VM Backend (API + BDD)

Serveur d'API et base de données

- **Technologies** : PHP 8.x, MySQL/MariaDB
- **Base de données** :
  - `USERS` : Gestion des utilisateurs et rôles
  - `REQUESTS` : Demandes d'accès avec workflow
  - `TEST_RESULTS` : Résultats des tests de connectivité
- **API REST** : Endpoints pour frontend et tests
- **Sécurité** : Protection SQL injection, hashage bcrypt, rate limiting

### `/test-server/` - VM Test (Tests automatiques)

Serveur dédié aux tests de connectivité

- **Fonctionnalités** :
  - Tests automatiques horaires des sites validés
  - Tests manuels à la demande
  - Vérification HTTP/HTTPS, temps de réponse
- **Logs** : `/var/log/accesstests/tests.log` avec rotation
- **Technologies** : Scripts PHP/Bash, curl

### `/docs/` - Documentation

- Architecture technique
- Manuel utilisateur
- Configuration PFSense
- Guide d'installation

### `/config/` - Configuration

- Scripts de déploiement
- Configuration serveurs
- Schémas base de données

## Workflow des demandes

1. **En attente de validation** → Demande créée
2. **Refusée** → Admin refuse avec commentaire
3. **Validée, en cours d'implémentation** → Admin approuve
4. **Réalisée, en attente de test** → Règle PFSense configurée
5. **Réalisée, test ok** → Tests passent
6. **Réalisée, en erreur** → Tests échouent

## Données requises pour une demande

- Adresse IP cible du site
- Nom du site/application
- Description du besoin
- Justification professionnelle

## Sécurité

- Séparation frontend/backend
- HTTPS obligatoire
- Rate limiting (2 req/min max)
- Journalisation des actions admin
- Principe du moindre privilège

## Tests

- Tests automatiques : 1/heure par requête validée
- Tests manuels depuis l'interface admin
- Vérifications : accessibilité, IP, temps réponse, codes HTTP
- Stockage résultats en base + logs locaux

## Déploiement

- 3 VMs Debian 12 (1024MB RAM, 20GB disk)
- PFSense configuré en routeur
- Configuration initiale : blocage Internet sauf IP de test

## DATABASE

```sql
-- Création d'un utilisateur dédié pour l'application
CREATE USER IF NOT EXISTS 'access_app'@'localhost' IDENTIFIED BY 'SecurePassword123!';
CREATE USER IF NOT EXISTS 'access_app'@'%' IDENTIFIED BY 'SecurePassword123!';

-- Attribution des privilèges
GRANT SELECT, INSERT, UPDATE, DELETE ON access_management_db.* TO 'access_app'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON access_management_db.* TO 'access_app'@'%';

-- Privilèges pour les vues
GRANT CREATE VIEW ON access_management_db.* TO 'access_app'@'localhost';
GRANT CREATE VIEW ON access_management_db.* TO 'access_app'@'%';

FLUSH PRIVILEGES;


-- Création de la base de données
CREATE DATABASE IF NOT EXISTS access_management_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE access_management_db;

-- Table USERS
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    fullname VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role ENUM('demandeur', 'admin') NOT NULL DEFAULT 'demandeur',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE=InnoDB;

-- Table REQUESTS
CREATE TABLE requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    target_ip VARCHAR(45) NOT NULL,
    website_name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    justification TEXT NOT NULL,
    status ENUM(
        'en_attente_validation',
        'refusee',
        'validee_en_cours_implementation',
        'realisee_en_attente_test',
        'realisee_test_ok',
        'realisee_en_erreur'
    ) NOT NULL DEFAULT 'en_attente_validation',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    admin_comment TEXT NULL,
    last_test_date TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_target_ip (target_ip)
) ENGINE=InnoDB;

-- Table TEST_RESULTS
CREATE TABLE test_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    request_id INT NOT NULL,
    test_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_tested VARCHAR(45) NOT NULL,
    site_name VARCHAR(255) NOT NULL,
    status ENUM('ok', 'ko', 'timeout', 'error') NOT NULL,
    response_time INT NULL COMMENT 'Response time in milliseconds',
    error_message TEXT NULL,
    is_manual_test BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (request_id) REFERENCES requests(id) ON DELETE CASCADE,
    INDEX idx_request_id (request_id),
    INDEX idx_test_date (test_date),
    INDEX idx_status (status),
    INDEX idx_is_manual (is_manual_test)
) ENGINE=InnoDB;

-- Insertion d'un utilisateur admin par défaut
INSERT INTO users (username, password, fullname, email, role) VALUES
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrateur Système', 'admin@entreprise.local', 'admin');

-- Insertion d'un utilisateur demandeur de test
INSERT INTO users (username, password, fullname, email, role) VALUES
('jdupont', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Jean Dupont', 'j.dupont@entreprise.local', 'demandeur');

-- Vue pour les statistiques des demandes
CREATE VIEW request_stats AS
SELECT
    status,
    COUNT(*) as count,
    AVG(TIMESTAMPDIFF(HOUR, created_at, updated_at)) as avg_processing_hours
FROM requests
GROUP BY status;

-- Vue pour les derniers résultats de test par demande
CREATE VIEW latest_test_results AS
SELECT
    r.id as request_id,
    r.website_name,
    r.target_ip,
    tr.test_date,
    tr.status as test_status,
    tr.response_time,
    tr.error_message
FROM requests r
LEFT JOIN test_results tr ON r.id = tr.request_id
WHERE tr.id = (
    SELECT MAX(id)
    FROM test_results tr2
    WHERE tr2.request_id = r.id
)
OR tr.id IS NULL;
```

# Guide de configuration et de debug - Projet Gestion des Demandes d'Accès Web

## 1. Architecture et séparation des services

- **Frontend (React)** : tourne sur http://localhost:3000 (dossier `frontend/`)
- **Backend (API PHP)** : tourne sur http://localhost:8080 (dossier `backend/public/`)
- **Base de données** : MySQL/MariaDB, accessible par le backend

## 2. Lancement des serveurs

### Backend (API PHP)

Dans le dossier `backend` :

```sh
php -S localhost:8080 -t public
```

- Les routes API sont accessibles sur http://localhost:8080/auth/... (et non /api/auth/...)
- La racine `/` retourne toujours `{ "message": "Not found" }` (c'est normal pour une API REST)

### Frontend (React)

Dans le dossier `frontend` :

```sh
npm install
npm start
```

- L'application React est accessible sur http://localhost:3000

## 3. Configuration des appels API côté frontend

Dans `frontend/src/utils/constants.js` :

```js
export const API_BASE_URL = "http://localhost:8080";
```

Tous les appels API doivent utiliser cette constante, par exemple :

```js
api.post("/auth/register", userData);
```

## 4. CORS (Cross-Origin Resource Sharing)

Dans `backend/public/index.php`, ajoutez en haut du fichier :

```php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
```

Cela permet au frontend d'appeler l'API sans erreur CORS.

## 5. Debug courant

- Si `/` sur le backend retourne `{ "message": "Not found" }` : c'est normal, seules les routes API sont valides.
- Si l'inscription ou la connexion échoue avec 404 :
  - Vérifiez que l'URL d'appel est bien `/auth/register` ou `/auth/login` (et non `/api/auth/register`)
  - Vérifiez que le backend tourne bien sur le port 8080
- Si erreur CORS : vérifiez les headers dans `index.php`.

## 6. Utilisation de MySQL

- Pour exécuter le script SQL de création de la base et des tables :
  - Utilisez la console MySQL de WAMP/XAMPP ou phpMyAdmin
  - Exemple en ligne de commande :
    ```sh
    mysql -u root
    # puis collez le script SQL fourni dans la doc
    ```

## 7. Résumé des bonnes pratiques

- Garder frontend et backend séparés
- Toujours utiliser l'URL complète du backend dans le frontend
- Ne pas s'inquiéter du message "Not found" sur la racine du backend
- Tester les routes API avec Postman/curl pour valider le backend
- Toujours relancer le frontend après modification de l'URL d'API

---

**Ce guide couvre la configuration, le debug et les points d'attention pour un fonctionnement optimal du projet.**
