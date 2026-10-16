# 1º Trabalho da Disciplina de Desenvolvimento Web 3. 
### Desenvolvimento de um módulo financeiro para uma aplicação ERP de controle de cooperativas.

# Membros
- Paulo Junior Walbueno dos Santos
- Bruno de Morais Euzébio
- Leonardo Teixeira Silva

## Como executar
### Pré-requisitos
- Node.js
- Docker e Docker Compose
- Git

**1. Clonar o projeto e instalar dependências**
```
git clone https://github.com/paulojunior6886/1_Trabalho_DW3_Controle_Cooperativas_Financeiro.git
```
Navegue até o diretório raiz do projeto
```
cd 1_Trabalho_DW3_Controle_Cooperativas_Financeiro
```
Instale as dependencias do projeto
```
npm ci
```

**2. Configurar as variáveis de ambiente**
Na raiz do projeto crie um arquivo .env com as mesmas variáveis contidas no .env.example


**3. Subir os containers Docker (PostgreSQL e PgAdmin4)**
Na raíz do projeto execute
```
docker compose up -d
```
Depois que os containers subirem, acesse o PgAdmin pelo navegador

**URL:** http://localhost:8080/

**Credenciais**
- **email:** admin@example.com
- **senha**: admin
Dentro do PgAdmin acesse o banco de dados **"financeiro"** (conexão criada automaticamente no docker)
- **senha do banco:** postgres

**4. Criar as tabelas do banco de dados**
Execute o script do arquivo *backend/databaseConfig.sql* dentro do banco para criar as tabela

**5. Executar o projeto**
navegue até o diretório "backend" e execute o projeto
```
cd backend/
node app.js
```
Feito isso, em outro terminal, execute o frontend
```
cd frontend/
node app.js
```


