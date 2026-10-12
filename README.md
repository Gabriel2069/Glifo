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

`src/data/site.ts` mantém os dados de autoria, método e projetos. A primeira versão contém o caso autoral da própria Glifo. Os capítulos Identidade, Linguagem e Presença no atlas são links para partes desse caso.

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
- `src/pages`: página inicial, lista de trabalhos, caso Glifo e 404.
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
