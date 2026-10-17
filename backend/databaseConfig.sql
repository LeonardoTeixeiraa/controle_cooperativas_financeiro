--Criar tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id BIGSERIAL NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    removido BOOLEAN DEFAULT FALSE,
    CONSTRAINT pK_usuarios PRIMARY KEY (id)
    );

--Criar extensão para criptografia de senha
CREATE EXTENSION if NOT EXISTS pgcrypto;

--Inserir usuários para teste
INSERT INTO usuarios (username, password) VALUES
('admin', crypt('admin', gen_salt('bf'))), 
('user1', crypt('1234', gen_salt('bf')));

--Criar tabela Contas
CREATE TABLE IF NOT EXISTS categorias(
    id BIGSERIAL NOT NULL,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL,
    removido BOOLEAN DEFAULT FALSE,
    CONSTRAINT pK_categorias PRIMARY KEY (id)
);

--Criar tabela de categoria
CREATE TABLE IF NOT EXISTS contas(
    id BIGSERIAL NOT NULL,
    descricao TEXT NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    data_vencimento DATE NOT NULL,
    pago BOOLEAN DEFAULT FALSE,
    categoria_id BIGINT NOT NULL,
    removido BOOLEAN DEFAULT FALSE,
    CONSTRAINT pK_contas PRIMARY KEY (id),
    CONSTRAINT fk_categoria FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);
