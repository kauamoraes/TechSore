# TechStore

E-commerce de tecnologia desenvolvido para prática de desenvolvimento Full Stack.

## Tecnologias

### Backend

* Node.js
* Express
* Prisma ORM
* PostgreSQL
* Supabase
* JWT
* bcrypt

### Frontend

* React / Next.js
* TypeScript
* Tailwind CSS

## Backend

O backend é responsável por:

* Autenticação de usuários
* Autorização de administradores
* Cadastro e gerenciamento de produtos
* Cadastro e gerenciamento de categorias
* Comunicação com o banco de dados

## Arquitetura

O backend utiliza uma separação baseada em:

```text
Route
  ↓
Controller
  ↓
Service
  ↓
Prisma
  ↓
PostgreSQL
```

### Responsabilidades

**Route**

* Define os endpoints da API.
* Define os middlewares utilizados.

**Controller**

* Recebe `req` e `res`.
* Valida dados básicos da requisição.
* Define status HTTP e respostas.
* Chama o Service.

**Service**

* Contém as regras de negócio.
* Executa operações no banco através do Prisma.
* Não trabalha diretamente com `req` e `res`.

## Autenticação

A API utiliza:

* bcrypt para hash de senhas.
* JWT para autenticação.
* Middleware de autenticação.
* Middleware de autorização para administradores.

Existem dois níveis principais de usuário:

```text
USER
ADMIN
```

## Produtos

O sistema possui CRUD de produtos:

```text
POST   /products
GET    /products
GET    /products/:id
PUT    /products/:id
DELETE /products/:id
```

Operações de criação, alteração e exclusão de produtos exigem autenticação e permissão de administrador.

## Categorias

O sistema possui categorias para organizar os produtos.

Relacionamento:

```text
Category 1 ──────── N Product
```

Um produto pertence a uma categoria, enquanto uma categoria pode possuir vários produtos.

## Banco de dados

O banco utiliza PostgreSQL hospedado no Supabase e o acesso é realizado através do Prisma ORM.

Principais entidades atuais:

```text
User
Product
Category
```

## Status do projeto

* [x] Configuração do backend
* [x] Banco de dados
* [x] Prisma
* [x] Autenticação
* [x] Autorização de administrador
* [x] CRUD de produtos
* [ ] CRUD de categorias
* [ ] Pedidos
* [ ] Itens dos pedidos
* [ ] Frontend
* [ ] Integração completa Frontend + Backend
