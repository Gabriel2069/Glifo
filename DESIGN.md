# Glifo

## Direção

Os glifos são o centro da marca: formas visíveis que participam da construção de sentido. As constelações oferecem uma imagem para a relação entre os sinais. O grifo é um glifo representativo, escolhido pelo jogo entre os nomes e pela figura mitológica; não resume a essência da Glifo. Universo celestial e editorial, com apresentação autoral conduzida por Gabriel Tadeu. A navegação deve demonstrar relações e cuidado, preservando leitura e acesso direto aos trabalhos.

## Fontes de verdade

- `src/styles/tokens.css`: cores, famílias, espaçamento de referência e easing.
- `src/data/site.ts`: autoria, contato, projetos e método. Portfólio e casos devem continuar utilizando esse conjunto de registros.
- `public/brand`: assinaturas finais fornecidas pelo autor, preservadas em seus arquivos originais.
- `public/images/nebula.webp`: recurso celestial criado para o site.
- `public/images/vision-board.webp`: prancha conceitual do projeto Glifo.

## Composição

Alternar narrativa, trabalhos, processo e autoria. Títulos editoriais em Almendra; informações em Manrope. O fundo favorece a leitura; a intensidade celestial se concentra nas passagens de expressão. Preservar as identidades de futuros clientes ao apresentar seus casos.

## Movimento

GSAP coordena entradas e deslocamentos. Canvas é responsável apenas pelas estrelas. A nebulosa tem movimento lento enquanto a aba está visível; as estrelas também param fora da abertura. Respeitar movimento reduzido e o controle de pausa. Não adicionar outro controlador à mesma propriedade.

## Estado do conteúdo

A vitrine apresenta Glifo, Tadeon Nexus, o editorial de Tessitura do Vazio, NexOS, Delfas Corpore e Christiano Tadeu. Os três pontos do atlas continuam sendo capítulos de Glifo. A coleção selecionada apresenta os outros cinco projetos, com abas e caminhos diretos para os casos. Acrescentar registros apenas quando houver material e informações confirmados.

O contato direto ainda precisa ser definido em `site.contact`. A ferramenta de preparação de mensagem copia uma proposta local e informa que não houve envio.

## Verificação

Build e checagem de tipos antes de publicar. Conferir a abertura, os links de caso, o menu móvel, as abas por teclado, a mensagem e o movimento reduzido. Testar os quatro pontos de largura: 320, 390, 768 e 1440 px. Definir domínio e URL canônica na publicação; a versão inicial não presume domínio.

## Refinamentos de navegação

O cabeçalho permanece acessível ao rolar, com superfície opaca quando sai da abertura. O atlas tem prévia equivalente por foco e ponteiro. A preferência de movimento é lembrada no navegador e considera a configuração do sistema. A mensagem pode ser editada antes de copiar. `details.css` concentra os estados desses refinamentos, sem duplicar tokens.

## Observatório

O céu funciona como instrumento de leitura. Constelação e emblema são estados alternáveis, com transformação de opacidade e conteúdo sempre acessível. As conexões se desenham ao longo do percurso; o atlas muda de expressão conforme o capítulo. A ampliação do detalhe usa um controle nativo de intervalo. O percurso lateral e a linha superior indicam localização. Rolagem livre, sem fixação de seções. Assinaturas finais sem filtros de cor.

## Caderno celeste e narrativa

A página agora alterna abertura, prólogo de leitura, trabalho, mito em cena, atlas, caderno horizontal, processo e detalhe. A imagem do arquivo celeste é uma ilustração conceitual; não substitui o emblema aprovado. O mito de origem é ficção autoral da marca, apresentado como tal. Seus capítulos e o método estão em site.ts.

A cena do mito permanece com CSS sticky durante a leitura, sem capturar a rolagem. GSAP revela palavras dentro de máscaras e acompanha a progressão da prosa por opacidade. Todo conteúdo existe e pode ser lido sem JavaScript. Movimento reduzido oferece uma composição estática; a pausa manual conserva o espaço e conclui as entradas para evitar palavras ocultas.

O caderno usa rolagem horizontal nativa no toque, arrasto com impulso limitado no mouse, setas e teclado. Arrastar não aciona os links; clicar continua navegando. O detalhe tem ampliação por controle nativo e deslocamento no mouse, com botão de recentrar. Não há rolagem automática de galerias ou bloqueio da leitura vertical.

A tipografia, os frames e os textos têm proprietários de animação separados. As imagens fornecidas não foram alteradas. A prancha anterior continua identificada como registro conceitual. Verificar narrativa, galeria, início de uma sessão com animação pausada e mudanças da preferência do sistema.

## Casos e materiais de portfólio

