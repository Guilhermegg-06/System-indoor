import type { FloorPlan, MapNode, Point2D } from './types'

/** Só desenha segmentos já validados por buildMapView; não calcula caminhos. */
export function floorPlanEdgePoints(from: MapNode, to: MapNode, plan: FloorPlan): readonly Point2D[] {
  const entrance = plan.rooms.find(room => room.nodeId === from.id && room.corridorNodeId === to.id)
  if (entrance) return [from.point, ...entrance.approach, to.point]
  const exit = plan.rooms.find(room => room.nodeId === to.id && room.corridorNodeId === from.id)
  if (exit) return [from.point, ...[...exit.approach].reverse(), to.point]
  return [from.point, to.point]
}

export function floorPlanRoutePoints(nodes: readonly MapNode[], plan: FloorPlan): readonly Point2D[] {
  return nodes.slice(1).flatMap((node, index) => {
    const segment = floorPlanEdgePoints(nodes[index], node, plan)
    return index === 0 ? segment : segment.slice(1)
  })
}
