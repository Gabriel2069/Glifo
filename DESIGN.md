# Glifo

## Direção

Um atlas de ideias que encontraram forma. Universo celestial, mitológico e editorial; apresentação autoral conduzida por Gabriel Tadeu. A navegação e o conteúdo devem demonstrar relações e cuidado, preservando leitura e acesso direto aos trabalhos.

## Fontes de verdade

- `src/styles/tokens.css`: cores, famílias, espaçamento de referência e easing.
- `src/data/site.ts`: autoria, contato, projetos e método. Portfólio e casos devem continuar utilizando esse conjunto de registros.
- `public/brand`: assinaturas finais fornecidas pelo autor, preservadas em seus arquivos originais.
- `public/images/nebula.webp`: recurso celestial criado para o site.
- `public/images/vision-board.webp`: prancha conceitual do projeto Glifo.

## Composição

Alternar narrativa, trabalhos, processo e autoria. Títulos editoriais em Cormorant; informações em Manrope. O fundo favorece a leitura; a intensidade celestial se concentra nas passagens de expressão. Preservar as identidades de futuros clientes ao apresentar seus casos.

## Movimento

GSAP coordena entradas e deslocamentos. Canvas é responsável apenas pelas estrelas. A nebulosa tem movimento lento enquanto a aba está visível; as estrelas também param fora da abertura. Respeitar movimento reduzido e o controle de pausa. Não adicionar outro controlador à mesma propriedade.

## Estado do conteúdo

A primeira versão apresenta somente o caso real autoral Glifo. Os três pontos do atlas são capítulos desse caso, não clientes ou projetos adicionais. Acrescentar novos registros apenas quando houver material e informações confirmados.

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
