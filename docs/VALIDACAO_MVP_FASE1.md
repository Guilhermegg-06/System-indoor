# MVP — fase 1: navegação funcional

Issues #21, #29 e #30. Base: `main` em `77e8470`. Branch: `feat/mvp-navegacao-funcional`.

## Fluxo entregue

- `LocationField` controlado por `Location.id`, com origem, destino, inversão e erros associados aos campos vazios.
- `SearchField` integrado ao catálogo original; busca por nome/código, consulta vazia, nenhum resultado e escolha de destino.
- O App resolve os registros e chama `findRoute(G1, origem.nodeId, destino.nodeId)`. `RouteResultView` apresenta os cinco estados existentes.
- Mudanças nos locais, inversão e destino escolhido pela pesquisa apagam o resultado anterior. O foco vai ao campo ausente ou ao resultado após renderizar.
- Motor, contratos, fixtures e seis registros preservados. O parâmetro opcional `graph` do App permite testar erros com grafos reais; a aplicação usa G1, sem seletor de grafo.

## TDD executado em 17/11/2026

| Etapa | RED observado antes da implementação | GREEN |
| --- | --- | --- |
| Seleção e validação | 8 falhas entre App e LocationField | 9 testes passaram |
| Pesquisa | 3 falhas de integração; 6 falhas na busca ainda vazia | 23 testes passaram, incluindo SearchField |
| Cálculo e limpeza | 13 falhas no App, incluindo a atualização do resumo | Suíte completa: 84 testes passaram |

Os testes antigos de controles desativados foram atualizados para os requisitos funcionais. A cobertura de título, catálogo, mapa e estado inicial foi mantida. Os 18 testes do motor não foram modificados.

## Verificação

`npm run lint`, `npm run typecheck`, `npm test` e `npm run build`: aprovados. O CI executa os mesmos comandos após `npm ci`.

Smoke automatizado com Playwright/Edge no servidor local: desktop 1440 × 900, mobile 390 × 844 e 320 × 740. Passaram: campos vazios, pesquisa, seleção, cálculo pelo teclado, sequência de nós, custo fictício, troca de destino, remoção da rota antiga, inversão, mesmo local e limpeza de busca. Sem erros de console ou transbordamento horizontal. Capturas conferidas em desktop e mobile. O smoke detectou foco prematuro no celular; corrigido para ocorrer após renderizar o resultado e repetido com sucesso nas três dimensões.

## Demonstração e limites

Execute `npm ci` e `npm run dev`. Selecione **Entrada → Sala 101** e calcule: **E0 → C1 → C2 → S101**, custo fictício **3**, sem unidade física. Troque o destino para Sala 102: o percurso antigo desaparece até um novo cálculo.

O mapa/3D permanece como placeholder. Sem backend, login ou localização automática. Grafos, locais e pesos são fictícios; não representam distância, tempo ou levantamento do campus. O smoke em viewport mobile não substitui teste em aparelho físico. PR para revisão, sem merge automático.
