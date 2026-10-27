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

## Organização e navegação · revisão de 20/10/2026

A busca do topo (Ctrl/Cmd+K) encontra destinos, projetos, tarefas abertas, notas e modelos. Setas percorrem resultados; Enter abre; Escape fecha. Ela não abre sobre um formulário em edição.

Projetos possuem ficha com ações, respostas, checklists, caderno e links vinculados. Uma tarefa ou nota criada nessa ficha já recebe o projeto. Coleções têm busca, filtros e ordenação; a visão geral apresenta contagens reais e próximas datas.

No celular, a navegação compacta se expande pelo botão Menu do espaço. Formato das cópias, controle de versões, sessões e permissões permanecem compatíveis. Nenhum namespace de armazenamento foi substituído.

Em CI, GLIFO_TEST_ISOLATED_BOOTSTRAP=true substitui o bootstrap apenas no checkout temporário, utiliza armazenamento descartável e restaura o arquivo ao terminar. Esse modo nunca deve ser utilizado contra a instância publicada.

## Glifo Studio · armazenamento e uso

A categoria **Criação → Glifo Studio** abre o módulo privado em `#studio`. Os endpoints `/api/admin/studio` e seus subcaminhos passam pela sessão existente; todas as escritas continuam exigindo origem correspondente e JSON. `/api/admin/studio/runtime` entrega o runtime sob demanda, com a mesma autenticação. CSP conserva nonce nos scripts e admite apenas blobs/dados locais para prévias de imagens e fontes.

`worker/studio-schema.mjs` contém o modelo e a validação compartilhada. `worker/studio.mjs` guarda cada estudo em `studio:study:<id>`, com revisão independente. Marcos usam `studio:version:<study>:<id>`. Metadados de arquivos usam `studio:asset:<id>` e seus bytes ficam em blocos binários separados de 64 KiB, nunca em base64 dentro de workspace. O transporte de upload é JSON limitado; o armazenamento final é binário.

Limites desta implementação: 60 estudos, 256 KiB de dados por estudo, 12 direções por estudo, 40 pranchas por direção, 200 objetos por prancha, complexidade geométrica limitada, 8 marcos por estudo e acervo de até 300 arquivos/32 MiB. Cada arquivo tem até 1 MiB. Imagens: PNG, JPEG e WebP; fontes: TTF/OTF/WOFF2 com confirmação de licença. SVG externo é recusado; o SVG produzido pelo laboratório é exportação vetorial real. Esses limites são da aplicação, não uma promessa sobre cotas ou cobrança ilimitada da conta Cloudflare.

Salvar usa If-Match por estudo. Autosave é agrupado e o texto de confirmação só muda após resposta do servidor. Em conflito, a cópia local continua disponível para JSON ou para um novo estudo. Rascunho de metadados fica na sessão da aba enquanto houver mudanças pendentes; após confirmação do servidor, ele é removido. A recuperação é explícita. Undo/redo é local e limitado; marcos nomeados são persistentes.

**Cópias:** o backup administrativo anterior continua no formato glifo-workspace-v1 e não inclui o Studio. Cada estudo tem um **backup completo ZIP**, com JSON, recursos referenciados e marcos. O ZIP de produção e o JSON de metadados são identificados como materiais diferentes. Restaurar pelo Studio cria outro estudo e remapeia os ativos, sem substituir dados existentes. Recursos soltos do acervo, ainda não vinculados a um estudo ou marco, não entram na cópia de um estudo.

**Exportação:** SVG, PNG, PDF, tokens CSS/JSON, apresentação, manual e pacote de produção funcionam no navegador. O PDF é rasterizado; não é descrito como PDF vetorial editável. A escala de PNG é limitada a 20 megapixels e 8000 px por lado. A4 e cartão usam equivalência de 96 px/polegada para mostrar medidas físicas. Sangria e área segura são parâmetros de revisão, não fechamento automático para gráfica. Incorporação de fontes no SVG é uma opção explícita e depende de licença.

