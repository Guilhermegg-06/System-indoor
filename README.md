# Navegação Indoor Afya

Navegação institucional pelo celular para ajudar alunos e visitantes a encontrar locais.

**O ambiente real da faculdade ainda não foi modelado. O desenvolvimento utiliza grafos e dados fictícios para desacoplar o software do levantamento físico.**

## Escopo
Minishopping + parte do primeiro bloco; pesquisa, seleção manual de origem/destino, cálculo e apresentação de rota e exploração 3D. A exploração 3D faz parte do MVP planejado, mas será implementada depois da fundação atual. Sem autenticação, GPS indoor, Supabase ou IA.

## Stack e arquitetura
React, TypeScript, Vite, Vitest, Oxlint e GitHub Actions. Three.js/React Three Fiber ficam para integração futura.
- `src/modules/navigation`: motor puro, tipos e resultados explícitos; independente de React/3D.
- `src/data/graphs`: G1 normal, G2 com desvio, G3 bloqueado sem desvio.
- `src/modules/search`, `locations`, `scene`: limites dos módulos futuros.
- `src/components`: componentes compartilhados quando necessários.
- `src/tests`: casos funcionais rastreáveis.

As arestas são bidirecionais, pesos finitos não negativos, bloqueios ignorados na busca. Coordenadas x/y/z opcionais. O algoritmo usa busca de custo mínimo (Dijkstra, equivalente a A* com heurística zero): uma heurística espacial só será introduzida quando houver relação validada entre coordenadas e pesos. Os pesos atuais não representam metros ou minutos.

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
Fundação e motor mínimo em revisão. Interface contém apenas identificação do projeto, sem pesquisa/rota integrada. Testes cobrem o núcleo fictício; não validam o campus, 3D ou desempenho em celulares.
Project: https://github.com/users/Guilhermegg-06/projects/4
Comece pelo [guia da equipe](docs/GUIA_DA_EQUIPE.md), que explica o código, as tarefas, o Kanban, as labels, os testes e o fluxo de revisão.
Veja também [TDD](docs/TDD.md) e [pendências](docs/PENDENCIAS.md).

