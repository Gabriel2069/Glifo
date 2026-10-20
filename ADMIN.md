# Espaço interno da Glifo

A rota `/admin/` é servida pelo Worker e não entra nas páginas estáticas ou nos menus públicos. O Worker entrega apenas a tela de entrada antes de validar uma sessão. As APIs exigem sessão; operações de escrita também exigem origem correspondente e JSON.

## Recursos

Projetos, contatos, tarefas, notas, links, 17 formulários, checklists por projeto, busca nos 154 modelos e atalhos para os documentos privados do Drive. Os dados começam vazios. A consulta ao Drive é por links, sem sincronização automática de respostas ou envio de mensagens.

`worker/library.json` contém apenas o catálogo de modelos e seus links. Dados preenchidos são armazenados no Durable Object `GlifoWorkspace`, com revisão para evitar sobrescrita por outra aba. As cópias JSON em Ajustes incluem os registros, sem arquivos do Drive.

## Publicação

`npm ci`, `npm run check`, `npm run build`, `npx wrangler deploy`.

O `wrangler.jsonc` conserva o Worker `glifo`, acrescenta o binding `WORKSPACE` e a migração `glifo-admin-v1`, que cria o armazenamento SQLite. A publicação deve executar Wrangler com esse arquivo de configuração, não apenas enviar `dist` como site estático. O namespace e o nome da classe devem permanecer estáveis para conservar os dados. Não remover a migração já aplicada.

A conta Cloudflare conectada precisa permitir publicar o Worker e criar o Durable Object. Não é necessário criar um banco externo. O hash inicial fica no servidor; a senha pode ser alterada em Ajustes, sem nova publicação. Uma alteração de senha encerra as outras sessões.

## Verificação

`npm run check`, `npm run build`, `npm test` para a vitrine.

Para o painel, defina `GLIFO_TEST_PASSWORD` no ambiente e execute `npm run test:admin`. O teste inicia Wrangler em armazenamento temporário, verifica autenticação, CSP, cookie, persistência entre sessões, formulários, checklist, cópia/restauração, conflito de versões, alteração de senha, limite de tentativas e quatro larguras. Não use o teste contra uma instância com registros reais.

Ao editar `worker/ui`, execute `npm run prepare:admin` e inclua `worker/views.mjs` no commit. O pacote gerado só é entregue após a validação no servidor. Nenhuma interface administrativa é copiada para `public`.
