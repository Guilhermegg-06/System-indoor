# Navegação Indoor Afya

Navegação institucional pelo celular para ajudar alunos e visitantes a encontrar locais.

**Fotografias reais do primeiro andar estão disponíveis. O mapa e suas conexões são demonstrativos, sem escala validada. O ambiente real ainda não foi modelado em 3D.**

## Escopo
Minishopping + Bloco A; Bloco B fora do MVP. Pesquisa, origem/destino manual, cálculo e plantas 2D funcionam sem GLB. A visão inicial abre a implantação geral aproximada do campus, com cobertura do Minishopping, Bloco A, passeios, acessos e áreas verdes. As vistas aproximam cada setor; o primeiro andar preserva salas 09–16, paredes, portas, sanitários e pátio. O acesso coletivo aos sanitários é demonstrativo, com chegada pelo corredor esquerdo. Térreo e primeiro andar continuam separados, sem ligação vertical cadastrada. A referência de fotos é consultável separadamente e não é destino de navegação. O catálogo fictício original continua disponível em **Dados da navegação**. Modelo real, caminhada e colisões dependem das próximas entregas. Sem autenticação, GPS indoor, Supabase ou IA na aplicação.

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

O modo **Demonstração original** preserva os seis registros da PR #35, associados a E0, C1, C2, S101, S102 e L01. Nomes, andares e setores são exemplos fictícios. O modo **Campus** contém 17 referências: as nove anteriores e oito salas de demonstração (09–16). O usuário orientou o início da numeração na parte inferior, seguindo à esquerda até a lateral direita. A distribuição intermediária, as dimensões e as portas são estimadas; não equivalem a um cadastro físico homologado. Coordenadas métricas permanecem pendentes; as posições SVG são apenas unidades do desenho.

O layout integra `SearchField`, seleção manual, inversão e `RouteResultView`. Pesquise por nome ou código e escolha um resultado para preencher o destino. Na planta, use **Definir origem** ou **Definir destino** e toque em uma sala; Enter e Espaço também funcionam. Os cliques preenchem os mesmos campos existentes. Alterar os locais limpa o resultado anterior; calcule novamente. O mapa permite ampliar até 300%, rolar, arrastar com o mouse quando ampliado e ajustar a visualização. Rotas seguem os corredores até a porta, sem cruzar salas, sanitários ou pátio.

Para demonstrar o campus:
Abra **Abrir primeiro andar** para usar as salas. No campus, selecione Minishopping → Bloco A térreo e acompanhe as etapas da rota. As plantas externas mostram acessos pelo passeio, sem interiores inventados. Auditoria, catálogo e evidências desktop/mobile: [VALIDACAO_ROTAS_COMPLETAS.md](docs/VALIDACAO_ROTAS_COMPLETAS.md).
1. Na planta inicial, clique em **Definir origem**, **Sala 09** e **Sala 16**; o modo muda automaticamente para destino após escolher a origem. Calcule: **A1-S09 → A1-C1 → A1-S16**. Amplie e ajuste a planta. Pesquise **sala 14**, selecione o resultado e calcule novamente. Registro: [VALIDACAO_PLANTA_INTERATIVA.md](docs/VALIDACAO_PLANTA_INTERATIVA.md).
2. Origem **Minishopping**; pesquise **A0** e selecione **Bloco A · térreo**. Calcule: **MS-REF → MS-SAIDA → EXT-REF → EXT-CURVA → A0-REF**, um percurso explicitamente demonstrativo. Use **Etapas da rota** para acompanhar por área.
3. Selecione **Circulação A1 · 1** e **Circulação A1 · 3**. O mapa muda para o primeiro andar; calcule a rota e consulte as fotos de referência. Elas confirmam o pavimento, não a posição exata de cada ponto.
4. Em **Área do mapa → Bloco A**, alterne o andar. O térreo informa a ausência da planta. Minishopping → primeiro andar retorna **sem caminho**, pois nenhuma escada/conexão foi confirmada.
5. Para o exemplo anterior, escolha **Demonstração original**: Entrada → Sala 101 exibe **E0 → C1 → C2 → S101**.

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
