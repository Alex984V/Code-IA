CREATE DATABASE IF NOT EXISTS codeai;
USE codeai;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nome VARCHAR(100) DEFAULT 'Usuário CodeAI',
    plano VARCHAR(50) DEFAULT 'gratis', 
    fotoURL VARCHAR(255) DEFAULT 'https://via.placeholder.com/120',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Usuário de teste: email: teste@codeai.com | senha: 123456
INSERT INTO users (email, password, nome, plano)
VALUES ('teste@codeai.com', '$2a$10$e0NRh2eD6c/T6MKQ9mO2OOq3Z9WEOuMZz9C4jK3K84Yz0Dx4PjP2G', 'Teste User', 'gratis');
-- Exibe o conteúdo (Para verificar se está vazio/funcionando)
SELECT * FROM users;
