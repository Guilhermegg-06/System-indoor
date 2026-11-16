# Componentes
Componentes compartilhados serão extraídos apenas quando necessários à interface.

## Resultado da rota — UI-04 (#22)

`RouteResultView` apresenta um `RouteResult` recebido por propriedade. Omitir
`result`, passar `null` ou `undefined` apresenta o estado inicial. O componente
importa apenas o tipo `RouteResult` do motor, não calcula rotas, não consulta
locais e não modifica o resultado.

```tsx
import { RouteResultView } from './components/RouteResultView'
import type { RouteResult } from './modules/navigation/types'

function RoutePanel({ result }: { result: RouteResult | null }) {
  return <RouteResultView result={result} />
}
```

O caminho usa uma lista ordenada com os identificadores recebidos, sem nomes de
salas presumidos. O custo é explicitamente fictício e não tem unidade física.
Há mensagens próprias para `same-location`, `no-path`, `invalid-location` e
`invalid-graph`. Os estilos estão limitados ao componente por CSS Modules.

A integração com seleção e motor pertence à #30. Esta entrega não altera
`App.tsx`, o CSS global nem o layout proposto na PR #35. Consulte
[a validação e as limitações](../../docs/VALIDACAO_22.md) antes da integração.

