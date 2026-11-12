import type { Graph } from '../../modules/navigation/types'

const nodes = ['E0', 'C1', 'C2', 'S101', 'S102', 'L01', 'C3', 'I01'].map(id => ({ id }))
const edges = [
  { from: 'E0', to: 'C1', weight: 1 },
  { from: 'C1', to: 'C2', weight: 1 },
  { from: 'C2', to: 'S101', weight: 1 },
  { from: 'C2', to: 'S102', weight: 1 },
  { from: 'C1', to: 'L01', weight: 1 },
]
// Todas as arestas representam passagens bidirecionais fictícias.
export const G1: Graph = { nodes, edges }
export const G3: Graph = { nodes, edges: edges.map(e => ({ ...e, blocked: e.from === 'C1' && e.to === 'C2' })) }
export const G2: Graph = { nodes, edges: [...G3.edges,
  { from: 'C1', to: 'C3', weight: 1 }, { from: 'C3', to: 'C2', weight: 1 },
] }

