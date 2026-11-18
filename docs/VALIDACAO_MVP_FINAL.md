# Validação final do MVP 2D — 18/11/2026

Base: `main b3630c2`, incluindo PRs #43 e #44. Trabalho isolado em `release/mvp-2d-final`; nenhuma alteração válida dos outros checkouts foi sobrescrita. O checkout anterior da planta (`275a405`) não continha a implantação da PR #44. A verificação usa o build desta branch em `http://127.0.0.1:5185/`, identificado no DOM por `data-release="mvp-2d-final"` e bundle `index-SaGV9YUJ.js`.

## Resultado funcional

- Salas 01–08 no térreo e 09–16 no primeiro andar, com IDs próprios e geometria configurável compartilhada.
- Sanitários em ambos os pisos: chegada ao acesso coletivo pelo corredor esquerdo, fora das paredes. Não são homologadas portas independentes.
- Minishopping com cobertura longitudinal completa, extremidades, passeios e vegetação; sem interiores inventados.
- Campus com implantação própria em SVG, Bloco A, circulação externa, acessos e jardins. Sem Bloco B.
- Rede única, mesmo `findRoute`; etapas preservam a sequência completa e projetam somente conexões válidas do referencial atual.
- Transição do passeio para a planta interna explicitamente demonstrativa. Conexão vertical **simulada e provisória**, sem alegação de escada real ou acessibilidade homologada.
- Pesquisa por sala com/sem zero à esquerda e por banheiro; seleção por planta e campos, inversão, zoom e ajuste. Fixtures originais mantidas somente para testes.

## Verificações executadas

Node 22.23.5 / npm 10.9.9: `npm ci`, lint, typecheck, **163 testes (18 arquivos)**, auditoria e build aprovados. Baseline anterior: 146 testes. `npm run preview -- --host 127.0.0.1 --port 5185 --strictPort` usado para a validação real.

Auditoria reproduzível: `npm run audit:campus`. Relatório integral com catálogo, acessos, conexões e todos os pares: [connectivity.json](evidencias-mvp/connectivity.json).

| Medida | Resultado |
| --- | ---: |
| Registros do catálogo | 32 |
| Destinos navegáveis | 31 |
| Pares verificados | 1024 |
| Pares demonstrativos (inclui origem igual ao destino) | 961 |
| Pares indisponíveis envolvendo referência fotográfica | 63 |
| Falhas de cadastro/geometria | 0 |
| Nós navegáveis isolados | 0 |

A única referência isolada é `A1-FOTO`, intencionalmente não navegável. Os 63 pares não representam falhas de rota de salas ou sanitários. Nenhuma rota é classificada como oficial/homologada.

Casos cobertos: 01→08, 01→WC0, 01→09, 08→16, 09→13, 16→WC1, MS→A0, MS→01, MS→13, WC0→WC1; retorno/inversão; mesma origem; nó inexistente; destino isolado; ligação vertical bloqueada; conexão desconhecida entre pisos; coordenadas ausentes; rota antiga invalidada por bloqueio. A auditoria amostra todos os segmentos sobre corredores/passeios, rejeitando diagonais, obstáculos e saídas das regiões transitáveis.

## Navegador real — build de produção

Larguras 320, 390, 768 e 1440 px verificadas; sem overflow horizontal. Plantas completas em escala de ajuste; zoom de 200% em 320 px com deslocamento por teclado confirmado (`scrollLeft=106`, área interna de 528 px em viewport de 264 px), seguido de ajuste. Seleção real no SVG do Minishopping e da Sala 13, cálculo e navegação pelas três etapas confirmados. Busca `sala9` e `banheiro` confirmada na interface. Sem erros de console durante o smoke test.

Foram observados visualmente campus, Minishopping, exterior, ambos os pisos, 09→13, 16→sanitários, 01→09 e MS→13. A troca de vista preservou o texto e mostrou somente o trecho compatível. Algumas capturas são páginas completas, incluindo controles e resultado.

- [01-campus-1440.jpg](evidencias-mvp/01-campus-1440.jpg)
- [02-minishopping-1440.jpg](evidencias-mvp/02-minishopping-1440.jpg)
- [03-externo-1440.jpg](evidencias-mvp/03-externo-1440.jpg)
- [04-terreo-1440.jpg](evidencias-mvp/04-terreo-1440.jpg)
- [05-primeiro-andar-1440.jpg](evidencias-mvp/05-primeiro-andar-1440.jpg)
- [06-rota-09-13-1440.jpg](evidencias-mvp/06-rota-09-13-1440.jpg)
- [07-rota-16-sanitarios-1440.jpg](evidencias-mvp/07-rota-16-sanitarios-1440.jpg)
- [08-entre-pisos-terreo-1440.jpg](evidencias-mvp/08-entre-pisos-terreo-1440.jpg)
- [09-entre-pisos-primeiro-1440.jpg](evidencias-mvp/09-entre-pisos-primeiro-1440.jpg)
- [10-ms-sala13-campus-1440.jpg](evidencias-mvp/10-ms-sala13-campus-1440.jpg)
- [11-ms-sala13-terreo-1440.jpg](evidencias-mvp/11-ms-sala13-terreo-1440.jpg)
- [12-ms-sala13-primeiro-1440.jpg](evidencias-mvp/12-ms-sala13-primeiro-1440.jpg)
- [13-ms-sala13-mobile-390.jpg](evidencias-mvp/13-ms-sala13-mobile-390.jpg)
- [14-rota-mobile-320.jpg](evidencias-mvp/14-rota-mobile-320.jpg)
- [15-rota-tablet-768.jpg](evidencias-mvp/15-rota-tablet-768.jpg)
- [16-minishopping-mobile-390.jpg](evidencias-mvp/16-minishopping-mobile-390.jpg)
- [17-campus-mobile-320.jpg](evidencias-mvp/17-campus-mobile-320.jpg)
- [18-zoom-200-mobile-320.jpg](evidencias-mvp/18-zoom-200-mobile-320.jpg)

## Limitações remanescentes

A implantação, portas e distribuição intermediária são aproximadas. O térreo reaproveita provisoriamente o primeiro andar por decisão do responsável. A ligação vertical é uma simulação acadêmica, não uma escada levantada. Não há distâncias métricas, levantamento interno do Minishopping ou homologação física/de acessibilidade. O 3D existente foi preservado; GLB depende de entrega separada.

O ambiente não possui Vercel CLI/configuração de projeto nem plugin Vercel conectado. A disponibilidade de Preview deve ser confirmada pelos checks/deployments da PR; não foi criada implantação de produção. A instalação mantém seis avisos de vulnerabilidade de dependências já existentes e o build mantém aviso do chunk 3D carregado sob demanda; não foi aplicada atualização incompatível nesta missão.
