import { campusDiagramPositions, campusGraph, campusMetadata, campusPhotos } from '../../data/campus'
import { blocoAFloorPlans } from '../../data/blocoA.floorPlan'
import type { CampusView, MapArea } from './types'

export function photosForLocation(locationId: string) {
  const ids = campusMetadata[locationId]?.photoIds ?? []
  return campusPhotos.filter(photo => ids.includes(photo.id))
}

/** Frames intentionally separate: outdoor coordinates never connect to indoor SVG coordinates. */
export function campusFrame(id: string) { return id.startsWith('A1-') ? 'a1' : id.startsWith('A0-') && id !== 'A0-REF' ? 'a0' : 'site' }
export function getCampusView(area: MapArea, floor: number): CampusView {
  const indoor = area === 'bloco-a'
  const frame = indoor ? floor === 1 ? 'a1' : 'a0' : 'site'
  const ids = new Set(campusGraph.nodes.filter(node => campusFrame(node.id) === frame).map(node => node.id))
  return {
    id: `${area}-${floor}`,
    graph: { nodes: campusGraph.nodes.filter(node => ids.has(node.id)), edges: campusGraph.edges.filter(edge => ids.has(edge.from) && ids.has(edge.to)) },
    positions: campusDiagramPositions,
    floorPlan: indoor ? blocoAFloorPlans[floor === 1 ? 1 : 0] : undefined,
    siteArea: indoor ? undefined : area, regions: [],
    notice: indoor ? floor === 0 ? 'Planta provisória do térreo — distribuição sujeita a validação.'
      : 'Primeiro andar · Planta 2D aproximada. Planta institucional original pendente. Portas e distribuição intermediária estimadas.'
      : 'Implantação aproximada e percurso demonstrativo. Interiores do Minishopping não levantados.',
  }
}
export function routeStages(path: readonly string[]) {
  const frames = path.map(campusFrame).filter((frame, index, values) => index === 0 || frame !== values[index - 1])
  return frames.map(frame => frame === 'site'
    ? { area: 'campus' as MapArea, floor: 0, name: 'Campus e percurso externo' }
    : { area: 'bloco-a' as MapArea, floor: frame === 'a1' ? 1 : 0, name: frame === 'a1' ? 'Primeiro andar' : 'Térreo' })
}
