// @vitest-environment happy-dom
import { afterEach, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import App from '../App'
import { campusGraph, campusLocations, campusMetadata, campusDiagramPositions, campusTransitions } from '../data/campus'
import { blocoAFloorPlans } from '../data/blocoA.floorPlan'
import { auditNavigation } from '../modules/campus/audit'
import { campusFrame, getCampusView, routeStages } from '../modules/campus/selectors'
import { findRoute } from '../modules/navigation/findRoute'
import { projectRouteToView, buildMapView } from '../modules/visualization/adapters'
import { searchLocations } from '../modules/search/searchLocations'

afterEach(cleanup)
const mandatory = [
  ['A0-S01', 'A0-S08'], ['A0-S01', 'A0-WC'], ['A0-S01', 'A1-S09'], ['A0-S08', 'A1-S16'],
  ['A1-S09', 'A1-S13'], ['A1-S16', 'A1-WC'], ['MS-REF', 'A0-REF'], ['MS-REF', 'A0-S01'],
  ['MS-REF', 'A1-S13'], ['A0-WC', 'A1-WC'],
]
it.each(mandatory)('MVP: %s → %s e retorno usam somente conexões existentes', (from, to) => {
  for (const [a, b] of [[from, to], [to, from]]) {
    const result = findRoute(campusGraph, a, b)
    expect(result.status).toBe('ok')
    expect(result.path[0]).toBe(a)
    expect(result.path.at(-1)).toBe(b)
    for (let i = 1; i < result.path.length; i++) expect(campusGraph.edges.some(edge => !edge.blocked &&
      ((edge.from === result.path[i - 1] && edge.to === result.path[i]) || (edge.to === result.path[i - 1] && edge.from === result.path[i])))).toBe(true)
  }
})
it('audita todos os 1024 pares e distingue os 961 trajetos demonstrativos da referência fotográfica', () => {
  const report = auditNavigation(campusGraph, campusLocations, campusMetadata, campusDiagramPositions)
  expect(campusLocations).toHaveLength(32)
  expect(report.errors).toEqual([])
  expect(report.pairs).toHaveLength(1024)
  expect(report.pairs.filter(pair => pair.status === 'demonstrative')).toHaveLength(961)
  expect(report.pairs.filter(pair => pair.status === 'unavailable')).toHaveLength(63)
  expect(report.isolatedNodes).toEqual(['A1-FOTO'])
  expect(new Set(campusLocations.filter(place => place.type === 'room').map(place => place.name)).size).toBe(16)
})
it('não une coordenadas de referenciais diferentes, mas preserva as etapas completas', () => {
  const result = findRoute(campusGraph, 'MS-REF', 'A1-S13')
  expect(routeStages(result.path).map(step => step.name)).toEqual(['Campus e percurso externo', 'Térreo', 'Primeiro andar'])
  for (const [area, floor] of [['campus', 0], ['bloco-a', 0], ['bloco-a', 1]] as const) {
    const view = getCampusView(area, floor)
    const segment = projectRouteToView(campusGraph, view.graph, result)
    const map = buildMapView(view.graph, campusLocations, view.positions, segment)
    expect(map.route.length).toBeGreaterThan(1)
    expect(new Set(map.route.map(node => campusFrame(node.id))).size).toBe(1)
  }
})
it('bloquear a transição vertical elimina trajetos entre pisos, preservando os do mesmo piso', () => {
  const link = campusTransitions.find(link => link.kind === 'vertical-simulated')!
  const blocked = { ...campusGraph, edges: campusGraph.edges.map(edge => edge.from === link.from && edge.to === link.to ? { ...edge, blocked: true } : edge) }
  expect(findRoute(blocked, 'A0-S01', 'A1-S09').status).toBe('no-path')
  expect(findRoute(blocked, 'A0-S01', 'A0-S08').status).toBe('ok')
  const stale = findRoute(campusGraph, 'MS-REF', 'A1-S13')
  expect(projectRouteToView(blocked, getCampusView('bloco-a', 1).graph, stale)?.status).toBe('invalid-graph')
})
it('detecta ligação entre pisos não cadastrada e geometria ausente', () => {
  const broken = { ...campusGraph, edges: [...campusGraph.edges, { from: 'A0-C1', to: 'A1-C1', weight: 1 }] }
  const report = auditNavigation(broken, campusLocations, campusMetadata, { ...campusDiagramPositions, 'A0-S01': undefined })
  expect(report.errors).toContain('unknown-floor-link:A0-C1:A1-C1')
  expect(report.errors.some(error => error.startsWith('missing-geometry:A0-S01'))).toBe(true)
})
it('gera dois pisos com geometria compartilhada, IDs e acessos independentes', () => {
  const [ground, first] = blocoAFloorPlans
  expect(ground.rooms.map(room => room.number)).toEqual([1,2,3,4,5,6,7,8])
  expect(first.rooms.map(room => room.number)).toEqual([9,10,11,12,13,14,15,16])
  for (let i = 0; i < 8; i++) {
    expect(ground.rooms[i].door).toEqual(first.rooms[i].door)
    expect(ground.rooms[i].nodeId).not.toBe(first.rooms[i].nodeId)
    expect(ground.rooms[i].locationId).not.toBe(first.rooms[i].locationId)
  }
})
it('busca sala sem zero à esquerda e banheiro no catálogo real', () => {
  expect(searchLocations(campusLocations, 'sala 1').some(place => place.id === 'a0-sala-01')).toBe(true)
  expect(searchLocations(campusLocations, 'sala9').some(place => place.id === 'a1-sala-09')).toBe(true)
  expect(searchLocations(campusLocations, 'banheiro').filter(place => place.type === 'restroom')).toHaveLength(2)
})
it('mantém a rota entre áreas ao alternar as etapas e ao inverter origem e destino', () => {
  const { container } = render(<App />)
  expect(screen.queryByLabelText('Dados da navegação')).toBeNull()
  fireEvent.change(screen.getByLabelText('Origem'), { target: { value: 'ms-referencia' } })
  fireEvent.change(screen.getByLabelText('Destino'), { target: { value: 'a1-sala-13' } })
  fireEvent.click(screen.getByRole('button', { name: 'Calcular rota' }))
  expect(screen.getByText(/Conexão vertical simulada e provisória/)).toBeTruthy()
  const fullPath = within(screen.getByRole('list', { name: 'Pontos da rota em ordem' })).getAllByRole('listitem').map(item => item.textContent)
  for (const name of ['2. Térreo', '3. Primeiro andar', '1. Campus e percurso externo']) {
    fireEvent.click(screen.getByRole('button', { name }))
    expect(container.querySelector('[data-route]')).toBeTruthy()
    expect(within(screen.getByRole('list', { name: 'Pontos da rota em ordem' })).getAllByRole('listitem').map(item => item.textContent)).toEqual(fullPath)
  }
  fireEvent.click(screen.getByRole('button', { name: 'Inverter origem e destino' }))
  expect(container.querySelector('[data-route]')).toBeNull()
  fireEvent.click(screen.getByRole('button', { name: 'Calcular rota' }))
  expect(screen.getByLabelText('Origem')).toHaveProperty('value', 'a1-sala-13')
  expect(container.querySelector('[data-floor-plan="bloco-a-primeiro-andar"]')).toBeTruthy()
})

it('identifica o acesso aos sanitários do térreo e aceita a seleção pelo teclado', () => {
  const { container } = render(<App />)
  fireEvent.change(screen.getByLabelText('Origem'), { target: { value: 'a0-sala-01' } })
  fireEvent.keyDown(screen.getByRole('button', { name: 'Sanitários térreo · acesso demonstrativo' }), { key: 'Enter' })
  expect(screen.getByLabelText('Destino')).toHaveProperty('value', 'a0-sanitarios')
  fireEvent.click(screen.getByRole('button', { name: 'Calcular rota' }))
  expect(container.querySelector('[data-route]')?.getAttribute('data-route')).toContain('A0-WC-ACESSO A0-WC')
  expect(screen.queryByRole('button', { name: 'Sanitários A1 · acesso demonstrativo' })).toBeNull()
})
