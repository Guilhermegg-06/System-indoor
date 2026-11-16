import type { Graph, RouteResult } from './types'
export function findRoute(graph: Graph, origin: string, destination: string): RouteResult {
  const ids = new Set(graph.nodes.map(n => n.id))
  if (ids.size !== graph.nodes.length || graph.nodes.some(n => !n.id) || graph.edges.some(e =>
    !ids.has(e.from) || !ids.has(e.to) || !Number.isFinite(e.weight) || e.weight < 0)) {
    return { status: 'invalid-graph', path: [] }
  }
  if (!ids.has(origin) || !ids.has(destination)) return { status: 'invalid-location', path: [] }
  if (origin === destination) return { status: 'same-location', path: [], cost: 0 }
  const adjacent = new Map<string, { id: string; cost: number }[]>([...ids].map(id => [id, []]))
  for (const edge of graph.edges) {
    if (edge.blocked) continue
    adjacent.get(edge.from)!.push({ id: edge.to, cost: edge.weight })
    adjacent.get(edge.to)!.push({ id: edge.from, cost: edge.weight })
  }
  // A* com h=0 (Dijkstra): seguro mesmo sem coordenadas ou escala física validada.
  const open = new Set([origin])
  const costs = new Map([[origin, 0]])
  const previous = new Map<string, string>()
  while (open.size) {
    const current = [...open].reduce((best, id) => costs.get(id)! < costs.get(best)! ? id : best)
    if (current === destination) {
      const path = [current]
      while (previous.has(path[0])) path.unshift(previous.get(path[0])!)
      return { status: 'ok', path, cost: costs.get(current)! }
    }
    open.delete(current)
    for (const next of adjacent.get(current)!) {
      const cost = costs.get(current)! + next.cost
      if (cost < (costs.get(next.id) ?? Infinity)) {
        costs.set(next.id, cost)
        previous.set(next.id, current)
        open.add(next.id)
      }
    }
  }
  return { status: 'no-path', path: [] }
}

