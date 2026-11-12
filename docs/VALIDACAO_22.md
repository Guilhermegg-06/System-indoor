# Validação da apresentação do resultado da rota

Entrega da [issue #22 — UI-04](https://github.com/Guilhermegg-06/System-indoor/issues/22),
parte do [épico #6 — Interface](https://github.com/Guilhermegg-06/System-indoor/issues/6).
A integração entre seleção, motor e apresentação continua na #30.

## Escopo e contrato

- Branch local: `feat/ui-04-resultado-rota`, criada da main remota em `88bf84b`,
  com a PR #34 integrada.
- `RouteResultView` recebe `result?: RouteResult | null`; propriedade omitida,
  `null` ou `undefined` representam o estado inicial.
- `ok` apresenta todos os pontos na ordem recebida em uma lista ordenada e o
  custo fictício sem unidade física. Não há conversão para metros ou minutos.
- `same-location`, `no-path`, `invalid-location` e `invalid-graph` têm mensagens
  distintas. Resultados sem caminho removem a lista e o custo anteriores.
- Região com título associado e mensagem de status com anúncio educado de
  atualizações. CSS Modules evita regras globais novas.
- O componente importa apenas o tipo do motor. Não calcula rotas, consulta
  grafos ou presume nomes reais de salas.
- `App.tsx`, `src/index.css`, o motor, seus contratos e os grafos não foram
  alterados. O layout proposto na PR #35 não foi incorporado nem substituído.

## Arquivos

- `src/components/RouteResultView.tsx`: apresentação isolada.
- `src/components/RouteResultView.module.css`: estilos locais.
- `src/tests/RouteResultView.test.tsx`: 17 testes de apresentação e atualização.
- `src/components/README.md`: contrato e exemplo para integração futura.
- `package.json` e `package-lock.json`: dependências de testes de UI.
- `docs/VALIDACAO_22.md`: evidências, limitações e preparação da PR.

React Testing Library, DOM Testing Library e Happy DOM foram adicionados apenas
como dependências de desenvolvimento. Permitem testar a saída acessível e
atualizações reais das propriedades, sem substituir o React por mocks. São as
mesmas ferramentas e faixas de versão já adotadas na PR #35. Happy DOM está
habilitado apenas no arquivo de testes da UI; os testes do motor continuam no
ambiente Node.

## Evidências locais em 12 de novembro de 2026

Ambiente: Windows, Node `24.22.2`, npm `11.19.1`.

| Verificação | Resultado |
| --- | --- |
| `npm ci`, antes das alterações | OK; dependências da base instaladas |
| `npm test`, antes das alterações | OK; 18 testes existentes |
| RED do componente com retorno vazio | 17 testes falharam por ausência da apresentação esperada |
| GREEN após implementação | Os mesmos 17 testes passaram |
| `npm run lint` | OK; sem avisos |
| `npm run typecheck` | OK |
| `npm test` | OK; 35 testes em 2 arquivos |
| `npm run build` | OK |
| Bundle isolado do componente e de seu CSS | OK; entrada temporária de Vite, removida após a conferência |
| `git diff --check` | OK |

Os testes verificam estado inicial, as quatro mensagens sem caminho, G1 normal
(CTF022), G1 inverso (CTF023), desvio em G2 (CTF026), mesma origem (CTF019), G3
sem caminho (CTF028), local inexistente e grafo inválido. Também conferem custo
zero e fracionário sem conversão, identificadores recebidos sem tradução,
substituição de caminhos e limpeza de resultados antigos. `findRoute` é usado
somente nos testes para preparar resultados a partir dos grafos fictícios.

## Auditoria final antes do commit

Conferência repetida em 12 de novembro de 2026, após consultar a issue #22 e
atualizar apenas a referência remota com `git fetch origin main`.

- A branch ativa é `feat/ui-04-resultado-rota`. O reflog confirma sua criação
  a partir de `origin/main` em `88bf84b`. Não há commits da tarefa; o trabalho
  permanece como alterações locais, preparadas no staging por caminhos explícitos.
- A main remota agora está em `cd544c0`, dois commits à frente: a implementação
  do componente de pesquisa e o merge da PR #37. A branch nasceu da main
  atualizada na criação, mas está desatualizada em relação à consulta final.
  Nenhum merge ou rebase foi realizado. A branch local `main` continua em
  `88bf84b`, sem modificações.
- O upstream foi corrigido de `origin/main` para o destino
  `origin/feat/ui-04-resultado-rota` na configuração local. Essa branch remota
  ainda não existe: `git branch -vv` mostra `[gone]`. A configuração prepara
  o acompanhamento futuro, sem criar a referência remota ou publicar código.
- Os sete arquivos da entrega foram revisados. Não foram encontrados bugs
  funcionais ou lacunas relevantes de cobertura para os critérios da #22.
  Não houve alteração adicional de código de produção ou de testes nesta auditoria.
- O componente respeita a união discriminada `RouteResult`, preserva a ordem
  dos pontos e recebe o resultado pronto. Não depende de pesquisa, cadastro,
  coordenadas, algoritmo de rota ou 3D. Os estados iniciais e os cinco status
  estão cobertos, incluindo a troca e a remoção de resultados anteriores.
- O lockfile mantém as versões de todos os pacotes existentes na base e
  adiciona 22 pacotes, todos de desenvolvimento. O manifesto e o lockfile
  concordam; não há nova dependência de produção. `@testing-library/dom` é
  explicitado porque fornece `within` nos testes e é peer de React Testing
  Library. Happy DOM fornece o DOM apenas à suíte de interface.
- A documentação foi corrigida para dizer que somente o tipo do motor é
  importado e para não descrever a PR #35 como ainda em revisão: ela está
  fechada sem merge. Não foi feita alteração no layout.
- O diretório vazio `.route-preview.local` foi removido após conferir seu
  caminho e conteúdo. `dist` e os artefatos de teste/build em `node_modules`
  continuam ignorados, fora do staging. A verificação por padrões comuns de
  chaves privadas, tokens e credenciais não encontrou ocorrências nos sete
  arquivos da entrega; ela não constitui garantia absoluta de ausência de segredos.
- `git diff --check` e `git diff --cached --check` passaram. O diff do staging
  foi conferido: contém exclusivamente os sete arquivos descritos acima.

| Verificação repetida | Resultado real |
| --- | --- |
| `npm run lint` | OK; código de saída 0, sem avisos |
| `npm run typecheck` | OK; código de saída 0 |
| `npm test` | OK; código de saída 0, 35 testes em 2 arquivos (17 da UI e 18 do motor) |
| `npm run build` | OK; código de saída 0 |

As verificações repetidas cobrem o estado local baseado em `88bf84b`. A
compatibilidade com a main mais recente ainda deve ser validada após uma
atualização autorizada da branch, conciliando `package.json` e
`package-lock.json`, que também foram alterados pela PR #37. A auditoria não
publicou nada e não executou commit, push, merge ou abertura de Pull Request.

## Limitações e pendências

- Não há integração com pesquisa, seleção, cálculo ou 3D. A aplicação principal
  continua com seu comportamento anterior; o componente será montado pela #30.
- Todos os cenários são fictícios. Não validam o campus, medidas ou tempo de
  deslocamento.
- A conferência visual foi interrompida pela proteção de computer use, que não
  conseguiu confirmar a URL atual do Edge. Não há homologação visual, responsiva,
  em dispositivos físicos ou com leitor de tela. Os testes de DOM verificam
  estrutura semântica e conteúdo, sem comprovar esses comportamentos visuais.
- A execução local usou Node 24. A CI configurada usa Node 22 e deve passar na
  PR antes do merge; não houve execução remota de CI nesta entrega.
- A branch está dois commits atrás da main remota consultada na auditoria.
  A atualização e a revalidação sobre a base recente permanecem pendentes.
- A issue #22 já estava atribuída a `KaueSun` ao ser consultada. O CLI não pôde
  consultar ou atualizar o Project por ausência do escopo `read:project`.
  A movimentação para `In Progress` permanece pendente. Para leitura e escrita
  pelo CLI, o titular pode executar `gh auth refresh -s project`, desde que
  tenha acesso ao Project privado.
- Commits, push e abertura de PR aguardam o usuário, conforme solicitado.
  Não houve merge nem publicação.

## Preparação da Pull Request

Título sugerido: `feat: apresentar resultado da rota em componente isolado`.

Descrição sugerida:

> Adiciona `RouteResultView` para apresentar um `RouteResult` já calculado,
> com estado inicial, caminho em ordem e mensagens distintas para mesma origem,
> ausência de caminho, local inválido e grafo inválido. Usa exclusivamente
> identificadores e custos fictícios, sem converter pesos para unidades reais.
>
> Inclui 17 testes de UI; os 35 testes do projeto, lint, typecheck e build
> passaram localmente. O bundle isolado do componente e de seu CSS também passou.
> A validação visual foi bloqueada pela proteção de computer use.
>
> A integração com a aplicação pertence à #30. App, CSS global e layout da
> PR #35 foram preservados. Evidências e limitações em `docs/VALIDACAO_22.md`.
>
> Closes #22

Após revisar e fazer seus commits nesta branch, publique-a e abra a PR com base
`main`. Aguarde a CI e a revisão exigida pelo repositório antes de integrar.
