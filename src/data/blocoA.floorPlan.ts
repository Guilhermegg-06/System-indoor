import type { FloorPlan, PlanRoom, Positions2D } from '../modules/visualization/types'

/** Redesenho aproximado para o MVP. Não é levantamento arquitetônico nem escala métrica. */
const rooms: readonly PlanRoom[] = [
  { number: 9, locationId: 'a1-sala-09', nodeId: 'A1-S09', corridorNodeId: 'A1-C1',
    x: 640, y: 800, width: 420, height: 170, door: { x: 900, y: 800 }, doorSide: 'north', approach: [{ x: 900, y: 745 }] },
  { number: 10, locationId: 'a1-sala-10', nodeId: 'A1-S10', corridorNodeId: 'A1-C2',
    x: 220, y: 800, width: 420, height: 170, door: { x: 380, y: 800 }, doorSide: 'north', approach: [{ x: 380, y: 745 }] },
  { number: 11, locationId: 'a1-sala-11', nodeId: 'A1-S11', corridorNodeId: 'A1-C2',
    x: 30, y: 500, width: 190, height: 300, door: { x: 220, y: 650 }, doorSide: 'east', approach: [{ x: 275, y: 650 }] },
  { number: 12, locationId: 'a1-sala-12', nodeId: 'A1-S12', corridorNodeId: 'A1-C3',
    x: 30, y: 200, width: 190, height: 300, door: { x: 220, y: 350 }, doorSide: 'east', approach: [{ x: 275, y: 350 }] },
  { number: 13, locationId: 'a1-sala-13', nodeId: 'A1-S13', corridorNodeId: 'A1-C3',
    x: 220, y: 30, width: 420, height: 170, door: { x: 380, y: 200 }, doorSide: 'south', approach: [{ x: 380, y: 255 }] },
  { number: 14, locationId: 'a1-sala-14', nodeId: 'A1-S14', corridorNodeId: 'A1-C4',
    x: 640, y: 30, width: 420, height: 170, door: { x: 900, y: 200 }, doorSide: 'south', approach: [{ x: 900, y: 255 }] },
  { number: 15, locationId: 'a1-sala-15', nodeId: 'A1-S15', corridorNodeId: 'A1-C4',
    x: 1060, y: 200, width: 190, height: 300, door: { x: 1060, y: 350 }, doorSide: 'west', approach: [{ x: 1005, y: 350 }] },
  { number: 16, locationId: 'a1-sala-16', nodeId: 'A1-S16', corridorNodeId: 'A1-C1',
    x: 1060, y: 500, width: 190, height: 300, door: { x: 1060, y: 650 }, doorSide: 'west', approach: [{ x: 1005, y: 650 }] },
]

export const blocoAFloorPlan: FloorPlan = {
  id: 'bloco-a-primeiro-andar', floor: 1, width: 1280, height: 1000, rooms,
  circulation: { x: 220, y: 200, width: 840, height: 600 },
  courtyard: { x: 575, y: 310, width: 375, height: 380 },
  restrooms: { x: 330, y: 310, width: 245, height: 380 },
}

/** Mesmo circuito A1-C1…C4, agora nos cantos da circulação da planta. */
export const blocoAPlanPositions: Positions2D = {
  'A1-TRANSFER': { x: 1005, y: 500 },
  'A1-C1': { x: 1005, y: 745 }, 'A1-C2': { x: 275, y: 745 },
  'A1-C3': { x: 275, y: 255 }, 'A1-C4': { x: 1005, y: 255 },
  'A1-WC': { x: 325, y: 500 }, 'A1-WC-ACESSO': { x: 275, y: 500 },
  // A foto é referência geral do andar; não recebe marcador físico na planta.
  'A1-FOTO': { x: 95, y: 915 },
  ...Object.fromEntries(rooms.map(room => [room.nodeId, room.door])),
}

/** Térreo provisório autorizado pelo responsável: mesma organização, IDs próprios. */
export const blocoAGroundPlan: FloorPlan = {
  ...blocoAFloorPlan, id: 'bloco-a-terreo', floor: 0,
  rooms: rooms.map(room => ({ ...room, number: room.number - 8,
    locationId: `a0-sala-${String(room.number - 8).padStart(2, '0')}`,
    nodeId: `A0-S${String(room.number - 8).padStart(2, '0')}`,
    corridorNodeId: room.corridorNodeId.replace('A1-', 'A0-'),
  })),
}
export const blocoAFloorPlans = [blocoAGroundPlan, blocoAFloorPlan] as const
export const floorPlanPositions: Positions2D = {
  ...blocoAPlanPositions,
  ...Object.fromEntries(Object.entries(blocoAPlanPositions).filter(([id]) => !id.includes('FOTO') && !id.includes('-S')).map(([id, point]) => [id.replace('A1-', 'A0-'), point])),
  ...Object.fromEntries(blocoAGroundPlan.rooms.map(room => [room.nodeId, room.door])),
  'A0-ENTRADA': { x: 1005, y: 800 },
  'A0-TRANSFER': { x: 1005, y: 500 }, 'A1-TRANSFER': { x: 1005, y: 500 },
}
