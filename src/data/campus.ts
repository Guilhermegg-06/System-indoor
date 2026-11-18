import type { Location } from '../modules/locations/location.types'
import type { Graph } from '../modules/navigation/types'
import type { CampusMeasurement, CampusModel, CampusPhoto, PlaceReference } from '../modules/campus/types'
import type { Positions2D } from '../modules/visualization/types'
import { preliminaryMeasurements } from '../config/visualization'
import { blocoAFloorPlans, floorPlanPositions } from './blocoA.floorPlan'
import { sitePositions } from './campusSite'

// Catálogo demonstrativo; posições, portas e conexões não homologadas.
export const campusLocations: readonly Location[] = [
  { id: 'ms-referencia', name: 'Minishopping', code: 'MS', type: 'shop', block: 'Minishopping', floor: 0, nodeId: 'MS-REF' },
  { id: 'ext-referencia', name: 'Percurso externo', code: 'EXT', type: 'corridor', block: 'Área externa', floor: 0, nodeId: 'EXT-REF' },
  { id: 'a0-referencia', name: 'Bloco A · térreo', code: 'A0', type: 'other', block: 'Bloco A', floor: 0, nodeId: 'A0-REF' },
  ...blocoAFloorPlans.flatMap(plan => [
    ...[1, 2, 3, 4].map(index => ({ id: `a${plan.floor}-c${index}`, name: `Circulação ${plan.floor === 0 ? 'térreo' : 'A1'} · ${index}`, code: `A${plan.floor}-C${index}`, type: 'corridor' as const, block: 'Bloco A', floor: plan.floor!, nodeId: `A${plan.floor}-C${index}` })),
    { id: `a${plan.floor}-sanitarios`, name: plan.floor === 0 ? 'Sanitários térreo' : 'Sanitários A1', code: `A${plan.floor}-WC`, type: 'restroom' as const, block: 'Bloco A', floor: plan.floor!, nodeId: `A${plan.floor}-WC` },
    { id: `a${plan.floor}-transicao`, name: `Transição simulada · ${plan.floor === 0 ? 'térreo' : 'primeiro andar'}`, code: `A${plan.floor}-TRANSFER`, type: 'other' as const, block: 'Bloco A', floor: plan.floor!, nodeId: `A${plan.floor}-TRANSFER` },
    ...plan.rooms.map(room => ({ id: room.locationId, name: `Sala ${String(room.number).padStart(2, '0')}`, code: room.nodeId, type: 'room' as const, block: 'Bloco A', floor: plan.floor!, nodeId: room.nodeId })),
  ]),
  { id: 'a1-foto', name: 'Corredores · fotos', code: 'A1-FOTO', type: 'corridor', block: 'Bloco A', floor: 1, nodeId: 'A1-FOTO' },
]

const photoIds = ['a1-corredor-01', 'a1-corredor-02']
export const campusMetadata: Readonly<Record<string, PlaceReference>> = Object.fromEntries(campusLocations.map(location => [location.id, {
  areaId: location.block === 'Minishopping' ? 'minishopping' : location.block === 'Área externa' ? 'percurso-externo' : 'bloco-a',
  floorId: location.floor === 1 ? 'a-1' : location.block === 'Minishopping' ? 'ms-0' : location.block === 'Área externa' ? 'externo-0' : 'a-0',
  confidence: location.id === 'a1-foto' ? 'confirmed' : 'approximate',
  navigation: location.id === 'a1-foto' ? 'pending' : 'demonstrative',
  accessNote: location.id === 'a1-foto' ? 'Referência fotográfica sem ponto de captura localizado. Não é destino navegável.'
    : location.nodeId.includes('TRANSFER') ? 'Conexão vertical simulada para demonstração acadêmica. Não representa escada real nem rota acessível homologada.'
    : location.type === 'restroom' ? 'Chegada ao acesso coletivo pelo corredor esquerdo, sem entrar nos sanitários. Acesso demonstrativo.'
    : location.block === 'Bloco A' && location.floor === 0 ? 'Planta provisória do térreo — distribuição sujeita a validação. Entrada do passeio representada como transição de vistas demonstrativa.'
    : 'Acesso demonstrativo, sem homologação física.',
  positionMeters: null,
  photoIds: location.floor === 1 && location.type === 'corridor' ? photoIds : [],
  source: location.id === 'a1-foto' ? 'Fotos do grupo; primeiro andar confirmado pelo usuário.'
    : location.floor === 0 && location.block === 'Bloco A' ? 'Térreo provisório autorizado pelo responsável: organização espacial reaproveitada do primeiro andar, sujeita a validação.'
    : location.type === 'room' ? 'Numeração orientada pelo usuário: 09 no corredor inferior até 16 na lateral direita. Distribuição intermediária e portas aproximadas para demonstração.'
    : 'Descrição do grupo; posição exata e planta original pendentes.',
} satisfies PlaceReference]))

/** Todas as ligações são demonstrativas/topológicas. Nenhuma equivale a passagem física homologada. */
/** Mudanças de referencial: nunca desenhadas como linhas entre coordenadas SVG. */
export const campusTransitions = [
  { from: 'A0-REF', to: 'A0-ENTRADA', kind: 'entry' },
  { from: 'A0-TRANSFER', to: 'A1-TRANSFER', kind: 'vertical-simulated' },
] as const
export const campusConnections = [
  ['MS-REF', 'MS-SAIDA'], ['MS-SAIDA', 'EXT-REF'], ['EXT-REF', 'EXT-CURVA'], ['EXT-CURVA', 'A0-REF'],
  ...blocoAFloorPlans.flatMap(plan => {
    const p = `A${plan.floor}`
    return [[`${p}-C1`, `${p}-C2`], [`${p}-C2`, `${p}-WC-ACESSO`], [`${p}-WC-ACESSO`, `${p}-C3`],
      [`${p}-WC-ACESSO`, `${p}-WC`], [`${p}-C3`, `${p}-C4`], [`${p}-C4`, `${p}-TRANSFER`], [`${p}-TRANSFER`, `${p}-C1`],
      ...plan.rooms.map(room => [room.nodeId, room.corridorNodeId])]
  }),
  ['A0-ENTRADA', 'A0-C1'],
  ...campusTransitions.map(({ from, to }) => [from, to]),
].map(([from, to]) => ({ id: `demo-${from}-${to}`, from, to, confidence: 'pending' as const, kind: 'demonstrative' as const, weightBasis: 'unitless' as const }))

export const campusGraph: Graph = {
  nodes: [...campusLocations.map(location => ({ id: location.nodeId })),
    ...['MS-SAIDA', 'EXT-CURVA', 'A1-WC-ACESSO', 'A0-WC-ACESSO', 'A0-ENTRADA'].map(id => ({ id }))],
  edges: campusConnections.map(({ from, to }) => ({ from, to, weight: 1 })),
}

/** Unidades do desenho apenas. Não são x/y/z métricos do campus. */
export const campusDiagramPositions: Positions2D = {
  ...sitePositions,
  ...floorPlanPositions,
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
