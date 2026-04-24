# Technical Specification (SPEC)

## 1. Estrutura de Diretórios (Next.js App Router)
```text
src/
├── app/
│   ├── api/           # Rotas Backend (Route Handlers)
│   ├── login/         # Página de Autenticação
│   ├── profile/       # Página de Perfil do Usuário
│   ├── globals.css    # Estilos globais (Tailwind + CSS Variables Customizadas)
│   ├── layout.tsx     # Root Layout (inclusão do AuthProvider e Background)
│   └── page.tsx       # Dashboard Principal (Lista de notas)
├── components/
│   ├── ui/            # Componentes Shadcn gerados (button, input, dialog, etc)
│   ├── auth-provider.tsx # Contexto de autenticação do cliente
│   └── note-card.tsx  # Componente isolado para o Card da Nota (com logica de drag)
├── lib/
│   ├── auth.ts        # Utilitários de criptografia, geração de token e cookies
│   ├── utils.ts       # Utilitários gerais (clsx, tailwind-merge)
│   └── db/
│       ├── index.ts   # Instância do banco Drizzle + Postgres
│       ├── schema.ts  # Definição das tabelas Drizzle
│       └── seed.ts    # Script para popular dados iniciais
```

## 2. Especificação da API REST

### Autenticação
- `POST /api/auth/register`
  - Body: `{ name, email, password }`
  - Response: `{ user }` ou `{ error }`
- `POST /api/auth/login`
  - Body: `{ email, password }`
  - Response: `{ user }` ou `{ error }`
- `POST /api/auth/logout`
  - Response: `{ success: true }`
- `GET /api/auth/me`
  - Headers: `Cookie: session=...`
  - Response: `{ user }` ou 401 Unauthorized
- `PUT /api/auth/profile`
  - Body: `{ name?, currentPassword?, newPassword? }`
  - Response: `{ success: true }`

### Notas
- `GET /api/notes`
  - Descrição: Retorna notas do usuário ordenadas por `order` asc, depois `createdAt` desc.
- `POST /api/notes`
  - Body: `{ title, content }`
  - Retorna: A nova nota criada com o `order` calculado como último elemento da lista.
- `PUT /api/notes/:id`
  - Body: `{ title, content }`
  - Lógica: Verifica se o usuário é dono ou tem acesso compartilhado. Se for compartilhado e alterado, insere notificação para o dono original.
- `DELETE /api/notes/:id`
  - Lógica: Remove primeiro referências na tabela `shared_notes` e depois remove a nota em si. Apenas o dono pode deletar.
- `POST /api/notes/reorder`
  - Body: `{ orderedIds: ["id1", "id2", ...] }`
  - Lógica: Roda um loop atualizando o campo `order` baseado no index do ID no array recebido.

### Compartilhamento & Notificações
- `POST /api/notes/:id/share`
  - Body: `{ email }`
  - Lógica: Encontra o usuário pelo email, cria registro em `shared_notes` e insere `notification` alertando que uma nota foi compartilhada.
- `GET /api/notifications`
  - Retorna últimas 20 notificações não lidas do usuário logado.
- `POST /api/notifications`
  - Body: `{ id? }` (opcional)
  - Lógica: Marca uma notificação específica como lida ou marca todas caso `id` não seja provido.

## 3. Componentes Chave

- **`AuthProvider`**: Usa o hook `useEffect` no carregamento para fazer o fetch de `/api/auth/me`. Intercepta navegações baseado na autenticação (ex: Redireciona para `/login` se não logado).
- **`NoteCard`**: Envolve as informações da nota em um Card UI. Utiliza `useSortable` do `@dnd-kit/sortable`. Requer um "handle" (ícone GripVertical) para ativar a ação de drag, separando o arrastar da interação de texto.
- **`Dashboard` (`app/page.tsx`)**: Gerencia o estado local das notas (`notes`) e da busca (`search`). Implementa o `<DndContext>` controlando o evento `onDragEnd` que faz o array swap local e dispara o request para persistência de ordem.
