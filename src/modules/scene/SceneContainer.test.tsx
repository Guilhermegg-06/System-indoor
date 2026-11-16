// @vitest-environment happy-dom

import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import type { Graph, RouteResult } from '../navigation/types'
import SceneContainer from './SceneContainer'

afterEach(cleanup)

describe('SceneContainer', () => {
  it('identifies the visualization and explains missing data accessibly', () => {
    render(<SceneContainer graph={null} />)
    expect(screen.getByRole('region', { name: 'Visualização 3D' })).toBeDefined()
    expect(screen.getByRole('status').textContent).toContain('Nenhum grafo fictício')
  })

  it('keeps the unavailable state when graph data arrives', () => {
    const { rerender } = render(<SceneContainer graph={null} />)
    rerender(<SceneContainer graph={{ nodes: [], edges: [] }} />)
    expect(screen.getByRole('status').textContent).toContain('O visualizador ainda não foi integrado')
    expect(screen.queryByText(/Nenhum grafo fictício/)).toBeNull()
  })

  it('accepts immutable graph and route data without changing them', () => {
    const graph: Graph = Object.freeze({
      nodes: Object.freeze([Object.freeze({ id: 'A' })]),
      edges: Object.freeze([]),
    })
    const route: RouteResult = { status: 'ok', path: ['A'], cost: 0 }
    Object.freeze(route.path)
    Object.freeze(route)
    const before = JSON.stringify({ graph, route })
    render(<SceneContainer graph={graph} route={route} />)
    expect(screen.getByRole('status').textContent).toContain('indisponível')
    expect(JSON.stringify({ graph, route })).toBe(before)
  })
})
