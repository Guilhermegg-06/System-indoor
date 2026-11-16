# Validação das issues 19 e 28

As seções iniciais registram a entrega original de 12 de novembro de 2026.
A retomada e a validação sobre a main atual estão registradas ao final.

## Reconhecimento

Foram lidas integralmente as issues #19 e #28. A `main`, no commit `60d233e`, continha apenas o commit inicial vazio. Nenhum `AGENTS.md` foi encontrado no checkout ou em seus diretórios ancestrais consultados.

A PR #34 ainda estava aberta. Suas configurações, testes e separação de módulos foram inspecionados. Foram reaproveitadas apenas as configurações mínimas compatíveis de React, TypeScript, Vite, Vitest, Oxlint e CI. O motor e os grafos dessa PR não foram incorporados.

## TDD dos dados

1. **RED — `f83e070`:** contrato declarado, catálogo vazio e nove testes. A execução de `npm test -- src/tests/locations.test.ts` apresentou **9 falhas**, todas relacionadas aos registros ausentes.
2. **GREEN — `13c6496`:** seis registros fictícios adicionados. A mesma execução apresentou **9 testes passando**.
3. **Revisão:** preservado o catálogo plano tipado; não foi necessário criar serviço, validador genérico ou camada de acesso. A apresentação repetida de origem/destino foi extraída para `LocationField`, que depende apenas do tipo `Location`.

Os testes verificam identificação, nome, setor, tipo, andar numérico finito, IDs únicos, nodeIds não vazios e pertencentes ao conjunto esperado, recuperação pelo nó e pelo código, além da possibilidade de omitir coordenadas. A compatibilidade com nós é verificada por IDs conhecidos, sem implementar um grafo nesta entrega.

## Layout

Cinco testes com React Testing Library e Happy DOM verificam título e conteúdo principal, aviso de dados fictícios, busca e botão desativados, origem/destino preenchidos a partir do catálogo mas indisponíveis, área de mapa/3D e resumo sem rota inventada. O ambiente DOM é aplicado apenas ao arquivo de teste de componentes.

Não há estado de seleção, eventos de busca ou chamadas de rede na UI. A prévia usa elementos semânticos, labels associados aos campos e um link para pular ao conteúdo usando o teclado.

## Verificações

- `npm run lint`: passou sem avisos.
- `npm run typecheck`: passou.
- `npm test`: 14 testes passaram, sendo 9 de dados e 5 de interface.
- `npm run build`: passou.

Smoke no Microsoft Edge em 320, 390, 768 e 1440 pixels de largura: sem rolagem horizontal, sem erros de console, campos indisponíveis, sete opções por seletor (placeholder e seis locais), regiões identificadas e link de pular conteúdo funcionando pelo teclado. A conferência visual incluiu celular e desktop. O ícone local foi adicionado para eliminar uma requisição 404 do navegador.

Prévia de [celular](screenshots/layout-mobile.png) e [desktop](screenshots/layout-desktop.png). As imagens mostram o shell, não navegação funcional. Esse smoke complementa os testes de componentes; não equivale a validação em dispositivos físicos.

## Limitações

- Dados de desenvolvimento, sem cadastro real, coordenadas ou medidas da instituição.
- Controles de navegação visualmente preparados, mas desativados.
- Mapa/3D representado somente por uma área reservada, sem planta ou modelo.
- Sem A*, Dijkstra, grafos completos, Three.js, Supabase, autenticação ou posicionamento automático.
- Aprovação e merge ficam a cargo da revisão humana; a entrega não inclui merge nem deploy.

## Retomada em 16 de novembro de 2026

A retomada usa a mesma branch `feat/base-dados-layout-19-28` e a PR #35.
O histórico original até `bc4068e` foi preservado. A PR #35 havia sido
encerrada sem merge, enquanto as PRs #34, #37 e #38 já estavam integradas
à main em `5cfa38f`.

KaueSun é o responsável vigente pela #28 e foi adotado como coordenador desta
retomada. A #19 permanece atribuída a Guilhermegg-06. A definição compartilhada
foi consultada ao usuário durante a execução e pode ser ajustada pela equipe.

O merge local da main apresentou conflitos de adição em seis arquivos.

- `src/App.tsx` e `src/index.css` preservam integralmente o shell e os estilos
  originais da PR #35, com os controles indisponíveis.
- `index.html` preserva o favicon local e os metadados da entrega original.
- `.github/workflows/ci.yml` e `.nvmrc` seguem o conteúdo atual da main.
  As diferenças anteriores se limitavam a linhas vazias finais.
- `README.md` combina a arquitetura da main com o contrato dos locais e o
  escopo do layout, atualizando a situação das entregas já integradas.

`package.json` e `package-lock.json` já eram idênticos aos da main. Todas as
dependências e versões existentes foram preservadas, incluindo
`@testing-library/dom`, `@testing-library/react` e `happy-dom`. A instalação
reproduzível foi executada com `npm ci`.

As comparações com `bc4068e` confirmaram a preservação de `Location`, dos seis
registros, de `LocationField`, do shell, dos estilos e dos cinco testes do
layout. Os nove testes originais de dados continuam presentes. Foi acrescentado
um teste que confere cada `nodeId` do catálogo nos grafos G1, G2 e G3 efetivos,
para detectar divergências que a lista estática de IDs não detectaria.

As comparações com `origin/main` confirmaram a preservação integral do motor,
dos grafos, de SearchField, de RouteResultView e de seus testes. Os componentes
isolados continuam disponíveis para as integrações das issues #21, #29 e #30.

## Validação da retomada

Ambiente Windows, Node `22.23.5` portátil e npm `10.9.9`.

| Verificação | Resultado |
| --- | --- |
| `npm ci` | OK, código de saída 0 |
| `npm run lint` | OK, código de saída 0, sem avisos |
| `npm run typecheck` | OK, código de saída 0 |
| `npm test` | OK, 53 testes em 5 arquivos |
| `npm run build` | OK, código de saída 0 |

A primeira execução dos testes encontrou uma instalação local incompleta de
React DOM. Após `npm ci`, a suíte passou integralmente. Durante a instalação,
o npm refez automaticamente o download de um tarball de tipos após detectar
conteúdo corrompido no cache e concluiu a instalação com sucesso.

Os 53 testes abrangem 10 de dados, 5 do layout, 18 do motor, 3 de SearchField e
17 de RouteResultView. O catálogo segue com exatamente seis registros fictícios,
sem coordenadas adicionadas ou alteração de nomes, andares ou setores.

## Pendências da retomada

- A conferência visual nova em celular e desktop foi interrompida pela proteção
  de computer use, que não conseguiu confirmar a URL atual do Edge. As imagens
  e a evidência de 12 de novembro permanecem como registro histórico. A nova
  homologação responsiva, por teclado e em dispositivos físicos está pendente.
- O token atual não possui o escopo `read:project`. O CLI não pôde atualizar
  o Project privado para `In Progress`. A atualização depende de um titular com
  acesso ao quadro ou da habilitação do escopo `project` no CLI.
- A revisão da equipe e a CI remota devem ser conferidas na PR #35 retomada.
  Done depende da validação restante e da integração na main.
