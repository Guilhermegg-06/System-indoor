import type { Location } from '../locations/location.types'
import type { Graph, Point3D, RouteResult } from '../navigation/types'
import type { MapView, Positions2D, Positions3D } from './types'

function routeIds(graph: Graph, route?: RouteResult | null): readonly string[] {
  if (route?.status !== 'ok' || route.path.length < 2) return []
  const ids = new Set(graph.nodes.map(node => node.id))
  if (route.path.some(id => !ids.has(id))) return []
  const connected = route.path.slice(1).every((to, index) => graph.edges.some(edge =>
    !edge.blocked && Number.isFinite(edge.weight) && edge.weight >= 0 &&
    ((edge.from === route.path[index] && edge.to === to) || (edge.to === route.path[index] && edge.from === to))))
  return connected ? route.path : []
}

export function buildMapView(graph: Graph, locations: readonly Location[], positions: Positions2D, route?: RouteResult | null): MapView {
  const names = new Map(locations.map(location => [location.nodeId, location.name]))
  const nodes: MapView['nodes'] = []
  const missingNodeIds: string[] = []
  for (const node of graph.nodes) {
    const point = positions[node.id]
    if (point && Number.isFinite(point.x) && Number.isFinite(point.y)) {
      nodes.push({ id: node.id, name: names.get(node.id) ?? node.id, point })
    } else missingNodeIds.push(node.id)
  }
  const byId = new Map(nodes.map(node => [node.id, node]))
  const edges: MapView['edges'] = []
  for (const edge of graph.edges) {
    const from = byId.get(edge.from)
    const to = byId.get(edge.to)
    if (from && to) edges.push({ from, to, blocked: Boolean(edge.blocked) })
  }
  const path = routeIds(graph, route)
  return { nodes, edges, missingNodeIds, route: path.every(id => byId.has(id)) ? path.map(id => byId.get(id)!) : [] }
}

export function toSpatialRoute(graph: Graph, route: RouteResult | null | undefined, positions: Positions3D): Point3D[] {
  const path = routeIds(graph, route)
  const points: Point3D[] = []
  for (const id of path) {
    const point = positions[id]
    if (!point || ![point.x, point.y, point.z].every(Number.isFinite)) return []
    points.push({ ...point })
  }
  return points
}

/** Validate the complete route, then select a contiguous segment in this drawing frame. */
export function projectRouteToView(graph: Graph, viewGraph: Graph, route: RouteResult | null): RouteResult | null {
  if (route?.status !== 'ok') return route
  const path = routeIds(graph, route)
  if (!path.length) return { status: 'invalid-graph', path: [] }
  const ids = new Set(viewGraph.nodes.map(node => node.id))
  const start = path.findIndex(id => ids.has(id))
  if (start < 0) return route // Renderer explains the missing stage; it never draws this path.
  const end = path.findIndex((id, index) => index > start && !ids.has(id))
  return { status: 'ok', path: [...path.slice(start, end < 0 ? undefined : end)], cost: route.cost }
}
