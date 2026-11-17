import type { Point3D } from '../navigation/types'

export interface Point2D { readonly x: number; readonly y: number }
export type Positions2D = Readonly<Record<string, Point2D | undefined>>
export type Positions3D = Readonly<Record<string, Point3D | undefined>>
export interface MapNode { id: string; name: string; point: Point2D }
export interface MapView {
  nodes: MapNode[]
  edges: { from: MapNode; to: MapNode; blocked: boolean }[]
  route: MapNode[]
  missingNodeIds: string[]
}
export interface VisualizationConfig {
  readonly modelUrl: string | null
  readonly schematicPositions: Positions2D
  readonly spatialPositions: Positions3D
}

/** Medição informada pela equipe; só associar ao grafo após validar a planta. */
export interface SiteMeasurement {
  readonly area: 'Minishopping' | 'Bloco A' | null
  readonly description: string
  readonly meters: number
  readonly status: 'preliminary' | 'validated'
  readonly nodeIds?: readonly string[]
}
