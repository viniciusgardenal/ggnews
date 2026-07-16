# 🎮 GG News - Portal & Painel Administrativo Gamer

GG News é um portal de notícias, reviews e cobertura de eSports moderno, completo e de alta performance para a comunidade gamer. Desenvolvido com tecnologias modernas, o projeto oferece uma experiência fluida para os leitores e um painel de controle robusto para redatores e administradores gerenciarem o conteúdo em tempo real.

---

## 🚀 Arquitetura e Tecnologias

O ecossistema é dividido em duas aplicações principais que operam de forma integrada:

### 1. Backend (NestJS API)
*   **Framework**: [NestJS](https://nestjs.com/) (TypeScript) - Estrutura corporativa, escalável e baseada em injeção de dependência.
*   **Banco de Dados**: SQLite (ideal para desenvolvimento rápido e facilidade de deploy).
*   **ORM**: [Prisma ORM](https://www.prisma.io/) - Modelagem de dados segura e geração automática de queries eficientes.
*   **Autenticação**: Passport.js com estratégias JWT (JSON Web Tokens) e controle de permissões por papéis (RBAC - Admin/Author).
*   **Validação**: Class-Validator e Class-Transformer para sanitização rigorosa de entradas de dados.
*   **Uploads**: Interceptação de arquivos via Multer para upload de imagens de capa e logotipo do site de forma local.

### 2. Frontend (Next.js Portal & Admin)
*   **Framework**: [Next.js](https://nextjs.org/) (App Router, React 18, TypeScript).
*   **Estilização**: Tailwind CSS com sistema de temas dinâmicos via variáveis CSS injetadas.
*   **Design & Experiência do Usuário (UX)**:
    *   **Fonte Nunito**: Tipografia arredondada de altíssima legibilidade e visual aconchegante.
    *   **Cozy Dark Mode**: Modo escuro suave com tons quentes de marrom-café/chocolate (`#181614` e `#23201e`), reduzindo a fadiga visual.
    *   **Clean Light Mode**: Modo claro moderno em tons neutros de pedra/cinza (`#fafaf9` / Stone-50).
    *   **Destaque Laranja (Orange Accent)**: Nova cor de destaque vibrante aplicada a botões, links, focos e glows de neon.
    *   **Design Responsivo**: Otimização completa para dispositivos móveis, tablets e desktops.

---

## 🛠️ Funcionalidades do Projeto

### 📰 Portal Público
*   **Home Dinâmica**: Destaque principal para a notícia mais recente (Hero Section) e grid automático de últimas notícias.
*   **Navegação por Categorias**: Filtro e páginas exclusivas para categorias cadastradas (ex: Reviews, eSports, Lançamentos, Hardware).
*   **Página de Leitura Imersiva**: Suporte a formatação rica (HTML/Markdown) para exibir títulos, parágrafos, blocos de citação estilizados, imagens e vídeos incorporados do YouTube.
*   **Compartilhamento**: Botões rápidos para compartilhamento de matérias nas redes sociais.
*   **SEO Integrado**: Geração dinâmica de tags OpenGraph e Twitter Cards no lado do servidor para indexação perfeita nas redes.

### 🛡️ Painel Administrativo (`/admin`)
*   **Autenticação Segura**: Tela de login com sessão armazenada via JWT.
*   **Dashboard de Métricas**: Painel contendo contador de artigos totais, publicados, rascunhos, categorias criadas e lista rápida de matérias recentes.
*   **Gerenciador de Artigos (CRUD)**:
    *   Criação de notícias com geração de slug URL amigável automática a partir do título.
    *   Editor de conteúdo rico.
    *   Seleção de categoria dinâmica.
    *   Controle de status (Rascunho ou Publicado).
    *   Agendamento de data de publicação futura.
    *   Upload de imagens de capa via drag-and-drop ou seleção de arquivos.
*   **Gerenciador de Categorias**: Criação, edição e exclusão de categorias com geração automática de slug.
*   **Configurações Gerais**: Ajuste de metadados do site (Nome do site, descrição SEO), e-mail de contato, upload do logotipo e controle flexível de links no rodapé e redes sociais.

---

## 📁 Estrutura de Pastas

```text
ggnews/
├── backend/               # Código do servidor NestJS
│   ├── prisma/            # Schema, migrations e seeds do banco de dados
│   │   ├── dev.db         # Banco de dados SQLite local
│   │   ├── schema.prisma  # Definição das tabelas
│   │   └── seed.ts        # Dados demonstrativos (GTA V, Elden Ring, Worlds...)
│   └── src/               # Módulos principais (auth, articles, categories, settings...)
└── frontend/              # Código da aplicação Next.js
    ├── public/            # Favicon, assets públicos e imagens
    ├── src/
    │   ├── app/           # Rotas do App Router (Portal, Categoria, Slug e Admin)
    │   ├── components/    # Componentes reutilizáveis (Header, Footer, ArticleCard...)
    │   └── lib/           # Cliente HTTP da API (api.ts) e interfaces
    └── tailwind.config.js # Configuração do Tailwind CSS
```

---

## 🚀 Como Executar o Projeto Localmente

Certifique-se de ter o **Node.js (v18 ou superior)** instalado em sua máquina.

### Passo 1: Inicializar o Backend
Abra um terminal no diretório `/backend`:

1.  **Instalar dependências**:
    ```bash
    npm install
    ```
2.  **Gerar o Prisma Client**:
    ```bash
    npx prisma generate
    ```
3.  **Executar Migrations e criar o Banco de Dados SQLite**:
    ```bash
    npx prisma migrate dev --name init
    ```
4.  **Popular o banco com os dados de demonstração (Seed)**:
    ```bash
    npx prisma db seed
    ```
5.  **Iniciar a API de Desenvolvimento**:
    ```bash
    npm run start:dev
    ```
    *A API estará acessível em: `http://localhost:8000/api/v1`*

---

### Passo 2: Inicializar o Frontend
Abra um segundo terminal no diretório `/frontend`:

1.  **Instalar dependências**:
    ```bash
    npm install
    ```
2.  **Configurar variáveis de ambiente**:
    Certifique-se de que há um arquivo `.env.local` na raiz da pasta `/frontend` (se necessário, crie-o com base no `.env.example`):
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
    NEXT_PUBLIC_SITE_URL=http://localhost:3000
    ```
3.  **Iniciar o Servidor Next.js**:
    ```bash
    npm run dev
    ```
    *O portal e o painel estarão acessíveis em: `http://localhost:3000`*

---

## 🔑 Credenciais do Painel de Testes

Para acessar a área administrativa e gerenciar os artigos e categorias:

*   **URL de Acesso**: `http://localhost:3000/admin`
*   **E-mail de Login**: `admin@ggnews.com`
*   **Senha padrão**: `password123`

*(As credenciais de teste já vêm pré-carregadas na tela de login da aplicação para facilitar a validação).*

---

## 🔗 Principais Endpoints da API

*   **Públicos**:
    *   `GET /api/v1/articles` - Listar artigos publicados.
    *   `GET /api/v1/articles/featured` - Obter artigo em destaque.
    *   `GET /api/v1/articles/:categorySlug/:slug` - Visualizar artigo completo.
    *   `GET /api/v1/categories` - Listar categorias ativas.
    *   `GET /api/v1/settings` - Obter metadados do site.
*   **Privados (Requer Bearer Token no cabeçalho Authorization)**:
    *   `POST /api/v1/admin/login` - Autenticar usuário.
    *   `GET /api/v1/admin/dashboard` - Estatísticas rápidas do sistema.
    *   `GET/POST/PUT/DELETE /api/v1/admin/articles` - CRUD de artigos.
    *   `GET/POST/PUT/DELETE /api/v1/admin/categories` - CRUD de categorias.
    *   `PUT /api/v1/admin/settings` - Atualizar configurações.
    *   `POST /api/v1/admin/upload` - Enviar imagem de capa/logotipo.
