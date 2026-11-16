import type { Location } from '../modules/locations/location.types'

/** Catálogo fictício. Nomes e setores não confirmam a planta da instituição. */
export const mockLocations: readonly Location[] = [
  { id: 'entrada', name: 'Entrada', type: 'entrance', block: 'Minishopping', floor: 0, nodeId: 'E0' },
  { id: 'corredor-minishopping', name: 'Corredor Minishopping', type: 'corridor', block: 'Minishopping', floor: 0, nodeId: 'C1' },
  { id: 'corredor-bloco-1', name: 'Corredor Bloco 1', type: 'corridor', block: 'Bloco 1', floor: 0, nodeId: 'C2' },
  { id: 'sala-101', name: 'Sala 101', code: 'S101', type: 'room', block: 'Bloco 1', floor: 0, nodeId: 'S101' },
  { id: 'sala-102', name: 'Sala 102', code: 'S102', type: 'room', block: 'Bloco 1', floor: 0, nodeId: 'S102' },
  { id: 'laboratorio-01', name: 'Laboratório 01', code: 'L01', type: 'laboratory', block: 'Minishopping', floor: 0, nodeId: 'L01' },
]
