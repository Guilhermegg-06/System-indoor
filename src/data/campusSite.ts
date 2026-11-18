import type { Positions2D, PlanRect } from '../modules/visualization/types'

/** Implantação vetorial própria, aproximada a partir da referência fornecida pelo usuário.
 * Os destinos externos representam acessos pelo passeio, não interiores levantados. */
export const sitePositions: Positions2D = {
  'MS-REF': { x: 660, y: 500 }, 'MS-SAIDA': { x: 780, y: 500 },
  'EXT-REF': { x: 780, y: 460 }, 'EXT-CURVA': { x: 780, y: 400 },
  'A0-REF': { x: 820, y: 400 },
}
export const siteBuildings: readonly PlanRect[] = [
  { x: 80, y: 520, width: 980, height: 150 },
  { x: 40, y: 500, width: 110, height: 150 },
  { x: 1060, y: 580, width: 60, height: 130 },
  { x: 820, y: 190, width: 250, height: 250 },
]
export const siteWalkways: readonly PlanRect[] = [
  { x: 40, y: 470, width: 1080, height: 60 },
  { x: 740, y: 140, width: 80, height: 390 },
  { x: 1060, y: 140, width: 70, height: 570 },
  { x: 40, y: 670, width: 1090, height: 50 },
  { x: 40, y: 470, width: 40, height: 250 },
  { x: 780, y: 140, width: 350, height: 50 },
]
