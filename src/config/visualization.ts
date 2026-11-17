import type { Positions2D, SiteMeasurement, VisualizationConfig } from '../modules/visualization/types'

/** Coordenadas de desenho, sem escala física ou relação com os pesos do grafo. */
export const schematicPositions: Positions2D = {
  E0: { x: 90, y: 330 }, C1: { x: 90, y: 210 }, L01: { x: 90, y: 70 },
  C2: { x: 310, y: 210 }, S101: { x: 310, y: 70 }, S102: { x: 310, y: 330 },
  C3: { x: 200, y: 140 }, I01: { x: 460, y: 330 },
}

export const visualizationConfig: VisualizationConfig = {
  modelUrl: null,
  schematicPositions,
  spatialPositions: {},
}

export const preliminaryMeasurements: readonly SiteMeasurement[] = [
  { area: 'Bloco A', description: 'Corredor longitudinal, comprimento aproximado', meters: 34, status: 'preliminary' },
  { area: 'Bloco A', description: 'Largura típica aproximada', meters: 2.56, status: 'preliminary' },
  ...[24.14, 12.43, 2.96, 2.48].map(meters => ({ area: null, description: 'Referência sem trecho identificado', meters, status: 'preliminary' as const })),
]
