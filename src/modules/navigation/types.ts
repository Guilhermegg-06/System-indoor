export interface Point3D { x: number; y: number; z: number }
export interface GraphNode { id: string; position?: Point3D }
export interface Edge { from: string; to: string; weight: number; blocked?: boolean }
export interface Graph { nodes: readonly GraphNode[]; edges: readonly Edge[] }
export type RouteResult =
  | { status: 'ok'; path: string[]; cost: number }
  | { status: 'same-location'; path: []; cost: 0 }
  | { status: 'no-path' | 'invalid-location' | 'invalid-graph'; path: [] };

