# Correção do campus e das rotas

Branch: `fix/mapa-campus-rotas-completas`. Base atualizada: `ca8cba3`, main após merge da PR #43. README, referências espaciais, módulos de navegação, seleção e desenho inspecionados. Nenhum AGENTS.md adicional encontrado. Reconhecimento: `npm ci` e os **134 testes anteriores aprovados** numa cópia de trabalho separada, com Node 22.23.5 / npm 10.9.9. A instalação na cópia anterior encontrou DLL em uso; a cópia separada instalou normalmente.

## Conectividade e representação

- O motor `findRoute`, os grafos G1/G2/G3, o carregador GLB e as câmeras 3D foram preservados. Nenhuma dependência adicionada.
- As áreas externas compartilham a rede de passeio. As vistas aproximam setores do mesmo desenho, preservando o caminho completo no texto; o SVG limita a exibição ao enquadramento de cada vista. Botões de etapas indicam como acompanhar e restaurar o percurso.
- Minishopping representa cobertura e acessos pelo passeio, **sem lojas ou paredes internas inventadas**. Bloco A térreo representa chegada externa; sua distribuição interna permanece pendente.
- Os sanitários usam um ponto de **chegada no corredor diante do conjunto**, no limite externo do bloco sanitário. `A1-WC-ACESSO` fica no corredor esquerdo, que foi subdividido; a conexão não entra no sanitário nem cruza parede. Este é um acesso coletivo demonstrativo aproximado a partir do esquema fornecido, sem afirmar portas independentes feminina/masculina.
- A referência fotográfica não é destino. Continua visível como pendente de localização, com botão próprio para consultar fotos, fora de selects e pesquisa de navegação.
- Térreo e primeiro andar continuam redes separadas. Não foi criada conexão vertical sem escada/elevador identificado.

## Catálogo auditado

Todos os locais abaixo usam pesos sem unidade física. Rede externa: térreo/passeio. Rede A1: primeiro andar. Todas as rotas existentes são demonstrativas, não homologadas.

| location.id | nodeId | Área / andar | Ponto de acesso e conexões diretas | Disponibilidade |
| --- | --- | --- | --- | --- |
| ms-referencia | MS-REF | Minishopping / 0 | Passeio junto à cobertura → MS-SAIDA | Demonstrativa |
| ext-referencia | EXT-REF | Percurso externo / 0 | Passeio lateral → MS-SAIDA, EXT-CURVA | Demonstrativa |
| a0-referencia | A0-REF | Bloco A / 0 | Chegada externa → EXT-CURVA | Demonstrativa; interior pendente |
| a1-c1 | A1-C1 | Bloco A / 1 | Canto inferior direito → C2, C4, S09, S16 | Demonstrativa |
| a1-c2 | A1-C2 | Bloco A / 1 | Canto inferior esquerdo → C1, WC-ACESSO, S10, S11 | Demonstrativa |
| a1-c3 | A1-C3 | Bloco A / 1 | Canto superior esquerdo → WC-ACESSO, C4, S12, S13 | Demonstrativa |
| a1-c4 | A1-C4 | Bloco A / 1 | Canto superior direito → C3, C1, S14, S15 | Demonstrativa |
| a1-sanitarios | A1-WC | Bloco A / 1 | Chegada ao conjunto pelo corredor → A1-WC-ACESSO | Demonstrativa; portas internas pendentes |
| a1-foto | A1-FOTO | Bloco A / 1 | Foto geral sem posição de captura; sem arestas | Pendente, não navegável |
| a1-sala-09 | A1-S09 | Bloco A / 1 | Porta aproximada → A1-C1 | Demonstrativa |
| a1-sala-10 | A1-S10 | Bloco A / 1 | Porta aproximada → A1-C2 | Demonstrativa |
| a1-sala-11 | A1-S11 | Bloco A / 1 | Porta aproximada → A1-C2 | Demonstrativa |
| a1-sala-12 | A1-S12 | Bloco A / 1 | Porta aproximada → A1-C3 | Demonstrativa |
| a1-sala-13 | A1-S13 | Bloco A / 1 | Porta aproximada → A1-C3 | Demonstrativa |
| a1-sala-14 | A1-S14 | Bloco A / 1 | Porta aproximada → A1-C4 | Demonstrativa |
| a1-sala-15 | A1-S15 | Bloco A / 1 | Porta aproximada → A1-C4 | Demonstrativa |
| a1-sala-16 | A1-S16 | Bloco A / 1 | Porta aproximada → A1-C1 | Demonstrativa |

