# System Design Document (SDD)

## 1. Visão Arquitetural
A aplicação "flownotes" adota uma arquitetura Fullstack baseada no meta-framework **Next.js** (App Router). O backend e o frontend coexistem no mesmo repositório, facilitando o desenvolvimento, deploy e tipagem end-to-end.

## 2. Stack Tecnológica
- **Ambiente de Execução e Package Manager:** Bun (alta performance para install e build).
- **Frontend:**
  - Framework: Next.js 15 (React 19).
  - Estilização: Tailwind CSS v4.
  - Componentes Base: Shadcn UI (Radix Primitives + Tailwind).
  - Drag and Drop: `@dnd-kit` (core, sortable, utilities).
  - Ícones: `lucide-react`.
  - Notificações Visuais: `sonner` (toasts).
- **Backend:**
  - API: Next.js Route Handlers (`app/api/*`).
  - Autenticação: `jose` (JWT).
- **Banco de Dados:**
  - SGDB: PostgreSQL 15.
  - ORM / Query Builder: Drizzle ORM.
  - Driver: `postgres` (postgres.js).
- **Infraestrutura:**
  - Docker e Docker Compose para orquestração local (App e Banco).

## 3. Modelo de Dados (Schema)
O banco relacional gerencia 4 entidades principais:

- **users:** `id` (UUID), `name`, `email` (único), `password` (hash), `createdAt`, `updatedAt`.
- **notes:** `id` (UUID), `userId` (FK -> users.id), `title`, `content`, `order` (int para DND), `createdAt`, `updatedAt`.
- **shared_notes:** Tabela de junção para compartilhamento. `id`, `noteId` (FK), `sharedByUserId` (FK), `sharedWithUserId` (FK), `createdAt`.
- **notifications:** `id`, `userId` (FK -> users.id destino), `message`, `read` (booleano simulado via int 0/1), `createdAt`.

## 4. Fluxo de Autenticação
1. O cliente submete credenciais para `/api/auth/login`.
2. O servidor valida o hash (SHA-256 no MVP) e gera um JWT usando `jose`.
3. O JWT é assinado e anexado a um cookie HTTP-Only (`session`).
4. O frontend acessa dados protegidos enviando automaticamente o cookie.
5. Rotas de API validam o cookie via `getSession()` antes de retornar dados sensíveis.
6. Contexto React (`AuthProvider`) mantém estado global de autenticação no lado do cliente.

## 5. Fluxo de Drag and Drop
1. Usuário interage com o grip icon do card da nota.
2. `dnd-kit` gerencia o estado de array reordenado localmente no DOM para feedback imediato.
3. O frontend envia um POST para `/api/notes/reorder` com o array de IDs na nova ordem.
4. O servidor utiliza uma transaction (`db.transaction`) no Drizzle para dar um update em massa na coluna `order` de cada nota.

## 6. Estratégia de Deploy (Docker)
O repositório inclui um `docker-compose.yml` que levanta dois serviços:
- `db`: Imagem oficial do PostgreSQL.
- `app`: Imagem construída a partir do `Dockerfile` multi-stage usando `oven/bun:1`. Constrói a aplicação em modo *standalone* para reduzir tamanho da imagem em produção.
