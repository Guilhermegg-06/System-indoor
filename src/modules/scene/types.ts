import type { Graph, RouteResult } from '../navigation/types'

/** Dados preparados pelo integrador; a cena não calcula rotas nem busca dados. */
export interface SceneContainerProps {
  graph: Graph | null
  route?: RouteResult | null
}