Nós intermediários adicionais: `MS-SAIDA`, `EXT-CURVA` e `A1-WC-ACESSO`. Prefixo A1 omitido nas conexões de circulação da tabela por legibilidade.

## Validação automatizada

`auditNavigation` em `src/modules/campus/audit.ts` informa erros estruturais, nós isolados, catálogo com acesso/conexões e todos os pares classificados como utilizáveis, demonstrativos ou indisponíveis. No cadastro atual não há rotas fisicamente homologadas; `usable` fica reservado a local confirmado sem deslocamento. Ausência de ligação vertical e referência fotográfica são indisponibilidades intencionais.

Validação: **146 testes aprovados**, incluindo os 134 testes anteriores adaptados às correções intencionais e 12 novos testes. `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` aprovados. `npm ci` executado com lockfile original. `npm run preview -- --host 0.0.0.0 --port 5180 --strictPort` usado para o smoke test da versão de produção.

Auditoria dos **289 pares (17 × 17)**, incluindo casos de mesma origem/destino: 178 demonstrativos e 111 indisponíveis intencionais. Sem isolamento acidental. A1-FOTO é o único nó isolado, documentado e não oferecido como destino. Todas as conexões são verificadas geometricamente contra corredores/passeios e áreas não transitáveis.

Testes de regressão foram atualizados onde esperavam sanitário desconectado, três nós externos sem curvas ou o trajeto antigo após subdivisão do corredor. Não foram removidos cenários de falha. Casos cobertos: salas 09→13, 13→16, 16→WC, 09→WC; Minishopping→externo e →A0; nó inexistente, destino isolado, bloqueio, mesma origem/destino, coordenadas ausentes e falta de ligação vertical.

## Smoke test em navegador real

Executado na versão de produção, desktop e viewport móvel de 390×844 (largura útil observada: 375 px após scrollbar). As quatro vistas externas tiveram `scrollWidth = clientWidth = 375`, sem overflow horizontal. Console sem erros. Toque em aparelho físico não foi homologado; os testes móveis usaram emulação de viewport no navegador.

Conferidos: origem/destino, Sala 16→WC com chegada pelo corredor esquerdo, Sala 09→13, rota inversa, zoom 125% e ajuste a 100%, Minishopping→A0 com mudança pelas três etapas, troca para térreo ocultando rota do primeiro andar e preservando o resultado textual, botão de retorno à vista correta. Travessia sem ligação vertical retorna indisponível.

Evidências, capturadas antes do ajuste final de nomenclatura do botão para Planta 2D nas vistas externas:

1. [Visão geral](evidencias-campus/01-campus-desktop.jpg)
2. [Minishopping](evidencias-campus/02-minishopping.jpg)
3. [Percurso externo](evidencias-campus/03-percurso-externo.jpg)
4. [Sala 16 → Sanitários](evidencias-campus/04-sala16-sanitarios.jpg)
5. [Sala 09 → Sala 13](evidencias-campus/05-sala09-sala13.jpg)
6. [Minishopping → Bloco A](evidencias-campus/06-minishopping-bloco-a.jpg)
7. [Troca de andar](evidencias-campus/07-troca-andar.jpg)
8. [Primeiro andar mobile](evidencias-campus/08-mobile-sanitarios.jpg)
9. [Campus mobile](evidencias-campus/09-campus-mobile.jpg)
10. [Medições de overflow mobile](evidencias-campus/smoke-mobile.json)

## Limites mantidos

Implantação baseada no exemplo aéreo fornecido, em SVG próprio, sem screenshots de serviços de mapas no bundle. Contornos, vegetação, acessos e escala são ilustrativos. A imagem fornecida orienta disposição e estilo, não comprova levantamento físico. Nenhum Bloco B é desenhado. Não há interiores levantados do Minishopping/térreo, escadas identificadas nem portas independentes dos sanitários. O destino WC indica chegada ao conjunto pelo corredor e exige vistoria para navegação física real.

Nenhum merge automático ou deploy de produção foi realizado. CI e revisão de outro colaborador continuam obrigatórios.
