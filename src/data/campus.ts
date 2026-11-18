import type { Location } from '../modules/locations/location.types'
import type { Graph } from '../modules/navigation/types'
import type { CampusMeasurement, CampusModel, CampusPhoto, PlaceReference } from '../modules/campus/types'
import type { Positions2D } from '../modules/visualization/types'
import { preliminaryMeasurements } from '../config/visualization'
import { blocoAFloorPlan, blocoAPlanPositions } from './blocoA.floorPlan'

// Referências de áreas, não cadastro de portas ou salas confirmadas.
export const campusLocations: readonly Location[] = [
  { id: 'ms-referencia', name: 'Minishopping', code: 'MS', type: 'shop', block: 'Minishopping', floor: 0, nodeId: 'MS-REF' },
  { id: 'ext-referencia', name: 'Percurso externo', code: 'EXT', type: 'corridor', block: 'Área externa', floor: 0, nodeId: 'EXT-REF' },
  { id: 'a0-referencia', name: 'Bloco A · térreo', code: 'A0', type: 'other', block: 'Bloco A', floor: 0, nodeId: 'A0-REF' },
  ...[1, 2, 3, 4].map(index => ({ id: `a1-c${index}`, name: `Circulação A1 · ${index}`, code: `A1-C${index}`, type: 'corridor' as const, block: 'Bloco A', floor: 1, nodeId: `A1-C${index}` })),
  { id: 'a1-sanitarios', name: 'Sanitários A1', code: 'A1-WC', type: 'restroom', block: 'Bloco A', floor: 1, nodeId: 'A1-WC' },
  { id: 'a1-foto', name: 'Corredores · fotos', code: 'A1-FOTO', type: 'corridor', block: 'Bloco A', floor: 1, nodeId: 'A1-FOTO' },
  ...blocoAFloorPlan.rooms.map(room => ({ id: room.locationId, name: `Sala ${room.number.toString().padStart(2, '0')}`,
    code: room.nodeId, type: 'room' as const, block: 'Bloco A', floor: 1, nodeId: room.nodeId })),
]

const photoIds = ['a1-corredor-01', 'a1-corredor-02']
export const campusMetadata: Readonly<Record<string, PlaceReference>> = Object.fromEntries(campusLocations.map(location => [location.id, {
  areaId: location.block === 'Minishopping' ? 'minishopping' : location.block === 'Área externa' ? 'percurso-externo' : 'bloco-a',
  floorId: location.floor === 1 ? 'a-1' : location.block === 'Minishopping' ? 'ms-0' : location.block === 'Área externa' ? 'externo-0' : 'a-0',
  confidence: location.id === 'a1-foto' ? 'confirmed' : 'approximate',
  positionMeters: null,
  photoIds: location.floor === 1 && location.type === 'corridor' ? photoIds : [],
  source: location.id === 'a1-foto' ? 'Fotos do grupo; primeiro andar confirmado pelo usuário.'
    : location.type === 'room' ? 'Numeração orientada pelo usuário: 09 no corredor inferior até 16 na lateral direita. Distribuição intermediária e portas aproximadas para demonstração.'
    : 'Descrição do grupo; posição exata e planta original pendentes.',
} satisfies PlaceReference]))

/** Todas as ligações são demonstrativas/topológicas. Nenhuma equivale a passagem física homologada. */
export const campusConnections = [
  ['MS-REF', 'EXT-REF'], ['EXT-REF', 'A0-REF'],
  ['A1-C1', 'A1-C2'], ['A1-C2', 'A1-C3'], ['A1-C3', 'A1-C4'], ['A1-C4', 'A1-C1'],
  ...blocoAFloorPlan.rooms.map(room => [room.nodeId, room.corridorNodeId]),
].map(([from, to]) => ({ id: `demo-${from}-${to}`, from, to, confidence: 'pending' as const, kind: 'demonstrative' as const, weightBasis: 'unitless' as const }))

export const campusGraph: Graph = {
  nodes: campusLocations.map(location => ({ id: location.nodeId })),
  edges: campusConnections.map(({ from, to }) => ({ from, to, weight: 1 })),
}

/** Unidades do desenho apenas. Não são x/y/z métricos do campus. */
export const campusDiagramPositions: Positions2D = {
  'MS-REF': { x: 90, y: 240 }, 'EXT-REF': { x: 280, y: 240 }, 'A0-REF': { x: 470, y: 240 },
  ...blocoAPlanPositions,
}

export const campusPhotos: readonly CampusPhoto[] = [
  { id: photoIds[0], src: '/images/bloco-a/primeiro-andar/corredor-real-01.webp', width: 508, height: 843,
    alt: 'Fotografia real do corredor do Bloco A, com piso tátil e placa 07 ao fundo.', areaId: 'bloco-a', floor: 1, positionConfidence: 'pending', scope: 'area-floor' },
  { id: photoIds[1], src: '/images/bloco-a/primeiro-andar/corredor-real-02.webp', width: 517, height: 857,
    alt: 'Fotografia real do corredor do Bloco A, com piso tátil, pilar verde e placa 08.', areaId: 'bloco-a', floor: 1, positionConfidence: 'pending', scope: 'area-floor' },
]

export const campusMeasurements: readonly CampusMeasurement[] = preliminaryMeasurements.map(measurement => ({
  id: `medida-${measurement.meters.toString().replace('.', '-')}`,
  description: measurement.description,
  meters: measurement.meters,
  confidence: measurement.status === 'validated' ? 'confirmed' : 'approximate',
  segmentId: null,
}))

export const campusModels: readonly CampusModel[] = [
  { id: 'modelo-ms', areaId: 'minishopping', floorId: 'ms-0', url: null, originMeters: null, metersPerUnit: null, yawDegrees: null,
    nodeIds: ['MS-REF'], entryNodeIds: [], confidence: 'pending' },
  { id: 'modelo-a1', areaId: 'bloco-a', floorId: 'a-1', url: null, originMeters: null, metersPerUnit: null, yawDegrees: null,
    nodeIds: campusLocations.filter(place => place.floor === 1).map(place => place.nodeId), entryNodeIds: [], confidence: 'pending' },
]
