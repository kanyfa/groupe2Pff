-- Script d'initialisation de la base de données Sama Papier
-- Base de données: docufind

-- Création de la base de données si elle n'existe pas
CREATE DATABASE IF NOT EXISTS docufind 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Utilisation de la base de données
USE docufind;

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    role ENUM('USER', 'ADMIN', 'MODERATOR') DEFAULT 'USER',
    is_active BOOLEAN DEFAULT TRUE,
    profile_picture VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    reset_password_token VARCHAR(255),
    reset_password_expires TIMESTAMP NULL
);

-- Table des types de documents
CREATE TABLE IF NOT EXISTS document_types (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertion des types de documents par défaut
INSERT INTO document_types (name, description) VALUES
('Carte d\'identité', 'Carte nationale d\'identité'),
('Passeport', 'Passeport international'),
('Permis de conduire', 'Permis de conduire'),
('Acte de naissance', 'Acte de naissance'),
('Acte de mariage', 'Acte de mariage'),
('Diplôme', 'Diplôme ou certificat'),
('Carte bancaire', 'Carte bancaire ou de crédit'),
('Carte d\'assurance', 'Carte d\'assurance maladie'),
('Autre', 'Autre type de document');

-- Table des annonces
CREATE TABLE IF NOT EXISTS announcements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    document_type_id BIGINT NOT NULL,
    document_name VARCHAR(200),
    document_number VARCHAR(100),
    lost_date DATE NOT NULL,
    lost_location VARCHAR(200) NOT NULL,
    contact_phone VARCHAR(20),
    contact_email VARCHAR(100),
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'RESOLVED', 'EXPIRED') DEFAULT 'PENDING',
    user_id BIGINT NOT NULL,
    moderator_id BIGINT NULL,
    moderation_notes TEXT,
    resolved_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    is_urgent BOOLEAN DEFAULT FALSE,
    reward_amount DECIMAL(10,2) DEFAULT 0.00,
    FOREIGN KEY (document_type_id) REFERENCES document_types(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (moderator_id) REFERENCES users(id)
);

-- Table des images des annonces
CREATE TABLE IF NOT EXISTS announcement_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    announcement_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    image_name VARCHAR(255) NOT NULL,
    image_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (announcement_id) REFERENCES announcements(id) ON DELETE CASCADE
);

-- Table des messages
CREATE TABLE IF NOT EXISTS messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sender_id BIGINT NOT NULL,
    receiver_id BIGINT NOT NULL,
    announcement_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (receiver_id) REFERENCES users(id),
    FOREIGN KEY (announcement_id) REFERENCES announcements(id)
);

-- Table des notifications
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('NEW_MESSAGE', 'ANNOUNCEMENT_APPROVED', 'ANNOUNCEMENT_REJECTED', 'MATCH_FOUND', 'SYSTEM_ANNOUNCEMENT') NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Table des paramètres de notification des utilisateurs
CREATE TABLE IF NOT EXISTS user_notification_settings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    email_notifications BOOLEAN DEFAULT TRUE,
    sms_notifications BOOLEAN DEFAULT FALSE,
    push_notifications BOOLEAN DEFAULT TRUE,
    new_message_notifications BOOLEAN DEFAULT TRUE,
    announcement_status_notifications BOOLEAN DEFAULT TRUE,
    match_notifications BOOLEAN DEFAULT TRUE,
    system_notifications BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE KEY unique_user_settings (user_id)
);

-- Table des correspondances (matches)
CREATE TABLE IF NOT EXISTS matches (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    announcement_id BIGINT NOT NULL,
    matched_announcement_id BIGINT NOT NULL,
    similarity_score DECIMAL(5,2) NOT NULL,
    status ENUM('PENDING', 'CONFIRMED', 'REJECTED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (announcement_id) REFERENCES announcements(id),
    FOREIGN KEY (matched_announcement_id) REFERENCES announcements(id)
);

-- Table des favoris
CREATE TABLE IF NOT EXISTS favorites (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    announcement_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (announcement_id) REFERENCES announcements(id),
    UNIQUE KEY unique_user_favorite (user_id, announcement_id)
);

-- Table des rapports
CREATE TABLE IF NOT EXISTS reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    reporter_id BIGINT NOT NULL,
    reported_announcement_id BIGINT NULL,
    reported_user_id BIGINT NULL,
    reason ENUM('SPAM', 'INAPPROPRIATE', 'FAKE', 'DUPLICATE', 'OTHER') NOT NULL,
    description TEXT,
    status ENUM('PENDING', 'INVESTIGATING', 'RESOLVED', 'DISMISSED') DEFAULT 'PENDING',
    moderator_id BIGINT NULL,
    moderator_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (reporter_id) REFERENCES users(id),
    FOREIGN KEY (reported_announcement_id) REFERENCES announcements(id),
    FOREIGN KEY (reported_user_id) REFERENCES users(id),
    FOREIGN KEY (moderator_id) REFERENCES users(id)
);

-- Table des statistiques
CREATE TABLE IF NOT EXISTS statistics (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    total_users INT DEFAULT 0,
    total_announcements INT DEFAULT 0,
    total_messages INT DEFAULT 0,
    resolved_announcements INT DEFAULT 0,
    active_announcements INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_date_stats (date)
);

-- Insertion d'un utilisateur administrateur par défaut
INSERT INTO users (username, email, password, first_name, last_name, role, is_active, email_verified) VALUES
('admin', 'admin@sama-papier.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'Admin', 'Sama Papier', 'ADMIN', TRUE, TRUE);

-- Insertion des paramètres de notification pour l'admin
INSERT INTO user_notification_settings (user_id, email_notifications, sms_notifications, push_notifications) VALUES
(1, TRUE, FALSE, TRUE);

-- Création des index pour améliorer les performances
CREATE INDEX idx_announcements_user_id ON announcements(user_id);
CREATE INDEX idx_announcements_status ON announcements(status);
CREATE INDEX idx_announcements_document_type ON announcements(document_type_id);
CREATE INDEX idx_announcements_lost_date ON announcements(lost_date);
CREATE INDEX idx_announcements_created_at ON announcements(created_at);

CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_messages_announcement ON messages(announcement_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
 
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);

-- Affichage des informations de la base de données
SELECT 'Base de données docufind créée avec succès!' as message;
SELECT COUNT(*) as total_tables FROM information_schema.tables WHERE table_schema = 'docufind';
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_document_types FROM document_types;