`prepare:admin` também compila `worker/ui/studio/app.mjs` com esbuild para `worker/studio-runtime.mjs`. Inclua ambos os arquivos gerados nas alterações. `tests/studio-verify.mjs` integra a verificação privada e cobre estudos, vínculo, duas direções, cores, fontes, componente importado, editor, teclado, persistência, versões, exportações e restauração, conflito, isolamento e quatro larguras. Não execute esses testes contra registros reais.

Referências técnicas verificadas: Cloudflare Durable Objects /platform/limits e /api/sqlite-storage-api (SQLite existente, sem novo binding); PDF-LIB PDFDocument para composição local de páginas e imagens.

## Studio · fluxo rápido

O mesmo botão de busca do painel e Ctrl/Cmd+K abrem **Acesso rápido** dentro do Studio: ferramentas, estudos, direções e pranchas, com busca sem distinção de acentos, setas e Enter. Formulários abertos conservam prioridade. A página inicial permite buscar pelo estudo, direção ou projeto, filtrar e ordenar; a cópia de um estudo preserva a origem.

O editor mantém seleção, zoom e deslocamento por estudo/direção/prancha durante a sessão aberta. Copiar/colar reutiliza objetos entre pranchas da **mesma direção**, preservando vínculos sem misturar identidades; esse buffer é interno à aba e não lê nem substitui a área de transferência do sistema. Com foco na área de criação: Ctrl/Cmd+C copia, V cola, D duplica, G agrupa, Shift+G desagrupa, A seleciona e Escape limpa. Campos de texto mantêm os próprios atalhos; Ctrl/Cmd+S salva mesmo durante a escrita.

A barra contextual oferece PNG direto, duplicação e encaixe opcional em grade de 8 px. Duplicar uma prancha cria IDs e grupos novos; objetos travados resistem à remoção. Alinhar mantém as relações do conjunto e distribuir utiliza intervalos iguais entre as caixas, em ambos os eixos. A busca de recursos apresenta miniaturas privadas; importar uma lista HEX acrescenta cores sem apagar a paleta ou repetir códigos existentes. Exportações assíncronas bloqueiam cliques repetidos no próprio botão enquanto são processadas.

## Revisão do espaço interno · uso diário

A navegação móvel abre o mesmo menu em um dialog nativo, com foco contido, Escape, fechamento pelo fundo e retorno ao botão. O menu volta ao layout lateral ao ampliar a tela, sem duplicar controles. O comando de busca também permite iniciar projetos, tarefas, notas, contatos e links.

Coleções têm filtros rápidos por contexto e limpeza explícita. Os totais da visão geral abrem os registros correspondentes. Tarefas podem ser reagendadas para amanhã; exclusões de registros têm Desfazer por 12 segundos, respeitando o mesmo salvamento e controle de revisão. Isso não representa uma lixeira permanente. Notas e escopos longos possuem leitura integral antes da edição. Links enviados e respostas têm busca, estado e vínculo ao projeto.

Formulários em edição pedem confirmação ao descartar alterações e oferecem Ctrl/Cmd+Enter para enviar. Briefings internos possuem navegação por seção e contagem de campos obrigatórios; checklists mostram o avanço e permitem concentrar a leitura nas pendências sem retirar campos do salvamento. As respostas originais de clientes continuam protegidas contra edição.

A ficha do projeto abre o Studio no estudo associado; se não houver um estudo ativo, oferece a criação com nome e vínculo preenchidos. O Studio mantém o estado de abertura do inspetor e das ferramentas por prancha. Desfazer/refazer refletem a existência real de histórico, e os limites de direções, cores e componentes são conferidos antes das operações correspondentes. Não houve alteração de namespaces, registros ou autenticação.

`admin-kit.mjs` concentra navegação e instrumentos de interface; `admin-refinements.css` possui o acabamento. `prepare:admin` compila o cliente administrativo e o Studio em bundles privados, mantendo a entrega sob sessão. O novo teste `admin-refinements-verify.mjs` integra o fluxo administrativo isolado; não o execute contra registros de produção.

Consultas periódicas conferem novamente a versão e o estado de edição ao retornar. Uma resposta de leitura iniciada antes de um salvamento não substitui os dados mais recentes da aba. O teste de revisão simula esse atraso enquanto uma tarefa é criada.
