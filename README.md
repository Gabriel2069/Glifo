# Glifo

Vitrine autoral celestial construída com Astro, TypeScript, GSAP, SVG e Canvas.

## Executar

Requer uma versão de Node compatível com o Astro indicado em `package-lock.json`.

```sh
npm ci
npm run dev
```

## Verificar e compilar

```sh
npm run check
npm run build
npm run preview
```

O resultado estático fica em `dist/`. Fontes e imagens são locais. Os avisos SIL OFL acompanham as famílias em `public/fonts/`.

## Conteúdo

`src/data/site.ts` mantém os dados de autoria, método e projetos. O portfólio reúne seis casos: Glifo, Tadeon Nexus, editorial de Tessitura do Vazio, NexOS, Delfas Corpore e Christiano Tadeu. Os capítulos Identidade, Linguagem e Presença no atlas continuam levando ao caso Glifo. Os demais trabalhos aparecem na coleção interativa e em rotas próprias.

Adicionar imagens e descrição confirmada para cada novo projeto. Nenhum cliente, resultado ou canal de contato foi inventado. O endereço de contato deve ser confirmado em `site.contact` antes da abertura comercial da vitrine. Atualmente o botão prepara uma mensagem para copiar; ele não envia mensagens.

## Publicar no Cloudflare

1. O projeto está preparado para o repositório `Gabriel2069/Glifo`. Manter o lockfile e não incluir `node_modules` ou `dist`.
2. Conectar o repositório ao Cloudflare Workers Builds.
3. Configurar `npm run build` como build e `npx wrangler deploy` como deploy.
4. A configuração `wrangler.jsonc` já aponta para os assets estáticos em `dist` e para a página 404.
5. Confirmar nome do Worker, domínio, canais de contato e URL canônica antes de apresentar a versão pública.

Também é possível publicar manualmente com `npm run deploy` depois da autenticação do Wrangler.

Nenhum domínio foi registrado ou associado por esta entrega. O domínio e os canais de contato ainda precisam ser definidos.

## Organização

- `src/layouts`: estrutura comum e metadados.
- `src/pages`: página inicial, índice de trabalhos, seis casos, índice de identidades, três pranchas e 404.
- `src/components`: elementos gráficos reutilizáveis.
- `src/styles`: tokens e estilos.
- `src/scripts`: comportamento e animação.
- `public`: fontes, identidade e imagens.
- `DESIGN.md`: direção de implementação.

## Continuação

Selecionar trabalhos reais e seus materiais, confirmar contato e domínio. Manter as decisões em `DESIGN.md` e os valores em `tokens.css` para evitar sistemas visuais concorrentes.

## Testes de interação

Depois do build, execute `npx playwright install chromium` e `npm test`. O workflow do GitHub confere tipos, compilação e interações em telas móveis e desktop. Os testes incluem navegação, método por teclado, rascunho editável, movimento reduzido, preferência persistente, alternância constelação/emblema e ampliação por teclado.

## Observatório e movimento

As assinaturas finais em `public/brand` são os arquivos fornecidos pelo autor, sem recoloração. O observatório alterna entre conexões e emblema; o atlas apresenta estados visuais por capítulo; o detalhe tem ampliação operável por teclado. As órbitas, os traços e a profundidade acompanham o percurso sem capturar a rolagem. O controle global e a preferência do sistema reduzem o movimento.

## Caderno celeste

O mito de origem tem três capítulos e uma cena persistente. `src/components/Archive.astro` contém quatro estudos autorais com arrasto, navegação por setas e teclado. A imagem `celestial-archive.webp` foi criada como ilustração conceitual, separada das assinaturas finais. A experiência mantém leitura sem JavaScript e alternativas para movimento reduzido.

## Identidades

O menu Identidades leva às pranchas de Glifo, Christiano Tadeu e Tessitura do Vazio. Os registros em `src/data/identities.ts` reúnem assinaturas, cores, tipografia, linguagem e materiais dos documentos fornecidos. Imagens podem ser ampliadas com zoom, setas e teclado; o fechamento retorna o foco à peça original. A gestão interna de Christiano é descrita pela função, sem publicar registros de clientes.

## Documentos de marca e leitura

Os links Abrir documento da marca apresentam a identidade em uma janela sobre a vitrine. Essência, símbolo, letras e cores formam a visão de conjunto; materiais reais continuam ampliáveis. A rota direta funciona sem JavaScript. Escape fecha primeiro a peça ampliada e depois o documento, devolvendo o foco ao link de origem.

A narrativa usa títulos serifados e prosa em Manrope, com parágrafos separados. A entrada é por parágrafo inteiro e não divide a leitura em palavras claras e escuras.

## Descoberta de trabalhos

A abertura leva aos documentos de marca e uma seção própria reúne suas entradas. Os casos oferecem acesso à identidade, à construção e aos materiais antes da imagem principal. TdV inclui as sete pranchas fornecidas; Christiano reúne nove aplicações. Christiano e Delfas aparecem primeiro na seleção da home.

As áreas de seleção alternam com o tempo quando estão visíveis, com controles locais para pausar e retomar. Interação manual mantém a seleção, e foco, ponteiro, movimento reduzido, diálogos e aba oculta suspendem a alternância.

## Serviços e contato

O WhatsApp confirmado do autor é 5562983010176. Os links preparam a conversa e a ferramenta de mensagem permite revisar antes de abrir o aplicativo. A vitrine apresenta cinco frentes com entregas definidas, além de sete casos e seis documentos de identidade.

Almendra e as novas famílias dos projetos são locais e acompanhadas das licenças OFL. As identidades de Delfas, Comissão e Acolher usam os materiais fornecidos; credenciais e dados internos não são publicados.
