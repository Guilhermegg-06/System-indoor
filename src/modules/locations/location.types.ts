export type LocationType =
  | 'entrance'
  | 'corridor'
  | 'room'
  | 'laboratory'
  | 'service'
  | 'shop'
  | 'restroom'
  | 'stairs'
  | 'elevator'
  | 'other'

/** Coordenadas de desenvolvimento, sem unidade ou levantamento físico validado. */
export interface Position3D {
  readonly x: number
  readonly y: number
  readonly z: number
}

export interface Location {
  readonly id: string
  readonly name: string
  readonly code?: string
  readonly type: LocationType
  readonly block: string
  readonly floor: number
  readonly nodeId: string
  readonly position?: Position3D
}
