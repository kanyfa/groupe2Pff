-- Script de test de connexion MySQL pour Sama Papier
-- Utilisez ce script pour vérifier que votre base de données est correctement configurée

-- 1. Vérifier que la base de données existe
SELECT 'Vérification de la base de données docufind...' as test;

-- 2. Vérifier les tables principales
SELECT 'Tables créées:' as info;
SELECT table_name as 'Nom de la table' 
FROM information_schema.tables 
WHERE table_schema = 'docufind' 
ORDER BY table_name;

-- 3. Vérifier la structure de la table users
SELECT 'Structure de la table users:' as info;
DESCRIBE users;

-- 4. Vérifier les types de documents
SELECT 'Types de documents disponibles:' as info;
SELECT id, name, description FROM document_types ORDER BY id;

-- 5. Vérifier l'utilisateur admin
SELECT 'Utilisateur administrateur:' as info;
SELECT id, username, email, first_name, last_name, role, is_active 
FROM users 
WHERE role = 'ADMIN';

-- 6. Vérifier les paramètres de notification de l'admin
SELECT 'Paramètres de notification admin:' as info;
SELECT uns.*, u.username 
FROM user_notification_settings uns
JOIN users u ON uns.user_id = u.id
WHERE u.role = 'ADMIN';

-- 7. Vérifier les index créés
SELECT 'Index sur la table announcements:' as info;
SHOW INDEX FROM announcements;

-- 8. Vérifier les contraintes de clés étrangères
SELECT 'Contraintes de clés étrangères:' as info;
SELECT 
    CONSTRAINT_NAME,
    TABLE_NAME,
    COLUMN_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM information_schema.KEY_COLUMN_USAGE 
WHERE TABLE_SCHEMA = 'docufind' 
AND REFERENCED_TABLE_NAME IS NOT NULL;

-- 9. Test d'insertion d'un utilisateur de test
SELECT 'Test d\'insertion d\'un utilisateur de test...' as test;

-- Insérer un utilisateur de test (si il n'existe pas déjà)
INSERT IGNORE INTO users (username, email, password, first_name, last_name, role, is_active, email_verified) 
VALUES ('test_user', 'test@sama-papier.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'Test', 'User', 'USER', TRUE, TRUE);

-- Vérifier l'insertion
SELECT 'Utilisateur de test créé:' as info;
SELECT id, username, email, first_name, last_name, role, is_active 
FROM users 
WHERE username = 'test_user';

-- 10. Test d'insertion d'une annonce de test
SELECT 'Test d\'insertion d\'une annonce de test...' as test;

-- Insérer une annonce de test
INSERT IGNORE INTO announcements (title, description, document_type_id, document_name, lost_date, lost_location, contact_phone, contact_email, user_id, status) 
VALUES (
    'Test - Carte d\'identité perdue',
    'J\'ai perdu ma carte d\'identité dans le centre-ville. Elle contient mes informations personnelles.',
    1, -- ID du type de document "Carte d'identité"
    'Carte d\'identité nationale',
    '2023-12-01',
    'Centre-ville, Place de la République',
    '0123456789',
    'test@sama-papier.com',
    2, -- ID de l'utilisateur de test
    'PENDING'
);

-- Vérifier l'insertion
SELECT 'Annonce de test créée:' as info;
SELECT a.id, a.title, a.status, a.created_at, u.username, dt.name as document_type
FROM announcements a
JOIN users u ON a.user_id = u.id
JOIN document_types dt ON a.document_type_id = dt.id
WHERE a.title LIKE 'Test%';

-- 11. Vérifier les statistiques
SELECT 'Statistiques de la base de données:' as info;
SELECT 
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM announcements) as total_announcements,
    (SELECT COUNT(*) FROM document_types) as total_document_types,
    (SELECT COUNT(*) FROM user_notification_settings) as total_notification_settings;

-- 12. Test de performance - Vérifier les index
SELECT 'Test de performance - Recherche par utilisateur:' as test;
EXPLAIN SELECT * FROM announcements WHERE user_id = 2;

-- 13. Test de performance - Recherche par statut
SELECT 'Test de performance - Recherche par statut:' as test;
EXPLAIN SELECT * FROM announcements WHERE status = 'PENDING';

-- 14. Vérifier la configuration de la base de données
SELECT 'Configuration de la base de données:' as info;
SELECT 
    @@character_set_database as charset,
    @@collation_database as collation,
    @@version as mysql_version,
    @@port as port,
    @@hostname as hostname;

-- 15. Nettoyage des données de test (optionnel)
-- Décommentez les lignes suivantes pour supprimer les données de test
-- DELETE FROM announcements WHERE title LIKE 'Test%';
-- DELETE FROM users WHERE username = 'test_user';

SELECT 'Tests de connexion terminés avec succès!' as result;



