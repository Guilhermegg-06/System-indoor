# Validação das issues 19 e 28

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
