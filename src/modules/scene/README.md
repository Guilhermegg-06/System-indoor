# Fronteira da cena — 3D-01 (#23)

Esta entrega prepara o módulo isolado sobre a main, sem depender de levantamento
físico nem da pesquisa funcional. Usa somente dados fictícios. Não há renderizador
3D instalado: o contêiner informa explicitamente a indisponibilidade.

## Ponto de montagem

`SceneContainer.tsx` é a entrada visual, com contrato em `types.ts`.
Após integrar o layout da PR #35, o componente que compõe a tela deve montá-lo na
área de visualização definida pelo layout:

```tsx
import SceneContainer from './modules/scene/SceneContainer'

// Dentro da área de visualização, com dados recebidos pelo integrador:
<SceneContainer graph={graph} route={routeResult} />
```

Este exemplo não altera App. A montagem no aplicativo fica para depois da
integração da PR #35. Esta entrega não altera `App.tsx` nem estilos globais.
O elemento interno `data-scene-viewport` reserva o ponto onde o futuro renderizador
substituirá a mensagem. O contêiner tem altura mínima e ocupa a largura disponível;
o layout externo decide sua área.

## Propriedades mínimas

| Propriedade | Tipo | Responsabilidade |
| --- | --- | --- |
| `graph` | `Graph \| null` (obrigatória) | Grafo fictício fornecido pelo integrador; `null` indica ausência de dados. |
| `route` | `RouteResult \| null` (opcional) | Resultado já calculado; omitido ou `null` indica nenhuma rota fornecida. |

Os tipos vêm de `navigation/types.ts` por imports exclusivamente de tipo. A cena
não importa fixtures, não busca locais, não calcula rotas e não modifica entradas.
Nesta etapa `route` apenas estabelece o contrato; nenhum resultado é desenhado.
Um grafo fornecido, inclusive vazio, não torna o visualizador disponível.

Coordenadas dos nós são opcionais no contrato atual. A futura integração deverá
validar coordenadas finitas e resolver IDs da rota antes de desenhar. Ausência de
coordenadas não autoriza inventar geometria da faculdade. Pesos não representam
metros ou minutos. Resultados diferentes de `ok` não devem gerar linha de rota;
mensagens textuais de navegação permanecem sob responsabilidade da UI.

## Escolha de integração

Adotar React Three Fiber como renderizador React de Three.js quando houver uma
cena a implementar. Essa opção acompanha a composição e o ciclo de vida React do
projeto. Three.js fica restrito à cena; o motor permanece independente de React e
WebGL. A [documentação oficial](https://r3f.docs.pmnd.rs/getting-started/introduction)
descreve essa integração e a compatibilidade necessária entre versões de React e
Fiber. Conferir versões compatíveis no momento da instalação.

Nenhuma biblioteca foi adicionada: instalar Three.js e Fiber sem consumo
aumentaria dependências sem habilitar comportamento. Quando implementado, o
renderizador poderá hospedar `Canvas` no ponto reservado e deverá preservar uma
mensagem acessível para ausência de suporte WebGL ou falha de inicialização.
O estado atual não detecta WebGL porque não o utiliza.

## Validação e limitações

`SceneContainer.test.tsx` verifica identificação acessível, indisponibilidade sem
grafo, atualização da mensagem ao receber dados e preservação de entradas imutáveis.
Executar `npm run lint`, `npm run typecheck`, `npm test` e `npm run build`.

Validação local em 16/11/2026: lint, typecheck, 41 testes (4 arquivos) e build
passaram. No PowerShell deste ambiente foi usado `npm.cmd` porque a política de
execução bloqueia o wrapper `npm.ps1`.

Não há validação de canvas, WebGL, desempenho mobile ou mapa real. Cenário fictício
(#24), movimentação (#25), colisões (#26) e exibição/integração da rota (#27/#31)
permanecem em suas próprias entregas. A API poderá ser ampliada nessas tarefas
quando houver necessidades concretas.

