import { campusDiagramPositions, campusGraph, campusMetadata, campusPhotos } from '../../data/campus'
import { blocoAFloorPlan } from '../../data/blocoA.floorPlan'
import type { CampusView, MapArea } from './types'

export function photosForLocation(locationId: string) {
  const ids = campusMetadata[locationId]?.photoIds ?? []
  return campusPhotos.filter(photo => ids.includes(photo.id))
}

export function getCampusView(area: MapArea, floor: number): CampusView {
  const first = area === 'bloco-a' && floor === 1
  const ids = new Set(campusGraph.nodes.filter(node => first ? node.id.startsWith('A1-') : !node.id.startsWith('A1-')).map(node => node.id))
  return {
    id: `${area}-${floor}`,
    graph: { nodes: campusGraph.nodes.filter(node => ids.has(node.id)), edges: campusGraph.edges.filter(edge => ids.has(edge.from) && ids.has(edge.to)) },
    positions: campusDiagramPositions,
    floorPlan: first ? blocoAFloorPlan : undefined,
    siteArea: first ? undefined : area,
    regions: [],
    notice: first ? 'Primeiro andar · Planta 2D aproximada para demonstração. Planta institucional original pendente. Posições e portas estimadas; medidas sem escala validada.'
      : area === 'bloco-a' ? 'Planta do térreo pendente. Apenas uma referência do edifício; distribuição interna não cadastrada.'
      : 'Percurso demonstrativo; conexões físicas ainda não validadas. Disposição relativa ilustrativa, sem precisão cartográfica.',
  }
}
