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

Capas e materiais usam contain em trilhas de grid que podem encolher. O favicon usa o emblema do grifo fornecido; o rodapé utiliza o símbolo oficial e oferece navegação, contato e autoria. O acabamento móvel prioriza leitura, alvos de toque e documentos sem excesso de altura.

Assinaturas nominais usam public/brand/logo.png, inclusive rodapé, atlas, estudo de tela e abertura do documento Glifo. Menções editoriais ao nome continuam como texto legível. public/brand/symbol.png é o emblema do grifo e ocupa o favicon e o ícone de tela inicial.

## Vitrine e acabamento de interação

A página de trabalhos começa por Christiano Tadeu em composição ampla, seguida por Delfas e pelos projetos autorais. Cartões conservam as capas aprovadas e enquadramento contain. Tipos, numeração e chamadas organizam a exploração. Filtros aplicam o conjunto sem atraso semântico e usam FLIP para conservar posições; trocas rápidas cancelam a animação anterior. Pausa e movimento reduzido concluem a troca imediatamente.

O hover ilumina o frame com o acento do projeto. A imagem não recebe distorção ou ampliação que corte o material. Foco apresenta um estado equivalente; no toque, os caminhos permanecem visíveis. As entradas pertencem ao interior dos cartões, enquanto o contêiner tem um único dono para a transição dos filtros.

## Capas e documento conjunto

Acolher e Comissão Grão de Mostarda compartilham a capa de portfólio e a rota /identidades/acolher/. O documento reúne duas apresentações completas, com IDs prefixados e famílias locais, sem misturar as paletas. A rota individual da Comissão permanece disponível. Christiano usa a assinatura central em fundo azul contínuo. TdV conserva a capa no centro e cresce no hover do frame ou foco do link, respeitando pausa e movimento reduzido.

O período confirmado de Acolher e Comissão Grão de Mostarda é 2025–2026. As capas do índice de identidades e da seção de documentos usam trilhas minmax(0,1fr), com imagens contidas em ambas as dimensões para evitar expansão por tamanho intrínseco.

## Ritmo e continuidade

Alternâncias: constelação 4,2 s, projetos 6,5 s, atlas 5,2 s, processo 7,5 s e caderno 8 s. Ponteiro sobre texto não congela uma seção; controles, foco, uso manual, diálogos e preferência de movimento mantêm as pausas. O indicador reinicia junto com o temporizador.

Projetos entram com uma passagem curta no frame e na legenda, cancelável por nova seleção ou pausa. Navegação nativa usa transições entre documentos como melhoria progressiva. Documentos abrem com escala discreta; estrelas próximas ao ponteiro e pontos luminosos nas órbitas respondem sem loops adicionais.

## Cenas conectadas e estudos interativos · outubro de 2026

Referências verificadas: Apple AirPods Pro (cenas amplas e galeria com pausa), Linear (demonstrações no contexto da página), Raycast /new (foco, perspectiva e materialidade). O globo da Stripe, documentado em 2020, inspira relações exploráveis; não é tratado como observação da homepage atual. As linguagens das marcas não são copiadas.

O instrumento dos glifos acompanha os três capítulos existentes do mito. Pontos, conexões e assinaturas têm propriedade de animação única em experience.ts; a geometria dos arquivos oficiais é preservada. Seleção manual suspende o acompanhamento até Voltar a acompanhar a leitura. No celular, o instrumento precede a prosa com controles visíveis, sem ocupar a tela durante todos os parágrafos.

A constelação de trabalhos conecta os seis projetos reais da seleção. Botões selecionam a prévia, enquanto links abrem os casos e documentos. Alternância de 5,4 segundos usa o controlador comum de pausa, visibilidade e interação. No celular, a mesma exploração vira uma grade de pontos com nomes e alvos de toque.

TdV possui uma mesa editorial das sete pranchas completas, com intervalo nativo, miniaturas e ampliação. Trocas rápidas concluem/cancelam a transição anterior; não há reprodução automática para interromper a comparação. A galeria original permanece disponível. Não inventar camadas de construção ou recortes que não foram fornecidos.

