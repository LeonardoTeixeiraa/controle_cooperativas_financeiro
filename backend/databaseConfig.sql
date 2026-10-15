--Criar tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id BIGSERIAL NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    deleted BOOLEAN DEFAULT FALSE,
    CONSTRAINT pK_usuarios PRIMARY KEY (id)
    );

--Criar extensão para criptografia de senha
CREATE EXTENSION if NOT EXISTS pgcrypto;

--Inserir usuários para teste
INSERT INTO usuarios (username, password) VALUES
('admin', crypt('admin', gen_salt('bf'))), 
('user1', crypt('1234', gen_salt('bf')));