# flownotes

Um aplicativo de notas pessoais focado na produtividade de desenvolvedores, com design moderno, "dark mode", suporte a reordenação (drag and drop) e compartilhamento de notas.

## Funcionalidades

- **Autenticação**: Login e Registro via JWT.
- **Dashboard**: Visualize suas notas em um grid moderno com efeito blur.
- **Reordenação**: Arraste e solte (Drag and Drop) para ordenar suas notas.
- **Busca**: Filtre as notas por título ou conteúdo.
- **Compartilhamento**: Compartilhe notas com outros usuários cadastrados na plataforma através do e-mail.
- **Perfil**: Atualize seu nome ou sua senha.

## Tecnologias

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS v4, Shadcn UI, dnd-kit.
- **Backend**: API Routes do Next.js, jose (JWT).
- **Banco de Dados**: PostgreSQL, Drizzle ORM.
- **Infraestrutura**: Docker e Docker Compose.

## Como rodar o projeto localmente com Docker

1. **Pré-requisitos**: Certifique-se de ter o [Docker](https://www.docker.com/) e o `docker-compose` instalados em sua máquina.
2. Certifique-se também de possuir as portas `3000` (App) e `5432` (PostgreSQL) liberadas.

3. **Inicie os containers**:
   No diretório raiz do projeto, execute o comando:
   ```bash
   docker-compose up --build -d
   ```

4. **Prepare o Banco de Dados (Migrations e Seed)**:
   Acesse o container da aplicação e execute as migrations e o seed para criar o usuário de teste:
   ```bash
   docker-compose exec app sh -c "bun run db:push && bun run db:seed"
   ```

   *O seed criará a seguinte conta para testes:*
   - **E-mail**: `demo@flownotes.app`
   - **Senha**: `demo123`

5. **Acesse a aplicação**:
   Abra seu navegador em [http://localhost:3000](http://localhost:3000).

## Como rodar em ambiente de desenvolvimento (sem Docker para o App)

1. Instale as dependências: `bun install`
2. Suba o banco de dados usando Docker: `docker-compose up db -d`
3. Execute as migrations: `bun run db:push`
4. Popule o banco: `bun run db:seed`
5. Inicie o servidor: `bun run dev`
