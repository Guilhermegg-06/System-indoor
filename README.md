# Navegação Indoor Afya

Navegação institucional pelo celular para ajudar alunos e visitantes a encontrar locais.

**O ambiente real da faculdade ainda não foi modelado. O desenvolvimento utiliza grafos e dados fictícios para desacoplar o software do levantamento físico.**

## Escopo
Minishopping + parte do primeiro bloco; pesquisa, seleção manual de origem/destino, cálculo e apresentação de rota e exploração 3D. A exploração 3D faz parte do MVP planejado, mas será implementada depois da fundação atual. Sem autenticação, GPS indoor, Supabase ou IA.

## Stack e arquitetura
React, TypeScript, Vite, Vitest, Oxlint e GitHub Actions. Three.js/React Three Fiber ficam para integração futura.
- `src/modules/navigation`: motor puro, tipos e resultados explícitos; independente de React/3D.
- `src/data/graphs`: G1 normal, G2 com desvio, G3 bloqueado sem desvio.
- `src/modules/locations/location.types.ts`: contratos `Location`, `LocationType` e `Position3D`, independentes da interface.
- `src/data/locations.mock.ts`: catálogo original de seis locais fictícios da #28.
- `src/modules/search` e `scene`: limites dos módulos futuros.
- `src/components`: componentes compartilhados quando necessários.
- `src/tests`: casos funcionais rastreáveis.

As arestas são bidirecionais, pesos finitos não negativos, bloqueios ignorados na busca. Coordenadas x/y/z opcionais. O algoritmo usa busca de custo mínimo (Dijkstra, equivalente a A* com heurística zero): uma heurística espacial só será introduzida quando houver relação validada entre coordenadas e pesos. Os pesos atuais não representam metros ou minutos.

## Contrato dos locais e layout

`Location` exige `id`, `name`, `type`, `block`, `floor` e `nodeId`; `code` e `position` são opcionais. Os dados são somente leitura no contrato TypeScript. `id` identifica o registro do catálogo e `nodeId` permite a associação futura com o grafo.

O catálogo preserva os seis registros originais da PR #35, associados a E0, C1, C2, S101, S102 e L01. Nomes, andares e setores são exemplos fictícios. Os registros omitem coordenadas; `Position3D` admite apenas coordenadas de desenvolvimento enquanto não houver escala física validada.

O shell mobile da #19 apresenta pesquisa, origem, destino, mapa/3D e resumo. Os controles estão desativados nesta prévia. `SearchField` e `RouteResultView` permanecem disponíveis como componentes isolados para as próximas integrações.

Esta retomada conjunta das issues #28 e #19 usa a branch `feat/base-dados-layout-19-28` e a PR #35. Seleção funcional, filtragem e ligação ao motor pertencem às issues #21, #29 e #30. A validação e as limitações estão em [VALIDACAO_19_28.md](docs/VALIDACAO_19_28.md).

## Executar
Node 22.12+ (linha 22) e npm:
```sh
npm ci
npm run dev
```

## Validar
```sh
npm run lint
npm run typecheck
npm test
npm run build
```
`npm run test:watch` acompanha mudanças. CI executa as mesmas etapas em PRs para main e pushes em main, com cache npm.

## Fluxo Git
Crie uma branch de feature a partir da main. Faça commits pequenos, abra PR, aguarde CI e uma aprovação de outro colaborador. Não faça desenvolvimento direto na main. Force push e exclusão da main são proibidos.
O primeiro commit vazio apenas inicializa o repositório; todo o desenvolvimento entra por PR.

## Status
Motor, SearchField e RouteResultView foram integrados na main pelas PRs #34, #37 e #38. A branch desta retomada reúne essas entregas com o contrato, os seis mocks e o layout originais da PR #35. Os testes cobrem os cenários fictícios e a apresentação dos componentes; a homologação do campus, do 3D e do desempenho em celulares depende das próximas etapas.
Project: https://github.com/users/Guilhermegg-06/projects/4
Comece pelo [guia da equipe](docs/GUIA_DA_EQUIPE.md), que explica o código, as tarefas, o Kanban, as labels, os testes e o fluxo de revisão.
Veja também [TDD](docs/TDD.md) e [pendências](docs/PENDENCIAS.md).