Os documentos mantêm a sequência estabelecida e ganham amostras editáveis das fontes locais e fundos experimentais com a paleta real. A composição de cor é uma amostra tipográfica, separada da assinatura oficial. O cálculo de luminância escolhe texto claro/escuro. Campos são locais e não enviam nem persistem o texto digitado. Documentos conjuntos conservam IDs prefixados e escopo independente de interação.

CoverTransition registra os eventos nativos de navegação cedo, selecionando apenas uma capa visível por passagem. O nome de transição é limpo ao terminar e no retorno do cache; a rota e o histórico continuam nativos. Sem suporte, pausa ou movimento reduzido, a navegação funciona normalmente. No preview portátil entre iframes, a continuidade nativa entre documentos não é reproduzida.

Serviços agora levam também a um exemplo real do acervo, ligando a oferta ao trabalho que a demonstra.

## Navegação e entrada pela bio

A navegação do computador mantém um conjunto compacto de destinos, com estado da rota ou capítulo. Menu abre um dialog nativo em qualquer largura; no celular, o painel ocupa a tela e prioriza os cinco caminhos e o contato. Inércia do conteúdo ao fundo, Escape, retorno de foco e pausa das alternâncias são tratados pelo dialog e pelo controlador existente. CSS coordena abertura e fechamento; navegação fecha imediatamente.

Todas as setas de apresentação usam Icon.astro, em SVG monocromático, com traço e geometria comuns. Ícones decorativos ficam fora do nome acessível; comandos preservam rótulos textuais. Símbolos de linguagem celestial continuam nas ilustrações.

O convite da vitrine retoma a formulação já presente nos casos: “Há outros sinais a desenhar.”

/links/ é uma entrada pública e discreta para o Instagram: WhatsApp, site, trabalhos, documentos e serviços. Não aparece nos menus e possui noindex,follow. É descoberta pelo endereço, sem promessa de acesso restrito. Contatos seguem site.ts; não acrescentar usuário de Instagram ou domínio que não foram confirmados.

## Lema e campanha inicial

Lema aprovado: “Há outros sinais a desenhar. O seu pode ser o próximo”. site.motto é a fonte de verdade; Motto.astro organiza suas duas frases na vitrine, no contato e na entrada da bio. O rodapé usa o texto integral.

A página de links assume a forma de carta celeste. Ícones SVG distinguem conversa, observatório, acervo, documento e serviços. Campo celeste, escala do emblema, órbitas e amostra de três projetos dão continuidade à marca. A decoração fica contida no viewport, sem alterar os alvos de toque. As entradas CSS são finitas e param com a preferência de movimento. Os caminhos continuam diretos, fora dos menus e com noindex.

O campo stellar-field.webp foi criado como textura celeste para esta etapa. A mesma imagem participa das artes de lançamento. A campanha tem treze páginas em três carrosséis, com Almendra/Manrope, assinaturas oficiais, materiais reais do portfólio e uma linha de constelação que mantém os pontos de entrada e saída entre páginas. A composição editorial e o texto são determinísticos, sem redesenho dos logos.

## Composição de celular · refinamento de outubro

O desktop mantém suas grades e proporções. Até 760 px, a abertura agrupa os caminhos secundários em duas colunas e contém o observatório em uma área menor, sem sobrepor legenda e controles. A prosa comercial ganha escala de leitura; títulos e convite final são dimensionados para a largura disponível.

Serviços e documentos usam faixas horizontais nativas, com o próximo cartão parcialmente visível, botões de 44 px, posição e limites. Sem JavaScript, o arrasto e os links continuam funcionando e os controles não aparecem. Teclado pode percorrer a faixa pelas setas quando ela está em foco. As demais galerias conservam seu comportamento próprio.

Na seleção de projetos, a aba ativa permanece visível sem deslocar a página verticalmente. Arrasto horizontal deliberado sobre a capa muda o projeto; o gesto vertical conserva a rolagem. O gesto manual pausa a alternância. O link da capa continua abrindo o caso quando tocado, sem navegar ao concluir um arrasto.

