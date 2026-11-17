# Navegação Indoor Afya

Navegação institucional pelo celular para ajudar alunos e visitantes a encontrar locais.

**O ambiente real da faculdade ainda não foi modelado. O desenvolvimento utiliza grafos e dados fictícios para desacoplar o software do levantamento físico.**

## Escopo
Minishopping + Bloco A; Bloco B fora do MVP. Pesquisa, origem/destino manual, cálculo e mapa esquemático funcionam com dados fictícios. O visualizador está preparado para um GLB/glTF externo; o modelo real, caminhada e colisões ainda dependem das próximas entregas. Sem autenticação, GPS indoor, Supabase ou IA.

## Stack e arquitetura
React, TypeScript, Vite, Vitest, Oxlint e GitHub Actions. Three.js e React Three Fiber são carregados somente ao abrir um modelo configurado.
- `src/modules/navigation`: motor puro, tipos e resultados explícitos; independente de React/3D.
- `src/data/graphs`: G1 normal, G2 com desvio, G3 bloqueado sem desvio.
- `src/modules/locations/location.types.ts`: contratos `Location`, `LocationType` e `Position3D`, independentes da interface.
- `src/data/locations.mock.ts`: catálogo original de seis locais fictícios da #28.
- `src/modules/search`: pesquisa por nome/código no catálogo recebido; `src/modules/scene`: carregador GLB/glTF e câmera, independentes do cálculo de rotas.
- `src/modules/visualization`: adaptação de coordenadas, mapa SVG e alternância de visualização.
- `src/config/visualization.ts`: desenho esquemático, caminho do modelo, posições espaciais e medições preliminares; sem mudar o motor.
- `src/components`: componentes compartilhados quando necessários.
- `src/tests`: casos funcionais rastreáveis.

As arestas são bidirecionais, pesos finitos não negativos, bloqueios ignorados na busca. Coordenadas x/y/z opcionais. O algoritmo usa busca de custo mínimo (Dijkstra, equivalente a A* com heurística zero): uma heurística espacial só será introduzida quando houver relação validada entre coordenadas e pesos. Os pesos atuais não representam metros ou minutos.

## Contrato dos locais e layout

`Location` exige `id`, `name`, `type`, `block`, `floor` e `nodeId`; `code` e `position` são opcionais. Os dados são somente leitura no contrato TypeScript. `id` identifica a seleção no catálogo; `nodeId` é enviado ao motor de rotas.

O catálogo preserva os seis registros originais da PR #35, associados a E0, C1, C2, S101, S102 e L01. Nomes, andares e setores são exemplos fictícios. Os registros omitem coordenadas; `Position3D` admite apenas coordenadas de desenvolvimento enquanto não houver escala física validada.

O layout integra `SearchField`, seleção manual, inversão e `RouteResultView`. Pesquise por nome ou código e escolha um resultado para preencher o destino. Para demonstrar: selecione Entrada e Sala 101, clique em **Calcular rota** e confira **E0 → C1 → C2 → S101** no mapa e no texto. Alterar os locais limpa o resultado anterior; calcule novamente para desenhar o novo percurso. O mapa permite ampliar, rolar e ajustar a visualização.

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
Pesquisa, seleção, cálculo e mapa esquemático integrados. O catálogo mantém os nomes fictícios originais, inclusive “Bloco 1”; eles não confirmam salas reais do Bloco A. Para preparar o modelo, veja [o módulo de cena](src/modules/scene/README.md). Evidências desta fase: [VALIDACAO_VISUALIZACAO.md](docs/VALIDACAO_VISUALIZACAO.md). A homologação do campus, do 3D e do desempenho em celulares reais permanece pendente.
Project: https://github.com/users/Guilhermegg-06/projects/4
Comece pelo [guia da equipe](docs/GUIA_DA_EQUIPE.md), que explica o código, as tarefas, o Kanban, as labels, os testes e o fluxo de revisão.
Veja também [TDD](docs/TDD.md) e [pendências](docs/PENDENCIAS.md).

## Versão de produção local

```sh
npm ci
npm run build
npm run preview
```

Abra a URL exibida pelo Vite. No PowerShell, use `npm.cmd` caso o wrapper `npm.ps1` seja bloqueado. Node 22.12+ da linha 22; CI e Vercel usam Node 22.

## Publicação de teste na Vercel — somente quando autorizada

1. Na Vercel, **Add New → Project**, conecte o GitHub e selecione `Guilhermegg-06/System-indoor`.
2. Confirme raiz do repositório, preset **Vite**, instalação `npm ci`, build `npm run build`, saída **dist** e Node **22.x**. Não há variáveis de ambiente obrigatórias.
3. Antes de clicar em Deploy, autorize a publicação inicial: a [primeira implantação de um projeto novo é Production](https://vercel.com/docs/deployments/environments#first-deployment), mesmo vindo de outra branch. Nenhum deploy foi executado nesta entrega.
4. Depois de o projeto ter uma implantação inicial, mantenha `main` como branch de produção. Pushes e PRs de outras branches geram **Preview**. Abra o link HTTPS da implantação da PR e repita Entrada → Sala 101. Para compartilhar, confira a proteção de acesso do Preview. Não promova nem faça merge para publicar produção sem revisão.

O `vercel.json` declara somente o build estático. Há uma única página em `/`, sem rotas de URL: não é necessário rewrite geral de SPA. Isso também preserva erros de assets ausentes. Modelos ficam em `public/models/`, acessíveis em `/models/`; arquivos `.gltf` precisam de seus `.bin` e texturas nos caminhos corretos. Prefira GLB autocontido e URLs HTTPS. Referência: [Vite na Vercel](https://vercel.com/docs/frameworks/frontend/vite).
