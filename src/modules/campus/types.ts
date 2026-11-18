import type { Graph, Point3D } from '../navigation/types'
import type { Positions2D } from '../visualization/types'

export type Confidence = 'confirmed' | 'approximate' | 'pending'
export type AreaId = 'minishopping' | 'percurso-externo' | 'bloco-a'
export type MapArea = 'campus' | AreaId
export interface PlaceReference {
  readonly areaId: AreaId
  readonly floorId: string
  readonly confidence: Confidence
  readonly positionMeters: Point3D | null
  readonly photoIds: readonly string[]
  readonly source: string
}
export interface CampusPhoto {
  readonly id: string
  readonly src: string
  readonly width: number
  readonly height: number
  readonly alt: string
  readonly areaId: AreaId
  readonly floor: number
  readonly positionConfidence: Confidence
  readonly scope: 'area-floor'
}
export interface CampusMeasurement {
  readonly id: string
  readonly description: string
  readonly meters: number
  readonly confidence: Confidence
  readonly segmentId: string | null
}
export interface CampusModel {
  readonly id: string
  readonly areaId: AreaId
  readonly floorId: string
  readonly url: string | null
  readonly originMeters: Point3D | null
  readonly metersPerUnit: number | null
  readonly yawDegrees: number | null
  readonly nodeIds: readonly string[]
  readonly entryNodeIds: readonly string[]
  readonly confidence: Confidence
}
export interface DiagramRegion { readonly id: string; readonly label: string; readonly x: number; readonly y: number; readonly width: number; readonly height: number }
export interface CampusView {
  readonly id: string
  readonly graph: Graph
  readonly positions: Positions2D
  readonly regions: readonly DiagramRegion[]
  readonly notice: string
}