Menus e documentos acompanham a altura dinâmica disponível e as áreas seguras. O fechamento do menu permanece acessível ao rolar; imagens ampliadas têm controles maiores. Movimento reduzido conserva o acesso e conclui as passagens imediatamente.

## Espaço interno · biblioteca e organização

`/admin/` é uma aplicação privada separada da vitrine. Usa as assinaturas, Almendra e Manrope, com pouca decoração e leitura estável. A navegação lateral se torna uma faixa horizontal no celular; formulários abrem em dialog nativo. As transições são curtas e dispensadas com movimento reduzido.

O painel consulta o catálogo de 154 artefatos, com links para os cadernos, controles e kits no Drive. Projetos, contatos, tarefas, notas, respostas e checklists vivem no Durable Object, nunca nos arquivos públicos do site. As telas começam vazias e não apresentam dados ilustrativos como trabalho real. Conflitos de versão preservam a cópia local e pedem exportação/recarregamento.

## Camadas espaciais e espaço de trabalho · 20 de outubro de 2026

Referências consultadas: Aether 1 e o estudo publicado por OFF+BRAND (https://aether1.ai/ e https://www.itsoffbrand.com/our-work/aether1), Alche (https://alche.studio/), Seasats (https://seasats.com/) e Nfinite Paper (https://nfinitepaper.com/). As fontes sustentam a direção de composição por cenas, exploração e explicação de camadas; não são evidência de inspeção quadro a quadro ou tempos medidos. Aether documenta modelos 3D e WebGL; a Glifo utiliza uma composição 2,5D própria.

A abertura trabalha com órbitas em planos de profundidade. O emblema original e a constelação conservam seus arquivos e controladores; lens-assembly possui apenas a perspectiva do conjunto. Ponteiro fino e controle nativo de ângulo oferecem caminhos equivalentes. Pausa global e preferência do sistema tornam a composição estática; nenhuma rolagem é interceptada. A passagem Ideia / Forma / Presença mantém palavras completas, sem fragmentar a prosa.

spatial.ts e spatial.css controlam somente as novas camadas: perspectiva, luz de capítulos e reflexão discreta nas capas. Não transformam a imagem original nem disputam suas propriedades com controladores anteriores. Ponteiro responde apenas na área ativa; não há um novo loop ambiente. Galerias, mapa, serviços, casos e documentos mantêm caminhos diretos e enquadramentos aprovados.

O painel mantém dados, autenticação, sessões e armazenamento existentes. A visão geral apresenta registros reais: ações, etapas, projetos, próximos contatos e decisões. Busca global por nome, assunto ou código abre destinos e registros existentes. A ficha do projeto reúne tarefas, respostas, checklists, notas e links pelo projectId. Filtros e ordenação são transitórios. Ctrl/Cmd+K, setas, Enter e Escape estão disponíveis; no celular, a navegação pode se expandir em grade.

A luz do painel é contida, o texto permanece estável e o indicador de navegação possui um controlador CSS. Mestres do Drive continuam privados e com os mesmos links. Não há nova sincronização automática.

## Direção editorial · revisão estrutural de outubro de 2026

A home passa de uma sequência de demonstrações da própria Glifo para abertura, exposição dos seis projetos, prólogo, mitologia, serviços, documentos, processo, autoria e contato. O atlas de capítulos, o caderno arrastável e a anatomia ampliável vivem no caso /trabalhos/glifo/. A constelação de projetos vive no índice /trabalhos/. Os recursos continuam navegáveis, sem repetir três apresentações do mesmo acervo na home.

`editorial.css` possui as composições das rotas `.editorial-home`, `.work-directory`, `.case-study` e `.identity-directory`: abertura tipográfica em planos, exposição com arte e legenda, spreads assimétricos, capa panorâmica dos casos e gabinete de identidades. Os estilos de componente conservam materiais, controles e fontes de cada marca. Os títulos da Glifo usam Almendra, sem substituir a assinatura oficial. Imagens reais permanecem em contain. No celular, ações e leitura entram no fluxo, tabs precedem a exposição e os spreads viram composições de uma coluna.

`editorial.ts` possui apenas as máscaras dos novos contêineres: abertura da exposição, expansão lateral da capa de caso, entrada das placas de identidade e passagem tipográfica. Não escreve no transform de imagens nem dos elementos que já têm um proprietário. As máscaras concluem com pausa/movimento reduzido, e o conteúdo permanece completo sem JavaScript. Rolagem é nativa.

Referências consultadas em navegador nesta etapa: Seasats mostrou abertura quase integral em imagem, navegação lateral e transição para produto isolado. Nfinite Paper mostrou enquadramento material em tela cheia e texto em escala ampla; ao avançar, a experiência apresentou erro de renderer neste navegador. Aether1 exibiu a cena circular inicial e a estrutura acessível, mas não concluiu a cena principal. Alche forneceu a estrutura de capítulos/portfólio no DOM, porém seu canvas permaneceu preto. Assim, não se atribui observação completa dos movimentos de Aether/Alche nem da sequência posterior de Nfinite. A adaptação trabalha hierarquia, escala e continuidade com o acervo próprio; não copia layouts nem recursos dessas marcas.

## Serviços, cartões e gestos · 20 de outubro de 2026

Os serviços passam a uma lista de detalhes nativos. Cada frente reúne o que pode ser entregue, um exemplo real e o contato com mensagem preparada. O exemplo acompanha a seleção no desktop e entra como uma prévia compacta no celular. Não existe alternância automática durante a leitura. Sem JavaScript, os detalhes e os links continuam disponíveis; com JavaScript, somente uma frente permanece selecionada. A transição de altura é cancelável, conclui com pausa e preserva o foco. As imagens de site e conteúdo comercial vêm dos materiais confirmados em site.ts.

ProjectCard.astro define o contrato dos sete cartões do índice: capa 4:3 em contain, número e período, título, resumo integral e uma chamada de ação. A grade conserva esse formato ao filtrar. As regras antigas que alteravam dimensões por posição foram removidas; work-card.css possui a composição. A capa central de TdV, as duas assinaturas de Acolher/Comissão e os tratamentos de Christiano/Delfas foram preservados.

A navegação ganha uma única luz que percorre os itens por foco ou ponteiro e retorna à rota atual. CSS possui sua transição; o script só mede as posições nos eventos necessários. As ações compartilham borda, canto luminoso, seta e estados de pressão, com alvos e foco mantidos. Movimento reduzido e pausa concluem as passagens sem esconder conteúdo.

## Processo, portas e leitura no celular · 21 de outubro de 2026

A orientação atual substitui os controles de pausa manual descritos nas etapas anteriores. Não há botão global de reduzir movimento nem botões de pausar/retomar alternâncias. A preferência do sistema é a única origem de `motion-paused`; o valor antigo em localStorage é ignorado. Alterar a configuração do aparelho nos dois sentidos atualiza os efeitos. Seção fora da tela, aba oculta e diálogo aberto continuam suspendendo os temporizadores.

O controlador comum concede seis segundos após clique, foco ou teclado, então retoma o período normal da seção. Ponteiro e foco não mantêm pausas permanentes. Trocas automáticas não movem foco nem anunciam continuamente a galeria. O traço de tempo é decorativo. O instrumento dos glifos volta ao capítulo da leitura oito segundos depois de uma seleção manual.

Process.astro e process.css possuem o percurso Ideia/Forma/Presença, com coordenadas ligadas, texto integral e pontos de cada etapa. GSAP possui uma única transição cancelável nos interiores dos painéis; sem JavaScript, as três etapas ficam disponíveis. O menu nativo ganha escala editorial, entradas escalonadas, acervo real e contato próprio. Escape, fechamento, contenção e retorno do foco permanecem disponíveis. O contato do cabeçalho também aparece no celular.

A entrada /links/ reúne assinatura, lema, contato principal, quatro caminhos e três projetos. bio-celestial.css possui a composição; os elementos decorativos ficam contidos no quadro, sem recortar as capas. A home móvel reduz a altura do observatório e das abas, mantém ações em duas colunas e amplia a leitura das descrições e da prosa. Não alterar as capas aprovadas nem o espaço privado nesta etapa.

## Acabamento de controles e espaço interno · 21 de outubro de 2026

A entrada e o painel privado usam o mesmo emblema oficial da vitrine, /brand/symbol.png, como favicon PNG e ícone de tela inicial. prepare-views.mjs é a fonte do cabeçalho das duas telas; views.mjs é regenerado a partir dela. A cor do navegador permanece noturna. A exibição da senha conserva um alvo de toque de 44 px.

Os controles de fechar compartilham o SVG da navegação. Documentos usam uma barra de altura natural e iframe flexível, para títulos longos caberem no celular. O foco começa no fechamento do documento ou da imagem ampliada e retorna ao material de origem. A rolagem do fundo fica contida enquanto um dialog está aberto; a reserva da barra de rolagem no desktop evita deslocamentos da composição.

O formulário de contato mantém o fechamento alcançável durante a leitura, confere o conteúdo depois de remover espaços nas extremidades e leva o foco à mensagem preparada. Editar retorna ao campo da ideia, preservando o rascunho. O envio continua dependendo da ação no WhatsApp. Rodapé, atalhos dos casos, documentos e controles recebem respostas de foco, ponteiro e pressão proporcionais, com transições dispensadas pela preferência de movimento. Imagens com nome adjacente não repetem esse nome na descrição acessível.

## Catálogo por serviço e formulários de projeto · 21 de outubro de 2026

A biblioteca reúne os 154 materiais existentes com explicação, situação de uso e orientação prática. catalog.mjs possui a classificação e os contextos: cinco frentes de serviço, documentos transversais e gestão do estúdio. Os grupos nativos ficam recolhidos na entrada e abrem ao filtrar; a pesquisa considera código, assunto, situação e preparação. Os modelos e suas permissões originais no Drive permanecem preservados.

O painel cria links individuais para os 17 formulários existentes, com referência privada, projeto, recado público e validade de 7, 30 ou 90 dias. /responder/<token> usa assinatura e emblema oficiais, Almendra e Manrope, composição celestial de duas colunas no desktop e leitura contínua no celular. Há etapas, campos condicionais, revisão, edição e recibo. O rascunho fica na sessão da aba e só é enviado por ação explícita; conteúdo e erros usam texto seguro. Movimento de entrada é finito e dispensado pela preferência do sistema.

O Durable Object existente guarda os convites e grava cada resposta atomicamente no espaço privado, com a definição do formulário naquele momento. O link permite uma resposta; pode vencer ou ser encerrado, e não revela respostas anteriores nem dados internos. A versão do espaço impede sobrescritas. Ao receber somente novas respostas externas durante uma edição, o painel reconcilia as duas alterações; conflitos entre edições internas preservam o aviso e a exportação. As respostas recebidas são lidas sem modificar o conteúdo original, com vínculo ao projeto, indicação de leitura e exportação JSON. A consulta periódica respeita edições e diálogos abertos.

## Glifo Studio · 26 de outubro de 2026

O painel recebe um campo de desenho celeste: meridianos, constelação e grade discreta, contidos atrás da leitura. São geometrias estáticas, sem um novo loop de animação. A assinatura oficial e o emblema permanecem intactos. A moldura do Studio usa Almendra/Manrope e os acentos já aprovados; as pranchas usam exclusivamente as cores, fontes e componentes do estudo. Um estudo novo começa com uma base neutra editável, sem impor a identidade da Glifo ao cliente.

A categoria Criação leva a #studio. Estudos independentes ou associados a projetos abrem em Fundação, Moodboard, Cores, Tipografia, Formas, Identidade, Pranchetas, Aplicações, Sistema Visual, Validação, Comparação, Apresentação, Exportação e Experimentos. Direções são alternativas; marcos nomeados são versões históricas. A navegação mantém o estudo e não força ordem de trabalho. O menu global, as tarefas, o caderno e os modelos são reutilizados; respostas originais dos briefings são consultadas sem alteração.

No desktop, navegação compacta, área central e inspetor recolhível organizam o editor. Abaixo de 850 px, as ferramentas viram uma faixa horizontal. No celular, ações secundárias ficam em um menu próprio e o inspetor vira um painel inferior recolhível; salvar e exportar continuam diretos. Trocar ferramenta não desloca a página para acompanhar um botão da coluna. O editor movimenta objetos em coordenadas da prancha e atualiza seus transforms durante o gesto; teclado e campos numéricos oferecem alternativas de precisão. Não há SVG arbitrário executável importado.

Cores em sRGB têm papéis e identificadores próprios, contraste calculado por luminância relativa e exportações. Fontes locais e fontes autorizadas importadas podem definir sete papéis tipográficos. A conferência de cmap cobre fontes TTF/OTF compatíveis; formatos não analisáveis são apresentados como conferência visual pendente. Não se aprova cobertura de caracteres com base apenas no carregamento da fonte. Elementos geométricos continuam vetoriais. Componentes podem acompanhar mudanças da direção ou ficar fixados em uma cópia da identidade na prancha.

O runtime do Studio só é solicitado por uma sessão autenticada quando a ferramenta é aberta. Seu código é organizado em modelo/validação, persistência, interface, editor, laboratórios, visualização e exportação. Nenhum arquivo do Studio é colocado em public. O Durable Object existente guarda os estudos e arquivos em chaves separadas, com revisão por estudo. A coleção administrativa anterior e sua revisão não mudam. Não há contratação de R2, IA, API paga ou outro provedor.

SVG usa objetos reais de composição e imagens incorporadas; PNG usa suas dimensões, com limite de memória; PDF é composto dessas pranchas rasterizadas em resolução controlada, sem captura da interface. A apresentação possui sequência editável e o manual técnico usa especificações do sistema. Arquivos de impressão precisam de conferência de produção; não se inventam valores Pantone, CMYK ou aprovação de fonte. O backup ZIP do estudo inclui recursos referenciados e marcos. A restauração valida os arquivos, cria novos identificadores e conserva os estudos e os registros anteriores.

## Studio · instrumentos à mão

A busca única do painel assume o contexto criativo no Studio. A tela de estudos combina busca e filtros compactos; o editor mantém uma barra local com seleção, clipboard e PNG direto. O estado de cada área de criação é retomado sem reiniciar o enquadramento. No celular, a barra usa três colunas, com PNG em uma ação maior; propriedades continuam no painel inferior. Busca e recursos usam dialogs nativos, navegação de teclado e miniaturas reais, sem animações que atrasem operações repetidas.

## Admin · leitura, decisão e continuidade

O quadro celestial permanece estático e discreto. As ações primárias recebem destaque, enquanto excluir e ler detalhes usam um tratamento secundário. Estados possuem acentos próprios; datas vencidas e prioridades podem ser distinguidas sem tomar o lugar dos títulos. A visão geral reúne a próxima ação, o acesso à criação e a leitura de respostas, com contagens reais.

O menu móvel usa a camada nativa de dialog, sem um segundo conjunto de destinos. Filtros se distribuem em duas colunas no celular; tarefas se recompõem em título e metadados acima das ações, em vez de comprimir tudo em uma linha. O editor conserva cabeçalho e ações alcançáveis, leitura integral e retorno de foco. Mudanças frequentes usam passagens curtas e respeitam o movimento reduzido.

O Studio continua emoldurando as identidades dos projetos. A ficha administrativa leva diretamente ao estudo vinculado e os painéis de cada prancha retomam seu estado de abertura. A geometria das assinaturas, a vitrine e os materiais oficiais permanecem preservados.
