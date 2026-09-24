# ⬡ NEXUS // WIRE - Next-Gen Gaming Intel & Cyber Tech Network

> **NEXUS // WIRE** é uma plataforma de mídia digital futurista de alta fidelidade para jornalismo gamer, computação neural, hardware quântico e cobertura de eSports de elite.

Inspirado em estéticas de ficção científica cyberpunk, interfaces HUD militares e design system moderno baseado em glassmorphism e iluminação neon, o projeto oferece uma experiência visual imersiva e de altíssima performance para os leitores, aliada a um console de controle administrativo corporativo (**NEXUS // CONSOLE**) para operadores e editores gerenciarem todo o conteúdo em tempo real.

---

## ⚡ Identidade Visual & Design System Futurista

*   **Identidade**: `NEXUS // WIRE` (Next-Gen Gaming Intel).
*   **Abertura & Holograma**: Logotipo em nó hexagonal animado com aperture de pulso quântico.
*   **Paleta de Cores Cibernética**:
    *   **Obsidian Void (`#05070E`)**: Fundo escuro profundo com malha vetorial de coordenadas e grid estelar.
    *   **Electric Cyan (`#00F0FF`)**: Acentos primários de neon com emissão fotônica de 25px de glow.
    *   **Neural Violet (`#A855F7`)** & **Hyper Emerald (`#00FFA3`)**: Badges de status de telemetria e classificação de canais.
*   **Tipografia**:
    *   **Space Grotesk**: Títulos de alto impacto com proporções aerodinâmicas e tracking ajustado.
    *   **Space Mono**: Telemetria, coordenadas, latência de ping, relógios UTC/BRT e códigos de despacho.
*   **Microinterações & Componentes HUD**:
    *   **Marquee Ticker em Tempo Real**: Fita de notícias ao vivo com relógio digital integrado.
    *   **Hero & Radar Assimétrico**: Palco cinematográfico de destaque com radar lateral das 3 transmissões mais acessadas.
    *   **Command Palette (`⌘K` / `Ctrl+K`)**: Modal instantâneo de busca rápida por palavras-chave com atalhos de teclado.
    *   **Cards Holográficos**: Molduras com cantos chanfrados, medidores de tempo de leitura e telemetria de visualizações.
    *   **Alternador Orbital Solar / Void**: Suporte completo a Modo Escuro Cibernético e Modo Claro de Laboratório Sci-Fi.

---

## 🛠️ Pilha Tecnológica (Stack)

### 1. Frontend (`/frontend`)
*   **Framework**: [Next.js](https://nextjs.org/) (App Router, React 18, TypeScript).
*   **Estilização**: Tailwind CSS 3.4 com extensão de cores cyber e sombras neon customizadas.
*   **Ícones**: Lucide Icons integrados para consistência de interface de ficção científica.
*   **Segurança**: Sanitização rigorosa de HTML no cliente para prevenir injeções de script (XSS).

### 2. Backend (`/backend`)
*   **Framework**: [NestJS](https://nestjs.com/) (TypeScript) - Arquitetura modular corporativa.
*   **Banco de Dados**: SQLite com [Prisma ORM](https://www.prisma.io/) para integridade transacional.
*   **Autenticação**: Passport.js com estratégias JWT (JSON Web Tokens) e controle de permissões baseado em papéis (RBAC - Admin/Author).
*   **Uploads de Mídia**: Interceptação de arquivos via Multer para armazenamento de capas e imagens de alta resolução.

---

## 🚀 Como Executar Localmente

### Pré-requisitos
*   **Node.js**: v18.0 ou superior
*   **npm**: v9.0 ou superior

### Passo 1: Inicializar o Servidor API (Backend)
```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run start:dev
```
*A API estará ativa em: `http://localhost:8000/api/v1`*

---

### Passo 2: Inicializar o Portal & Console (Frontend)
```bash
cd frontend
npm install
npm run dev
```
*O portal público e o painel estarão acessíveis em: `http://localhost:3000`*

---

## 🔑 Credenciais do Console Operacional

Para acessar o **NEXUS // CONSOLE**:

*   **URL de Acesso**: `http://localhost:3000/admin`
*   **Operador (E-mail)**: `admin@nexuswire.gg` *(ou o alias legado `admin@coreloopnews.com`)*
*   **Chave de Acesso (Senha)**: `password123`

*(A tela de login possui um botão de 1 clique para auto-preenchimento das credenciais de demonstração).*

---

## 📁 Estrutura de Diretórios

```text
ggnews/
├── backend/
│   ├── prisma/
│   │   ├── dev.db         # Banco de dados SQLite local com dados de telemetria
│   │   ├── schema.prisma  # Esquema relacional Prisma (Users, Categories, Articles, Settings)
│   │   └── seed.ts        # Seed com dados futuristas do NEXUS // WIRE
│   └── src/               # Módulos NestJS (auth, articles, categories, settings, upload)
└── frontend/
    ├── src/
    │   ├── app/           # Rotas do Next.js App Router (Portal, Canais, Artigos e Console Admin)
    │   ├── components/    # Componentes HUD (Header, Footer, BreakingTicker, ArticleCard, SearchModal)
    │   └── lib/           # Cliente de API e funções utilitárias de formatação
    └── tailwind.config.js # Paleta cyber, sombras neon e animações de marquee
```

---

## 🌐 Endpoints da API

*   `GET /api/v1/articles` - Listar artigos publicados com filtros de pesquisa e canal.
*   `GET /api/v1/articles/featured` - Obter a matéria em destaque principal do radar.
*   `GET /api/v1/articles/:categorySlug/:slug` - Visualizar despacho completo do artigo.
*   `GET /api/v1/categories` - Listar canais ativos e contagem de transmissões.
*   `GET /api/v1/settings` - Obter configurações globais e metadados do kernel.
*   `POST /api/v1/admin/login` - Autenticar operador e emitir JWT.
*   `GET /api/v1/admin/dashboard` - Telemetria em tempo real do sistema.
*   `CRUD /api/v1/admin/articles` - Gerenciamento completo de transmissões.
*   `CRUD /api/v1/admin/categories` - Gerenciamento de canais e taxonomias.
*   `PUT /api/v1/admin/settings` - Atualização de metadados do portal.
