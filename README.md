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
- `src/modules/search`: pesquisa por nome/código no catálogo recebido; `scene` permanece reservado à integração futura.
- `src/components`: componentes compartilhados quando necessários.
- `src/tests`: casos funcionais rastreáveis.

As arestas são bidirecionais, pesos finitos não negativos, bloqueios ignorados na busca. Coordenadas x/y/z opcionais. O algoritmo usa busca de custo mínimo (Dijkstra, equivalente a A* com heurística zero): uma heurística espacial só será introduzida quando houver relação validada entre coordenadas e pesos. Os pesos atuais não representam metros ou minutos.

## Contrato dos locais e layout

`Location` exige `id`, `name`, `type`, `block`, `floor` e `nodeId`; `code` e `position` são opcionais. Os dados são somente leitura no contrato TypeScript. `id` identifica a seleção no catálogo; `nodeId` é enviado ao motor de rotas.

O catálogo preserva os seis registros originais da PR #35, associados a E0, C1, C2, S101, S102 e L01. Nomes, andares e setores são exemplos fictícios. Os registros omitem coordenadas; `Position3D` admite apenas coordenadas de desenvolvimento enquanto não houver escala física validada.

O layout da #19 agora integra `SearchField`, seleção manual, inversão e `RouteResultView`. Pesquise por nome ou código e escolha um resultado para preencher o destino. Para demonstrar: selecione Entrada e Sala 101, clique em **Calcular rota** e confira **E0 → C1 → C2 → S101**. Alterar os locais limpa o resultado anterior. O mapa/3D continua como placeholder.

A fase 1 atende às issues #21, #29 e #30, sobre a base da PR #35. Evidências e limites: [VALIDACAO_MVP_FASE1.md](docs/VALIDACAO_MVP_FASE1.md). A validação anterior está em [VALIDACAO_19_28.md](docs/VALIDACAO_19_28.md).

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
Pesquisa, seleção e cálculo estão integrados nesta branch, usando os seis mocks e o motor existentes. Os testes cobrem os cenários fictícios e a interface; a homologação do campus, do 3D e do desempenho em celulares reais depende das próximas etapas.
Project: https://github.com/users/Guilhermegg-06/projects/4
Comece pelo [guia da equipe](docs/GUIA_DA_EQUIPE.md), que explica o código, as tarefas, o Kanban, as labels, os testes e o fluxo de revisão.
Veja também [TDD](docs/TDD.md) e [pendências](docs/PENDENCIAS.md).
