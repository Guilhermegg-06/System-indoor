import { describe, expect, it } from 'vitest'
import { G1, G3 } from '../data/graphs/fixtures'
import { mockLocations } from '../data/locations.mock'
import { findRoute } from '../modules/navigation/findRoute'
import { buildMapView, toSpatialRoute } from '../modules/visualization/adapters'
import { schematicPositions } from '../config/visualization'

describe('adaptação do grafo sem alterar o motor', () => {
  it('resolve nomes, nós e conexões com coordenadas independentes', () => {
    const view = buildMapView(G1, mockLocations, schematicPositions, null)
    expect(view.nodes).toHaveLength(G1.nodes.length)
    expect(view.edges).toHaveLength(G1.edges.length)
    expect(view.nodes.find(node => node.id === 'E0')?.name).toBe('Entrada')
    expect(view.nodes.every(node => Number.isFinite(node.point.x) && Number.isFinite(node.point.y))).toBe(true)
  })
  it('transforma a rota real do motor em pontos na mesma ordem', () => {
    const result = findRoute(G1, 'E0', 'S101')
    expect(buildMapView(G1, mockLocations, schematicPositions, result).route.map(node => node.id)).toEqual(['E0', 'C1', 'C2', 'S101'])
  })
  it.each([null, findRoute(G3, 'E0', 'S101'), findRoute(G1, 'E0', 'E0'), findRoute(G1, 'X', 'E0')])('não desenha resultado sem percurso: %j', result => {
    expect(buildMapView(G1, mockLocations, schematicPositions, result).route).toEqual([])
  })
  it('não liga pontos desconectados, bloqueados ou ausentes', () => {
    for (const path of [['E0', 'S101'], ['E0', 'X'], ['E0', 'C1', 'C2', 'S101']]) {
      expect(buildMapView(G3, mockLocations, schematicPositions, { status: 'ok', path, cost: 0 }).route).toEqual([])
    }
  })
  it('não inventa coordenadas ausentes nem aceita valores não finitos', () => {
    const positions = { ...schematicPositions, C1: { x: NaN, y: 20 } }
    const view = buildMapView(G1, mockLocations, positions, findRoute(G1, 'E0', 'S101'))
    expect(view.missingNodeIds).toEqual(['C1'])
    expect(view.route).toEqual([])
    expect(view.edges.some(edge => edge.from.id === 'C1' || edge.to.id === 'C1')).toBe(false)
  })
  it('mantém grafo, catálogo e configuração imutáveis', () => {
    const before = JSON.stringify({ G1, mockLocations, schematicPositions })
    buildMapView(G1, mockLocations, schematicPositions, findRoute(G1, 'E0', 'S101'))
    expect(JSON.stringify({ G1, mockLocations, schematicPositions })).toBe(before)
  })
  it('prepara rota 3D somente quando todas as posições espaciais são válidas', () => {
    const route = findRoute(G1, 'E0', 'C1')
    expect(toSpatialRoute(G1, route, {})).toEqual([])
    const positions = { E0: { x: 0, y: 0, z: 0 }, C1: { x: 1, y: 0, z: 2 } }
    expect(toSpatialRoute(G1, route, positions)).toEqual([positions.E0, positions.C1])
    expect(toSpatialRoute(G1, route, { ...positions, C1: { x: 1, y: Infinity, z: 0 } })).toEqual([])
    expect(toSpatialRoute(G1, null, positions)).toEqual([])
  })
})