Cada caso conserva sua identidade e descreve o que foi construído, sem métricas comerciais inventadas. Tadeon e NexOS utilizam recortes das pranchas de interface dos próprios repositórios, identificados como estudos com dados ilustrativos. TdV apresenta as sete pranchas de capas fornecidas, com núcleo, divisões, encerramentos, Arden, expansões, Orbis Ardex e diagramas. Delfas preserva a assinatura rosa/azul do registro de identidade e distingue o estudo posterior de reposicionamento em roxo/dourado. Christiano apresenta as assinaturas fornecidas, os materiais comerciais e editoriais e o site público completo. A função da gestão interna é descrita sem expor dados de clientes. Não apresentar o canal profissional como site institucional da Belcar ou da Volkswagen.

ProjectVisual mantém a apresentação coerente, sem aplicar filtros ou recoloração aos projetos. Os dados em site.ts orientam o índice, a coleção da home e as rotas estáticas de casos. A página Glifo permanece própria; os demais casos usam [slug].astro. O filtro do índice não altera registros. No preview portátil, todas as rotas de caso devem ser incluídas. Preservar o nome do Worker glifo configurado pelo autor.

## Pranchas de identidade

As rotas /identidades/glifo/, /identidades/christiano-tadeu/ e /identidades/tdv/ são pranchas navegáveis, com assinaturas, paleta, tipografia, linguagem e materiais reais. src/data/identities.ts conserva os registros; cada prancha respeita as próprias fontes e cores. As páginas dos documentos fornecidos são reproduzidas como imagens selecionadas, sem alterar os originais ou apresentar diagramas de TdV como revisão de regras.

Ampliação em dialog nativo, zoom, navegação por setas e retorno de foco. As cores podem ser copiadas. As fontes locais incluem as respectivas licenças. A prévia portátil inclui todas as rotas e compartilha os recursos de estilo e script para evitar duplicação.

## Leitura e documentos de marca

A prosa narrativa entra por parágrafo, sem divisão em palavras ou gradação de luz dentro das frases. Títulos usam Almendra com maior escala e peso; a explicação usa Manrope, com parágrafos curtos e vocabulário concreto. O imaginário leva às decisões do trabalho, mantendo o site como exemplo dessas escolhas.

Links de identidade abrem um documento em dialog com iframe de mesma origem. A rota continua disponível diretamente e sem JavaScript. O parâmetro documento esconde a navegação geral dentro do documento. Escape fecha a imagem ampliada antes do documento, e o foco retorna ao link de origem. A abertura reúne essência, sinais, tipografia e paleta em uma composição de vision board.

## Descoberta e sequência dos casos

A abertura oferece acesso aos documentos e a home tem uma seção de três documentos com chamadas visíveis. Os casos seguem apresentação, entradas para identidade/construção/materiais, imagem principal, escopo, construção, aplicações e continuidade. As identidades mantêm a sequência essência, assinaturas, cor, tipografia, linguagem e aplicações; os elementos continuam próprios de cada marca. Christiano e Delfas aparecem primeiro na coleção da home.

A seleção de projetos, a representação do grifo, o atlas, o método e o caderno têm alternância temporizada. Ela pausa fora da tela, em aba oculta, com diálogos abertos, movimento reduzido, pausa global, ponteiro e foco. Interação manual suspende a alternância da seção até Retomar. As trocas automáticas reutilizam os controles, não movem foco e não anunciam a galeria continuamente.

## Atualização comercial e acervo

WhatsApp confirmado: https://wa.me/5562983010176. Serviços têm seção própria, entregas concretas e convites por área. A mensagem preparada abre o WhatsApp para revisão e envio pelo visitante. Não enviar mensagens automaticamente.

Almendra assume os títulos da Glifo, aproximando o repertório da escrita caligráfica e gótica; Manrope continua na leitura. Roxo #7042B3 e lavanda #B28CFF dão mais presença aos caminhos de ação. As identidades dos projetos preservam suas fontes e paletas.

Delfas utiliza a direção consolidada nos documentos v1.0 fornecidos, com Arapey e Manrope, roxo/ameixa/champanhe, estrela e brilho delicado. Acolher e Comissão Grão de Mostarda compõem um novo caso, com dois documentos de identidade próprios e materiais das apresentações fornecidas. Tan Nimbus e Marykate são descritas pelo manual; suas famílias não são substituídas por outra fonte decorativa apresentada como original.

Capas anteriores de TdV e Christiano foram restauradas, mantendo as galerias completas. Tadeon conserva a distinção entre estudo de interface e aplicativo conectado. A inspeção autenticada ficou bloqueada pelo navegador nesta etapa. Credenciais nunca entram no código, nas pranchas ou nos artefatos.

## Acabamento final

Cada documento define suas famílias de título e leitura no próprio artigo: Glifo Almendra/Manrope, Christiano Inter/Inter, TdV EB Garamond/Inter, Delfas Arapey/Manrope, Comissão Raleway e Acolher Leckerli One/Raleway. As assinaturas originais preservam os desenhos de letras. Fontes proprietárias não fornecidas não são simuladas.

Capas e materiais usam contain em trilhas de grid que podem encolher. O favicon usa a logo fornecida; o rodapé utiliza o símbolo oficial e oferece navegação, contato e autoria. O acabamento móvel prioriza leitura, alvos de toque e documentos sem excesso de altura.
