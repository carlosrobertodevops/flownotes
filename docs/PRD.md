# Product Requirements Document (PRD)

## 1. Visão Geral
**Nome do Produto:** flownotes  
**Descrição:** Um aplicativo de notas pessoais focado na produtividade de desenvolvedores e criadores. Oferece um ambiente livre de distrações ("dark mode" nativo), organização visual (arrastar e soltar) e colaboração simples (compartilhamento por e-mail).

## 2. Objetivos
- Fornecer uma ferramenta rápida e intuitiva para captura de ideias e notas.
- Permitir organização fluida através de reposicionamento visual (Drag and Drop).
- Facilitar a colaboração pontual entre usuários cadastrados.
- Garantir a privacidade e segurança dos dados através de autenticação (JWT).

## 3. Casos de Uso
- **Desenvolvedores:** Documentar snippets, TODOs diários, ideias de arquitetura.
- **Criadores:** Rascunhar conteúdo, gerenciar listas de tarefas, planejar projetos.
- **Equipes pequenas:** Compartilhar pautas de reuniões ou rascunhos rapidamente.

## 4. Requisitos Funcionais
- **Autenticação:**
  - O usuário deve poder se registrar com nome, e-mail e senha.
  - O usuário deve poder fazer login com e-mail e senha.
  - A sessão deve ser gerenciada através de tokens JWT em cookies HttpOnly.
- **Gestão de Notas:**
  - O usuário deve poder listar suas próprias notas.
  - O usuário deve poder criar, editar e excluir notas.
  - As notas devem ter título e conteúdo.
  - As notas devem ser exibidas como cards no dashboard.
- **Organização e Busca:**
  - O usuário deve poder reordenar notas através de Drag and Drop. A ordem deve persistir no banco de dados.
  - O usuário deve poder buscar notas por texto presente no título ou conteúdo.
- **Colaboração:**
  - O usuário deve poder compartilhar uma nota com outro usuário registrado usando o e-mail.
  - O usuário que recebe a nota deve poder visualizá-la e editá-la.
- **Notificações:**
  - O usuário proprietário da nota deve ser notificado quando a nota for editada por um colaborador.
  - O usuário deve ser notificado quando uma nota for compartilhada com ele.
- **Perfil do Usuário:**
  - O usuário deve poder visualizar seus dados.
  - O usuário deve poder atualizar seu nome e alterar sua senha.

## 5. Requisitos Não-Funcionais
- **Design:** Tema escuro (Dark Mode) obrigatório, visual minimalista com efeitos de desfoque (blur) e grid de fundo. Uso de bordas arredondadas e sombras suaves.
- **Performance:** Respostas rápidas na interface (optimistic updates ou loaders claros).
- **Segurança:** Senhas com hash (SHA-256), proteção de rotas privadas no backend e frontend.

## 6. Métricas de Sucesso
- Quantidade de notas criadas por usuário ativo.
- Frequência de uso da funcionalidade de Drag and Drop.
- Número de notas compartilhadas entre usuários.
