# Portal Gamer GG News (NestJS + Next.js)

Este é um portal de notícias de games completo contendo:
1.  **Backend (NestJS):** Uma API RESTful em TypeScript com Prisma ORM e SQLite.
2.  **Frontend (Next.js):** Aplicação pública e Painel Administrativo em React, TypeScript e Tailwind CSS.

---

## Estrutura do Repositório

*   `/backend` – Servidor NestJS exposto em `http://localhost:8000/api/v1`.
*   `/frontend` – Aplicação Next.js (Portal e Admin) rodando em `http://localhost:3000`.

---

## Como Executar Localmente

### Passo 1: Configurar e Rodar o Backend
Abra um terminal na pasta `/backend`:
1. Instalar pacotes:
   ```bash
   npm install
   ```
2. Executar as migrations do banco de dados (SQLite):
   ```bash
   npx prisma migrate dev --name init
   ```
3. Popular o banco com dados demonstrativos:
   ```bash
   npx prisma db seed
   ```
4. Iniciar o servidor de desenvolvimento:
   ```bash
   npm run start:dev
   ```

### Passo 2: Configurar e Rodar o Frontend
Abra outro terminal na pasta `/frontend`:
1. Instalar pacotes:
   ```bash
   npm install
   ```
2. Duplicar e renomear o arquivo de variáveis `.env.example` para `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```
3. Iniciar o servidor do Next.js:
   ```bash
   npm run dev
   ```

---

## Acesso Administrativo (/admin)
*   **Link:** `http://localhost:3000/admin`
*   **E-mail:** `admin@ggnews.com`
*   **Senha:** `password123`
