import type { Point3D } from '../navigation/types'
import type { DiagramRegion, MapArea } from '../campus/types'

export interface Point2D { readonly x: number; readonly y: number }
export interface PlanRect { readonly x: number; readonly y: number; readonly width: number; readonly height: number }
export interface PlanRoom extends PlanRect {
  readonly number: number
  readonly locationId: string
  readonly nodeId: string
  readonly corridorNodeId: string
  readonly door: Point2D
  readonly doorSide: 'north' | 'south' | 'east' | 'west'
  /** Pontos do desenho entre a porta e o nó do corredor, sem unidade física. */
  readonly approach: readonly Point2D[]
}
export interface FloorPlan {
  readonly floor?: 0 | 1
  readonly id: string
  readonly width: number
  readonly height: number
  readonly circulation: PlanRect
  readonly courtyard: PlanRect
  readonly restrooms: PlanRect
  readonly rooms: readonly PlanRoom[]
}
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
  readonly walkUrl?: string
  readonly modelUrl: string | null
  readonly schematicPositions: Positions2D
  readonly spatialPositions: Positions3D
  readonly mapNotice?: string
  readonly mapTitle?: string
  readonly regions?: readonly DiagramRegion[]
  readonly floorPlan?: FloorPlan
  readonly siteArea?: MapArea
}

/** Medição informada pela equipe; só associar ao grafo após validar a planta. */
export interface SiteMeasurement {
  readonly area: 'Minishopping' | 'Bloco A' | null
  readonly description: string
  readonly meters: number
  readonly status: 'preliminary' | 'validated'
  readonly nodeIds?: readonly string[]
}
