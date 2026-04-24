# flonotes - App de Notas Pessoais

- Cria um app de notas pessoais. O usuario pode criar, editar e deletar notas.
- Cada nota tem titulo, conteudo e data de criacao. A pagina inicial lista todas as notas em cards.
- Clicar numa nota abre ela pra editar. Tem um botao de criar nota nova.
- Visual bonito e dark mode. Com bordar arredondada e sombra. Com backgroud/funto com linhas verticais r horizontais e blur.
- Criar tela de login e registro de usuario do lado direito, dividida com uma área de propaganda.
- O usuario deve se autenticar para acessar as notas.

## Detalhes do **visual** :

- Visual bonito e dark e light mode, com Login e cadastro de usuario modenos, com tela de login dividida e ela no lado direitom lado esrquerdo para o nome do projeto e propagandas com animações.
- Cores suaves e fontes modernas, background/fundo com linhas verticais, horizontais finais e com blur.
- Blur no fundo dos cards e dialogos, e todos os card e dialogos, azul brilante e com bordascom efeitos no hoover (azul brilhante) percorrento a bordas.
- Usar transparencia e blur para criar um efeito de profundidade, especialmente nos cards e diálogos.
- Animações suaves para transições de página, abertura de diálogos e interações com os cards, como hover e clique.

## Tecbologias e Funcionalidades Adicionais

- Usar: **bun, Next.js, zod, Drrzzle ORM, Postgres, ShadCn/UI e Tailwind**. Cria seed com 5 notas de exemplo.
- Criar um docker-compose.yaml para rodar o app e o banco de dados.
- Incluir instrucoes para rodar o app usando Docker.
- Usar JWT para autenticação. Incluir validação de formulario no frontend e backend.
- Adicionar funcionalidade de pesquisa para filtrar notas por titulo ou conteudo.
- Implementar pagina de perfil do usuario onde ele pode atualizar suas informacoes e mudar senha.
- Adicionar funcionalidade de compartilhamento de notas com outros usuarios.
- O usuario pode escolher compartilhar uma nota com outro usuario pelo email. O usuario compartilhado pode visualizar e editar a nota compartilhada.
- Implementar sistema de notificações para informar o usuario quando uma nota compartilhada for editada por outro usuario
- As notas podem sermovidas no tela por drag and drop para reordenar. A ordem das notas deve ser salva no banco de dados.
