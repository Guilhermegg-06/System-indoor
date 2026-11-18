# Referências do campus

## Fontes e limites

- As duas fotografias fornecidas pelo grupo mostram o **primeiro andar do Bloco A**, confirmado pelo usuário. Não há posição exata validada para cada fotografia. As placas visíveis não foram transformadas em salas cadastradas.
- A descrição fornecida informa circulação em torno de vazio/pátio e sanitários. A planta 2D do primeiro andar ilustra essa descrição; não reproduz uma planta institucional validada.
- A imagem “Planta Baixa Técnica do Bloco A” é um redesenho por IA. Na Missão 01, passou a orientar somente a representação visual simplificada do anel de circulação, dos sanitários e do pátio. Não valida medidas, coordenadas físicas, quantidade ou dimensões de salas, nem a posição exata de portas.
- O usuário indicou a sala 09 na parte inferior direita, com a numeração seguindo para a esquerda, pela lateral esquerda e parte superior, até a sala 16 na lateral direita. Para o MVP, as salas 09–16 são distribuídas em pares por lado. Essa distribuição intermediária e os acessos são hipóteses de apresentação, identificadas como aproximadas na interface e nos metadados.
- A referência aérea do Bing orienta apenas a relação geral entre setores. O screenshot não integra a aplicação. O desenho vetorial é próprio e não tem precisão cartográfica.
- O térreo tem somente a referência do edifício. Não replica o primeiro andar. Não há escadas, conexões entre pisos ou Bloco B no grafo.

## Dados e unidades

`src/data/campus.ts` separa catálogo (`id` → `nodeId`), metadados, conexões, desenho, fotos, medições e modelos. O motor `findRoute` e os grafos originais não foram alterados.

`src/data/blocoA.floorPlan.ts` contém a geometria visual. O circuito A1-C1…C4 e os ramais das salas foram preservados, subdividindo o corredor esquerdo com `A1-WC-ACESSO`. O ponto `A1-WC` agora representa chegada ao conjunto sanitário pelo corredor, fora da parede, sem entrar nos ambientes. Sua posição é demonstrativa e não homologa portas independentes. Cada local usa um `Location.id` próprio ligado a um `nodeId` do mesmo grafo. `floorPlanGeometry` somente desenha os segmentos validados pelo adaptador existente. O pátio continua não transitável.

| Informação | Situação |
| --- | --- |
| Corredor longitudinal: 34 m | Aproximado; não define coordenadas de nós |
| Largura típica: 2,56 m | Aproximada; sem planta validada |
| 2,48 m; 2,96 m; 24,14 m; 12,43 m | Aproximadas e sem associação espacial |
| Posições físicas x/y/z | Em metros no contrato; valores `null` enquanto pendentes |
| Posições SVG | Unidades arbitrárias do desenho, nunca metros |
| Ligações e pesos | Demonstrativos; custo unitário sem significado métrico |

`confirmed` identifica informação validada, `approximate` identifica estimativa e `pending` identifica ausência de levantamento. A confirmação do pavimento das fotos não confirma coordenadas. Os identificadores A1-C1 a A1-C4 são referências esquemáticas, não numeração oficial de corredores.

Minishopping → exterior → térreo é uma demonstração provisória sobre o passeio, com nós de saída e curva. `src/data/campusSite.ts` contém a implantação vetorial própria baseada no exemplo aéreo fornecido, sem reproduzir screenshots de mapas no bundle. Não modela interiores do Minishopping ou do térreo. O circuito do primeiro andar continua separado. A referência de fotos permanece isolada intencionalmente, marcada como pendente de localização e removida apenas das opções de navegação, com consulta própria. O motor retorna sem caminho entre pisos; nenhuma escada ou elevador foi inventado. Catálogo auditado e evidências: [VALIDACAO_ROTAS_COMPLETAS.md](VALIDACAO_ROTAS_COMPLETAS.md).

## Fotografias

Os originais do grupo foram preservados fora do bundle. Duas cópias WebP (qualidade 82, dimensões originais, total 57.320 bytes) ficam em `public/images/bloco-a/primeiro-andar/`, carregadas sob demanda e com descrição alternativa. Falta de imagem/erro de carregamento tem mensagem própria.

Pastas para Minishopping, exterior e térreo estão preparadas, sem referências a arquivos inexistentes. `photoIds` permite associar várias fotos a um local. As fotos atuais têm escopo `area-floor`; a interface explica que são referências gerais do pavimento, inclusive quando consultadas a partir de uma rota.

## Recebimento futuro dos modelos

`CampusModel` reserva URL GLB/glTF, setor, andar, origem métrica, escala em metros por unidade, orientação em graus, nós associados e entradas. Há contratos separados para Minishopping e Bloco A; campos desconhecidos permanecem `null`/vazios.

Ao fornecer um arquivo, cadastre sua URL em `campusModels`; a área/andar correspondente habilita o carregador existente, com câmera e tratamento de falhas. Antes de sobrepor uma rota, valide origem, escala, orientação e coordenadas dos nós. O adaptador 3D existente recebe o `RouteResult` e posições espaciais; a configuração atual mantém essas posições vazias para não projetar trajetos inventados. Caminhada, colisões e alinhamento ao modelo real não estão concluídos.
