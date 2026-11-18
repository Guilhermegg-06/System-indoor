import type { Graph } from '../navigation/types'
import type { Location } from '../locations/location.types'
import type { PlaceReference } from './types'
import type { PlanRect, Point2D, Positions2D } from '../visualization/types'
import { findRoute } from '../navigation/findRoute'
import { floorPlanEdgePoints } from '../visualization/floorPlanGeometry'
import { blocoAFloorPlans } from '../../data/blocoA.floorPlan'
import { campusTransitions } from '../../data/campus'
import { campusFrame } from './selectors'
import { siteWalkways, siteBuildings } from '../../data/campusSite'

export type RouteAvailability = 'usable' | 'demonstrative' | 'unavailable'
export function auditNavigation(graph: Graph, locations: readonly Location[], metadata: Readonly<Record<string, PlaceReference>>, positions: Positions2D, confirmedConnections: readonly (readonly [string, string])[] = []) {
  const errors: string[] = []
  const ids = new Set(graph.nodes.map(node => node.id))
  if (ids.size !== graph.nodes.length) errors.push('duplicate-node')
  for (const node of graph.nodes) {
    const pending = locations.some(place => place.nodeId === node.id && metadata[place.id]?.navigation === 'pending')
    if (!pending && !graph.edges.some(edge => !edge.blocked && (edge.from === node.id || edge.to === node.id))) errors.push(`isolated-node:${node.id}`)
  }
  for (const edge of graph.edges) {
    if (!ids.has(edge.from) || !ids.has(edge.to)) errors.push(`unknown-edge:${edge.from}:${edge.to}`)
    if (!Number.isFinite(edge.weight) || edge.weight < 0) errors.push(`invalid-weight:${edge.from}:${edge.to}`)
    if (edge.blocked) continue
    const from = positions[edge.from], to = positions[edge.to]
    if (!from || !to || ![from.x, from.y, to.x, to.y].every(Number.isFinite)) { errors.push(`missing-geometry:${edge.from}:${edge.to}`); continue }
    const frame = campusFrame(edge.from)
    if (frame !== campusFrame(edge.to)) {
      if (!campusTransitions.some(link => (link.from === edge.from && link.to === edge.to) || (link.from === edge.to && link.to === edge.from))) errors.push(`unknown-floor-link:${edge.from}:${edge.to}`)
      continue
    }
    const first = frame !== 'site'
    const plan = blocoAFloorPlans[frame === 'a1' ? 1 : 0]
    const points = first ? floorPlanEdgePoints({ id: edge.from, name: '', point: from }, { id: edge.to, name: '', point: to }, plan) : [from, to]
    for (let index = 1; index < points.length; index++) {
      const a = points[index - 1], b = points[index]
      if (a.x !== b.x && a.y !== b.y) errors.push(`non-orthogonal:${edge.from}:${edge.to}`)
      const steps = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y)))
      for (let step = 0; step <= steps; step++) {
        const point = { x: a.x + (b.x - a.x) * step / steps, y: a.y + (b.y - a.y) * step / steps }
        const obstacles = first ? [plan.courtyard, plan.restrooms, ...plan.rooms] : siteBuildings
        if (obstacles.some(rect => inside(point, rect))) errors.push(`obstacle:${edge.from}:${edge.to}`)
        if (!first && !siteWalkways.some(rect => contains(point, rect))) errors.push(`outside-walkway:${edge.from}:${edge.to}`)
        if (first && !contains(point, plan.circulation)) errors.push(`outside-corridor:${edge.from}:${edge.to}`)
      }
    }
  }
  const catalog = locations.map(place => {
    const reference = metadata[place.id]
    const connections = graph.edges.filter(edge => !edge.blocked && (edge.from === place.nodeId || edge.to === place.nodeId))
    if (!place.nodeId) errors.push(`missing-nodeId:${place.id}`)
    else if (!ids.has(place.nodeId)) errors.push(`unknown-node:${place.id}`)
    if (!reference) errors.push(`missing-reference:${place.id}`)
    if (connections.length === 0 && reference?.navigation !== 'pending') errors.push(`isolated:${place.id}`)
    return { id: place.id, nodeId: place.nodeId, area: reference?.areaId, floor: place.floor, connections: connections.map(edge => edge.from === place.nodeId ? edge.to : edge.from), access: reference?.accessNote, pending: reference?.navigation === 'pending' }
  })
  const pairs = locations.flatMap(from => locations.map(to => {
    const result = findRoute(graph, from.nodeId, to.nodeId)
    const pending = [from, to].some(place => metadata[place.id]?.navigation === 'pending')
    const verified = result.status === 'same-location' || result.path.slice(1).every((id, index) => confirmedConnections.some(([a, b]) =>
      (a === result.path[index] && b === id) || (b === result.path[index] && a === id)))
    const status: RouteAvailability = pending || !['ok', 'same-location'].includes(result.status) ? 'unavailable'
      : verified && [from, to].every(place => metadata[place.id]?.navigation === 'confirmed') ? 'usable' : 'demonstrative'
    if (!pending && status === 'unavailable') errors.push(`disconnected:${from.id}:${to.id}`)
    return { from: from.id, to: to.id, status, result }
  }))
  return { errors: [...new Set(errors)], isolatedNodes: graph.nodes.filter(node => !graph.edges.some(edge => !edge.blocked && (edge.from === node.id || edge.to === node.id))).map(node => node.id), catalog, pairs }
}

function inside(point: Point2D, rect: PlanRect) { return point.x > rect.x && point.x < rect.x + rect.width && point.y > rect.y && point.y < rect.y + rect.height }
function contains(point: Point2D, rect: PlanRect) { return point.x >= rect.x && point.x <= rect.x + rect.width && point.y >= rect.y && point.y <= rect.y + rect.height }
