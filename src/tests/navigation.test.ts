import { describe, expect, it } from 'vitest'
import { findRoute } from '../modules/navigation/findRoute'
import { G1, G2, G3 } from '../data/graphs/fixtures'

describe('Navigation Engine — dados exclusivamente fictícios', () => {
  it('CTF022: rota normal', () => {
    expect(findRoute(G1, 'E0', 'S101')).toEqual({ status: 'ok', path: ['E0','C1','C2','S101'], cost: 3 })
  })
  it('CTF023: retorno bidirecional', () => {
    expect(findRoute(G1, 'S101', 'E0')).toEqual({ status: 'ok', path: ['S101','C2','C1','E0'], cost: 3 })
  })
  it('CTF024: rota para L01', () => {
    expect(findRoute(G1, 'E0', 'L01')).toEqual({ status: 'ok', path: ['E0','C1','L01'], cost: 2 })
  })
  it('CTF026: desvio G2', () => {
    expect(findRoute(G2, 'E0', 'S101')).toEqual({ status: 'ok', path: ['E0','C1','C3','C2','S101'], cost: 4 })
  })
  it('CTF028: G3 sem caminho', () => {
    expect(findRoute(G3, 'E0', 'S101')).toEqual({ status: 'no-path', path: [] })
  })
  it('CTF027: nó isolado sem inventar ligações', () => {
    expect(findRoute(G1, 'E0', 'I01')).toEqual({ status: 'no-path', path: [] })
  })
  it('NAV-05: cada passo pertence a uma aresta liberada', () => {
    for (const graph of [G1, G2]) {
      const result = findRoute(graph, 'E0', 'S101')
      expect(result.status).toBe('ok')
      result.path.slice(1).forEach((to, i) => {
        const from = result.path[i]
        expect(graph.edges.some(e => !e.blocked && ((e.from === from && e.to === to) || (e.from === to && e.to === from)))).toBe(true)
      })
    }
  })
  it('CTF019: mesma origem sem deslocamento', () => {
    expect(findRoute(G1, 'E0', 'E0')).toEqual({ status: 'same-location', path: [], cost: 0 })
  })
  it.each([['ausente','S101'], ['E0','ausente'], ['ausente','ausente'], ['', 'S101']])('NAV-07: local inválido %s → %s', (from, to) => {
    expect(findRoute(G1, from, to)).toEqual({ status: 'invalid-location', path: [] })
  })
  it('NAV-08: menor custo, não menor quantidade de trechos', () => {
    const graph = { ...G2, edges: G2.edges.map(e => ({ ...e, blocked: false, weight: e.from === 'C1' && e.to === 'C2' ? 10 : 1 })) }
    expect(findRoute(graph, 'E0', 'S101')).toEqual({ status: 'ok', path: ['E0','C1','C3','C2','S101'], cost: 4 })
  })
  it.each([-1, NaN, Infinity])('NAV-09: rejeita peso inválido %s', weight => {
    expect(findRoute({ ...G1, edges: [{ from: 'E0', to: 'S101', weight }] }, 'E0','S101').status).toBe('invalid-graph')
  })
  it('NAV-10: rejeita conexão para nó não cadastrado', () => {
    expect(findRoute({ ...G1, edges: [{ from: 'E0', to: 'fantasma', weight: 1 }] }, 'E0','S101').status).toBe('invalid-graph')
  })
  it('NAV-11: aceita peso zero e coordenadas sem alterar a entrada', () => {
    const graph = { nodes: [{ id: 'A', position: { x: 0, y: 0, z: 0 } }, { id: 'B', position: { x: 100, y: 0, z: 0 } }], edges: [{ from: 'A', to: 'B', weight: 0 }] }
    const before = structuredClone(graph)
    expect(findRoute(graph,'A','B')).toEqual({ status: 'ok', path: ['A','B'], cost: 0 })
    expect(graph).toEqual(before)
  })
})

