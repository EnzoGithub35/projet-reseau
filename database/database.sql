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