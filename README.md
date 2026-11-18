# Navegação Indoor Afya

Navegação institucional pelo celular para ajudar alunos e visitantes a encontrar locais.

**Fotografias reais do primeiro andar estão disponíveis. O mapa e suas conexões são demonstrativos, sem escala validada. O ambiente real ainda não foi modelado em 3D.**

## Escopo
MVP 2D do Campus UNIMA Afya: implantação geral, Minishopping (cobertura e acessos), percurso externo e Bloco A em dois pisos. Térreo com salas 01–08; primeiro andar com salas 09–16. Ambos possuem anel de circulação e chegada aos sanitários pelo corredor esquerdo. O térreo reutiliza provisoriamente a distribuição do primeiro andar, conforme decisão do responsável.

A conexão vertical é **simulada para apresentação acadêmica**; não representa escada real nem rota acessível homologada. A entrada do passeio no térreo também é uma transição demonstrativa entre vistas. Plantas, portas e caminhos não equivalem a levantamento físico. Não há interiores inventados no Minishopping nem Bloco B.

Abra a aplicação e use a planta geral, a pesquisa ou os seletores de origem/destino. Calcule a rota e acompanhe as etapas **Campus e percurso externo → Térreo → Primeiro andar**, conforme o trajeto. A troca de vista mantém o resultado completo e mostra somente o segmento daquele referencial. Zoom, rolagem/arraste e ajuste funcionam sem GLB.

## Stack e arquitetura
React, TypeScript, Vite, Vitest, Oxlint e GitHub Actions. Three.js e React Three Fiber são carregados somente ao abrir um modelo configurado.
- `src/modules/navigation`: motor puro, tipos e resultados explícitos; independente de React/3D.
- `src/data/graphs`: G1 normal, G2 com desvio, G3 bloqueado sem desvio.
- `src/modules/locations/location.types.ts`: contratos `Location`, `LocationType` e `Position3D`, independentes da interface.
- `src/data/locations.mock.ts`: catálogo original de seis locais fictícios da #28.
- `src/data/campus.ts`: referências do campus, grafo demonstrativo, fotos, medições e contratos dos futuros modelos por setor/andar.
- `src/data/blocoA.floorPlan.ts`: geometria aproximada das salas, portas, circulação e acessos; unidades do desenho, sem escala física.
- `src/modules/campus`: seleção de área/andar, metadados de confiança e fotografias carregadas sob demanda.
- `src/modules/search`: pesquisa por nome/código no catálogo recebido; `src/modules/scene`: carregador GLB/glTF e câmera, independentes do cálculo de rotas.
- `src/modules/visualization`: planta SVG interativa, adaptação de coordenadas, esquema de outras áreas e alternância de visualização. `floorPlanGeometry` apenas desenha segmentos já validados pelo adaptador; não calcula rotas.
- `src/config/visualization.ts`: desenho esquemático, caminho do modelo, posições espaciais e medições preliminares; sem mudar o motor.
- `src/components`: componentes compartilhados quando necessários.
- `src/tests`: casos funcionais rastreáveis.

As arestas são bidirecionais, pesos finitos não negativos, bloqueios ignorados na busca. Coordenadas x/y/z opcionais. O algoritmo usa busca de custo mínimo (Dijkstra, equivalente a A* com heurística zero): uma heurística espacial só será introduzida quando houver relação validada entre coordenadas e pesos. Os pesos atuais não representam metros ou minutos.

## Contrato dos locais e layout

`Location` exige `id`, `name`, `type`, `block`, `floor` e `nodeId`; `code` e `position` são opcionais. Os dados são somente leitura no contrato TypeScript. `id` identifica a seleção no catálogo; `nodeId` é enviado ao motor de rotas.

O catálogo público tem 32 registros: 31 destinos demonstrativos conectados e uma referência fotográfica não navegável, consultável separadamente. Salas 01–16 possuem IDs próprios, nó, coordenada de desenho e acesso pelo corredor. Coordenadas SVG nunca representam distâncias métricas. As seis fixtures originais permanecem nos testes, sem seletor experimental na interface pública.

A auditoria `npm run audit:campus` verifica o catálogo, nós, arestas, pesos, geometria de circulação e todos os 1024 pares. Os 961 pares navegáveis são demonstrativos; os outros 63 envolvem a referência fotográfica. Relatório e capturas do build: [VALIDACAO_MVP_FINAL.md](docs/VALIDACAO_MVP_FINAL.md).

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
npm run audit:campus
npm run build
```
`npm run test:watch` acompanha mudanças. CI executa as mesmas etapas em PRs para main e pushes em main, com cache npm.

## Fluxo Git
Crie uma branch de feature a partir da main. Faça commits pequenos, abra PR, aguarde CI e uma aprovação de outro colaborador. Não faça desenvolvimento direto na main. Force push e exclusão da main são proibidos.
O primeiro commit vazio apenas inicializa o repositório; todo o desenvolvimento entra por PR.

## Status
Pesquisa, seleção, cálculo, planta 2D com salas clicáveis, mapa por área/andar e duas fotos reais integrados. Fontes, medidas e contratos: [REFERENCIAS_CAMPUS.md](docs/REFERENCIAS_CAMPUS.md). Evidências: [VALIDACAO_CAMPUS.md](docs/VALIDACAO_CAMPUS.md) e [VALIDACAO_PLANTA_INTERATIVA.md](docs/VALIDACAO_PLANTA_INTERATIVA.md). Para preparar o carregamento do modelo, veja [o módulo de cena](src/modules/scene/README.md). A homologação do campus, do 3D e do desempenho em celulares físicos permanece pendente.
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
4. Depois de o projeto ter uma implantação inicial, mantenha `main` como branch de produção. Pushes e PRs de outras branches geram **Preview**. Abra o link HTTPS da implantação da PR e repita os exemplos acima, incluindo fotos e troca de andar. Para compartilhar, confira a proteção de acesso do Preview. Não promova nem faça merge para publicar produção sem revisão.

O `vercel.json` declara somente o build estático. Há uma única página em `/`, sem rotas de URL: não é necessário rewrite geral de SPA. Isso também preserva erros de assets ausentes. Modelos ficam em `public/models/`, acessíveis em `/models/`; arquivos `.gltf` precisam de seus `.bin` e texturas nos caminhos corretos. Prefira GLB autocontido e URLs HTTPS. Referência: [Vite na Vercel](https://vercel.com/docs/frameworks/frontend/vite).
