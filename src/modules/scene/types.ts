import type { Graph, RouteResult } from '../navigation/types'
import type { Positions3D } from '../visualization/types'

/** Dados preparados pelo integrador; a cena não calcula rotas nem busca dados. */
export interface SceneContainerProps {
  graph: Graph | null
  route?: RouteResult | null
  modelUrl?: string | null
  spatialPositions?: Positions3D
}
