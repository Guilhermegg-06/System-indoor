import { campusDiagramPositions, campusGraph, campusLocations, campusMetadata, campusPhotos } from '../../data/campus'
import type { CampusView, MapArea } from './types'

export function photosForLocation(locationId: string) {
  const ids = campusMetadata[locationId]?.photoIds ?? []
  return campusPhotos.filter(photo => ids.includes(photo.id))
}

export function getCampusView(area: MapArea, floor: number): CampusView {
  const selected = campusLocations.filter(place => area === 'campus' ? place.floor === 0
    : campusMetadata[place.id].areaId === area && (area !== 'bloco-a' || place.floor === floor))
  const ids = new Set(selected.map(place => place.nodeId))
  const first = area === 'bloco-a' && floor === 1
  return {
    id: `${area}-${floor}`,
    graph: { nodes: campusGraph.nodes.filter(node => ids.has(node.id)), edges: campusGraph.edges.filter(edge => ids.has(edge.from) && ids.has(edge.to)) },
    positions: campusDiagramPositions,
    regions: first ? [{ id: 'patio', label: 'Pátio · esquema', x: 115, y: 235, width: 200, height: 45 }]
      : area === 'campus' ? [
        { id: 'ms', label: 'Minishopping', x: 20, y: 100, width: 140, height: 260 },
        { id: 'externo', label: 'Área externa', x: 210, y: 160, width: 140, height: 200 },
        { id: 'a0', label: 'Bloco A · térreo', x: 400, y: 100, width: 140, height: 260 },
      ] : [],
    notice: first ? 'Primeiro andar · Topologia ilustrativa da descrição do grupo. Planta institucional original pendente. Portas, salas e escadas não cadastradas.'
      : area === 'bloco-a' ? 'Planta do térreo pendente. Apenas uma referência do edifício; distribuição interna não cadastrada.'
      : 'Percurso demonstrativo; conexões físicas ainda não validadas. Disposição relativa ilustrativa, sem precisão cartográfica.',
  }
}
