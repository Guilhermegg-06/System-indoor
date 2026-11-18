// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import App from '../App'
import { blocoAFloorPlan, blocoAPlanPositions } from '../data/blocoA.floorPlan'
import { campusGraph, campusLocations } from '../data/campus'
import { findRoute } from '../modules/navigation/findRoute'
import { buildMapView } from '../modules/visualization/adapters'
import { FloorPlanMap } from '../modules/visualization/FloorPlanMap'
import { floorPlanRoutePoints } from '../modules/visualization/floorPlanGeometry'
import type { PlanRect, Point2D } from '../modules/visualization/types'

afterEach(cleanup)

function chooseOnPlan(origin = '09', destination = '16') {
  fireEvent.click(screen.getByRole('button', { name: 'Definir origem' }))
  fireEvent.click(screen.getByRole('button', { name: `Sala ${origin}` }))
  fireEvent.click(screen.getByRole('button', { name: `Sala ${destination}` }))
}

describe('planta 2D integrada ao fluxo existente', () => {
  it('abre na planta do primeiro andar com oito salas, sem exigir 3D', () => {
    const { container } = render(<App initialView="first" />)
    expect(container.querySelector('[data-floor-plan]')).toBeTruthy()
    expect(container.querySelectorAll('[data-room-number]')).toHaveLength(8)
    expect(screen.getByLabelText('Área do mapa')).toHaveProperty('value', 'bloco-a')
    expect(screen.getByLabelText('Andar do mapa')).toHaveProperty('value', '1')
    expect(screen.getByRole('button', { name: 'Visualização 3D' })).toHaveProperty('disabled', true)
  })

  it('usa o clique para preencher os mesmos campos e calcula pelo motor existente', () => {
    const { container } = render(<App initialView="first" />)
    chooseOnPlan()
    expect(screen.getByLabelText('Origem')).toHaveProperty('value', 'a1-sala-09')
    expect(screen.getByLabelText('Destino')).toHaveProperty('value', 'a1-sala-16')
    expect(container.querySelector('[data-route]')).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Calcular rota' }))
    const expected = findRoute(campusGraph, 'A1-S09', 'A1-S16')
    expect(container.querySelector('[data-route]')?.getAttribute('data-route')).toBe(expected.path.join(' '))
    expect(within(screen.getByRole('list', { name: 'Pontos da rota em ordem' })).getAllByRole('listitem').map(item => item.textContent)).toEqual(expected.path.map(id => campusLocations.find(place => place.nodeId === id)?.name ?? id))
    expect(container.querySelector('[data-route]')?.getAttribute('points')).toBe('900,800 900,745 1005,745 1005,650 1060,650')
  })

  it('aceita Enter e Espaço para selecionar salas e avança de origem para destino', () => {
    render(<App initialView="first" />)
    fireEvent.click(screen.getByRole('button', { name: 'Definir origem' }))
    fireEvent.keyDown(screen.getByRole('button', { name: 'Sala 09' }), { key: 'Enter' })
    expect(screen.getByRole('button', { name: 'Definir destino' }).getAttribute('aria-pressed')).toBe('true')
    fireEvent.keyDown(screen.getByRole('button', { name: 'Sala 13' }), { key: ' ' })
    expect(screen.getByLabelText('Origem')).toHaveProperty('value', 'a1-sala-09')
    expect(screen.getByLabelText('Destino')).toHaveProperty('value', 'a1-sala-13')
  })

  it('pesquisa uma sala, sincroniza seu destaque e limpa a rota ao escolher outro destino', () => {
    const { container } = render(<App initialView="first" />)
    chooseOnPlan()
    fireEvent.click(screen.getByRole('button', { name: 'Calcular rota' }))
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'sala 14' } })
    fireEvent.click(within(screen.getByRole('list', { name: 'Locais encontrados' })).getByRole('button', { name: /Sala 14/ }))
    expect(screen.getByLabelText('Destino')).toHaveProperty('value', 'a1-sala-14')
    expect(screen.getByRole('button', { name: 'Sala 14 · destino' }).getAttribute('aria-pressed')).toBe('true')
    expect(container.querySelector('[data-route]')).toBeNull()
    expect(screen.getByText('Nenhuma rota calculada.')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Calcular rota' }))
    expect(container.querySelector('[data-route]')?.getAttribute('data-route')).toBe('A1-S09 A1-C1 A1-TRANSFER A1-C4 A1-S14')
  })

  it('inverte os campos e os marcadores e só redesenha após calcular', () => {
    const { container } = render(<App initialView="first" />)
    chooseOnPlan()
    fireEvent.click(screen.getByRole('button', { name: 'Calcular rota' }))
    fireEvent.click(screen.getByRole('button', { name: 'Inverter origem e destino' }))
    expect(screen.getByRole('button', { name: 'Sala 16 · origem' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Sala 09 · destino' })).toBeTruthy()
    expect(container.querySelector('[data-route]')).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Calcular rota' }))
    expect(container.querySelector('[data-route]')?.getAttribute('data-route')).toBe('A1-S16 A1-C1 A1-S09')
  })

  it('limpa a rota ao trocar a sala pelo clique', () => {
    const { container } = render(<App initialView="first" />)
    chooseOnPlan()
    fireEvent.click(screen.getByRole('button', { name: 'Calcular rota' }))
    fireEvent.click(screen.getByRole('button', { name: 'Sala 15' }))
    expect(screen.getByLabelText('Destino')).toHaveProperty('value', 'a1-sala-15')
    expect(container.querySelector('[data-route]')).toBeNull()
  })

  it('amplia, reduz e ajusta a planta sem perder os locais ou a rota', () => {
    const { container } = render(<App initialView="first" />)
    chooseOnPlan()
    fireEvent.click(screen.getByRole('button', { name: 'Calcular rota' }))
    const route = container.querySelector('[data-route]')?.getAttribute('points')
    fireEvent.click(screen.getByRole('button', { name: 'Ampliar mapa' }))
    expect(screen.getByLabelText('Zoom do mapa').textContent).toBe('125%')
    fireEvent.click(screen.getByRole('button', { name: 'Reduzir mapa' }))
    expect(screen.getByLabelText('Zoom do mapa').textContent).toBe('100%')
    fireEvent.click(screen.getByRole('button', { name: 'Ampliar mapa' }))
    const viewport = screen.getByRole('region', { name: 'Planta interativa; amplie e role para explorar' })
    viewport.scrollLeft = 100
    viewport.scrollTop = 50
    fireEvent.click(screen.getByRole('button', { name: 'Ajustar mapa' }))
    expect(viewport.scrollLeft).toBe(0)
    expect(viewport.scrollTop).toBe(0)
    expect(screen.getByLabelText('Zoom do mapa').textContent).toBe('100%')
    expect(container.querySelector('[data-route]')?.getAttribute('points')).toBe(route)
    expect(screen.getByLabelText('Origem')).toHaveProperty('value', 'a1-sala-09')
  })

  it('trata origem igual ao destino sem desenhar um percurso artificial', () => {
    const { container } = render(<App initialView="first" />)
    fireEvent.change(screen.getByLabelText('Origem'), { target: { value: 'a1-sala-09' } })
    fireEvent.change(screen.getByLabelText('Destino'), { target: { value: 'a1-sala-09' } })
    fireEvent.click(screen.getByRole('button', { name: 'Calcular rota' }))
    expect(screen.getByText('A origem e o destino são o mesmo local. Não é necessário se deslocar.')).toBeTruthy()
    expect(container.querySelector('[data-route]')).toBeNull()
  })

  it('oferece sanitários e transição simulada entre pavimentos', () => {
    const { container } = render(<App initialView="first" />)
    fireEvent.change(screen.getByLabelText('Origem'), { target: { value: 'a1-sala-09' } })
    fireEvent.change(screen.getByLabelText('Destino'), { target: { value: 'a1-sanitarios' } })
    fireEvent.click(screen.getByRole('button', { name: 'Calcular rota' }))
    expect(container.querySelector('[data-route]')).toBeTruthy()
    fireEvent.change(screen.getByLabelText('Origem'), { target: { value: 'a0-referencia' } })
    fireEvent.change(screen.getByLabelText('Destino'), { target: { value: 'a1-sala-09' } })
    fireEvent.click(screen.getByRole('button', { name: 'Calcular rota' }))
    expect(screen.getByText(/Conexão vertical simulada e provisória/)).toBeTruthy()
    expect(container.querySelector('[data-route]')).toBeNull()
  })

  it('não desenha a planta nem o percurso do primeiro andar no térreo', () => {
    const { container } = render(<App initialView="first" />)
    chooseOnPlan()
    fireEvent.click(screen.getByRole('button', { name: 'Calcular rota' }))
    fireEvent.change(screen.getByLabelText('Andar do mapa'), { target: { value: '0' } })
    expect(container.querySelector('[data-floor-plan="bloco-a-terreo"]')).toBeTruthy()
    expect(container.querySelector('[data-route]')).toBeNull()
    expect(screen.getByRole('list', { name: 'Pontos da rota em ordem' })).toBeTruthy()
    fireEvent.change(screen.getByLabelText('Andar do mapa'), { target: { value: '1' } })
    expect(container.querySelector('[data-floor-plan]')).toBeTruthy()
    expect(container.querySelector('[data-route]')).toBeTruthy()
  })
})

describe('desenho dos percursos sem atravessar ambientes', () => {
  const props = { plan: blocoAFloorPlan, graph: campusGraph, locations: campusLocations, positions: blocoAPlanPositions }
  const inside = (point: Point2D, rect: PlanRect) => point.x > rect.x && point.x < rect.x + rect.width && point.y > rect.y && point.y < rect.y + rect.height

  it('mantém todos os pares de salas nos corredores, com início/fim nas portas', () => {
    for (const from of blocoAFloorPlan.rooms) for (const to of blocoAFloorPlan.rooms) {
      if (from === to) continue
      const route = findRoute(campusGraph, from.nodeId, to.nodeId)
      expect(route.status).toBe('ok')
      const view = buildMapView(campusGraph, campusLocations, blocoAPlanPositions, route)
      const points = floorPlanRoutePoints(view.route, blocoAFloorPlan)
      expect(points[0]).toEqual(from.door)
      expect(points.at(-1)).toEqual(to.door)
      for (let index = 1; index < points.length; index++) {
        const a = points[index - 1], b = points[index]
        expect(a.x === b.x || a.y === b.y).toBe(true)
        for (let step = 0; step <= 10; step++) {
          const point = { x: a.x + (b.x - a.x) * step / 10, y: a.y + (b.y - a.y) * step / 10 }
          expect(inside(point, blocoAFloorPlan.courtyard)).toBe(false)
          expect(inside(point, blocoAFloorPlan.restrooms)).toBe(false)
          expect(blocoAFloorPlan.rooms.some(room => inside(point, room))).toBe(false)
        }
      }
    }
  })

  it('respeita bloqueios do mesmo grafo e não desenha uma rota antiga por passagem bloqueada', () => {
    const graph = { ...campusGraph, edges: campusGraph.edges.map(edge => edge.from === 'A1-S16' ? { ...edge, blocked: true } : edge) }
    expect(findRoute(graph, 'A1-S09', 'A1-S16').status).toBe('no-path')
    const staleRoute = findRoute(campusGraph, 'A1-S09', 'A1-S16')
    const { container } = render(<FloorPlanMap {...props} graph={graph} route={staleRoute} />)
    expect(container.querySelector('[data-route]')).toBeNull()
    expect(container.querySelector('[data-blocked-edge]')).toBeTruthy()
  })

  it('não desenha rotas parciais quando faltam coordenadas', () => {
    const positions = { ...blocoAPlanPositions, 'A1-S16': undefined }
    const { container } = render(<FloorPlanMap {...props} positions={positions} route={findRoute(campusGraph, 'A1-S09', 'A1-S16')} />)
    expect(container.querySelector('[data-route]')).toBeNull()
    expect(screen.getByRole('alert').textContent).toContain('A1-S16')
  })
})
