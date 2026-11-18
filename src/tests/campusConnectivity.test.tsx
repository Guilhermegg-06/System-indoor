// @vitest-environment happy-dom
import { afterEach, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import App from '../App'
import { campusGraph, campusLocations, campusMetadata, campusDiagramPositions } from '../data/campus'
import { auditNavigation } from '../modules/campus/audit'
import { findRoute } from '../modules/navigation/findRoute'

afterEach(cleanup)
const audit = () => auditNavigation(campusGraph, campusLocations, campusMetadata, campusDiagramPositions)

it('audita cada acesso, os 289 pares e a geometria de todas as passagens', () => {
  const report = audit()
  expect(report.errors).toEqual([])
  expect(report.pairs).toHaveLength(campusLocations.length ** 2)
  expect(report.catalog.filter(place => !place.pending).every(place => place.connections.length > 0)).toBe(true)
  expect(report.isolatedNodes).toEqual(['A1-FOTO'])
  for (const pair of report.pairs) {
    const from = campusLocations.find(place => place.id === pair.from)!
    const to = campusLocations.find(place => place.id === pair.to)!
    const pending = campusMetadata[from.id].navigation === 'pending' || campusMetadata[to.id].navigation === 'pending'
    expect(pair.status).toBe(from.floor === to.floor && !pending ? 'demonstrative' : 'unavailable')
  }
})

it.each([
  ['A1-S09', 'A1-S13'], ['A1-S16', 'A1-WC'], ['A1-S09', 'A1-WC'], ['A1-S13', 'A1-S16'],
  ['MS-REF', 'A0-REF'], ['MS-REF', 'EXT-REF'],
])('calcula %s → %s com conexões existentes', (from, to) => {
  const result = findRoute(campusGraph, from, to)
  expect(result.status).toBe('ok')
  for (let index = 1; index < result.path.length; index++) {
    expect(campusGraph.edges.some(edge => !edge.blocked && ((edge.from === result.path[index - 1] && edge.to === result.path[index]) || (edge.to === result.path[index - 1] && edge.from === result.path[index])))).toBe(true)
  }
})

it('distingue mesma origem, nó inexistente, referência isolada e ligação vertical ausente', () => {
  expect(findRoute(campusGraph, 'A1-S09', 'A1-S09').status).toBe('same-location')
  expect(findRoute(campusGraph, 'XXX', 'A1-S09').status).toBe('invalid-location')
  expect(findRoute(campusGraph, 'A1-S09', 'A1-FOTO').status).toBe('no-path')
  expect(findRoute(campusGraph, 'MS-REF', 'A1-S09').status).toBe('no-path')
})

it('detecta cadastros esquecidos, nós inválidos, pesos e travessia de obstáculos', () => {
  const broken = { nodes: [...campusGraph.nodes, { id: 'ISOLADO' }], edges: [...campusGraph.edges, { from: 'XXX', to: 'A1-S09', weight: -1 }, { from: 'A1-C1', to: 'A1-C3', weight: 1 }] }
  const report = auditNavigation(broken, [...campusLocations, { ...campusLocations[0], id: 'sem-node', nodeId: '' }], campusMetadata, campusDiagramPositions)
  expect(report.errors.some(error => error.startsWith('missing-nodeId'))).toBe(true)
  expect(report.errors.some(error => error.startsWith('unknown-edge'))).toBe(true)
  expect(report.errors.some(error => error.startsWith('invalid-weight'))).toBe(true)
  expect(report.errors.some(error => error.startsWith('obstacle'))).toBe(true)
  expect(report.isolatedNodes).toContain('ISOLADO')
  const disconnected = { ...campusGraph, edges: campusGraph.edges.filter(edge => edge.from !== 'A1-S16' && edge.to !== 'A1-S16') }
  expect(auditNavigation(disconnected, campusLocations, campusMetadata, campusDiagramPositions).errors).toContain('isolated:a1-sala-16')
})

it('mantém a referência fotográfica consultável fora da seleção de destinos', () => {
  render(<App />)
  expect(within(screen.getByLabelText('Destino')).queryByRole('option', { name: /Corredores · fotos/ })).toBeNull()
  expect(screen.getByText(/referência geral pendente de localização/)).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Ver fotos do primeiro andar' }))
  expect(within(screen.getByRole('region', { name: 'Referências do local' })).getAllByRole('img')).toHaveLength(2)
})

it('oferece plantas úteis nas quatro vistas externas e etapa compatível com o percurso', () => {
  const { container } = render(<App />)
  expect(container.querySelector('[data-site-plan="campus"]')).toBeTruthy()
  expect(container.querySelectorAll('[data-building]')).toHaveLength(2)
  expect(container.querySelectorAll('[data-walkway]').length).toBeGreaterThan(3)
  fireEvent.change(screen.getByLabelText('Origem'), { target: { value: 'ms-referencia' } })
  fireEvent.change(screen.getByLabelText('Destino'), { target: { value: 'a0-referencia' } })
  fireEvent.click(screen.getByRole('button', { name: 'Calcular rota' }))
  for (const [label, area] of [['Etapa: Minishopping', 'minishopping'], ['Etapa: percurso externo', 'percurso-externo'], ['Etapa: Bloco A térreo', 'bloco-a'], ['Ver rota completa', 'campus']]) {
    fireEvent.click(screen.getByRole('button', { name: label }))
    expect(container.querySelector(`[data-site-plan="${area}"]`)).toBeTruthy()
    expect(container.querySelector('[data-route]')?.getAttribute('data-route')).toBe('MS-REF MS-SAIDA EXT-REF EXT-CURVA A0-REF')
    expect(screen.getByRole('list', { name: 'Pontos da rota em ordem' })).toBeTruthy()
  }
  fireEvent.click(screen.getByRole('button', { name: 'Ampliar mapa' }))
  expect(screen.getByLabelText('Zoom do mapa').textContent).toBe('125%')
  fireEvent.click(screen.getByRole('button', { name: 'Ajustar mapa' }))
  expect(screen.getByLabelText('Zoom do mapa').textContent).toBe('100%')
  fireEvent.click(screen.getByRole('button', { name: 'Abrir primeiro andar' }))
  expect(container.querySelector('[data-route]')).toBeNull()
  expect(screen.getByText('A rota está em outra área ou andar. Selecione a vista correspondente.')).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Ver rota completa' }))
  expect(container.querySelector('[data-route]')).toBeTruthy()
})

it('seleciona sanitários pelo acesso e mantém a linha fora das paredes', () => {
  const { container } = render(<App initialView="first" />)
  fireEvent.change(screen.getByLabelText('Origem'), { target: { value: 'a1-sala-16' } })
  fireEvent.click(screen.getByRole('button', { name: 'Sanitários A1 · acesso demonstrativo' }))
  fireEvent.click(screen.getByRole('button', { name: 'Calcular rota' }))
  const path = container.querySelector('[data-route]')?.getAttribute('data-route')
  expect(path).toContain('A1-WC-ACESSO A1-WC')
  expect(container.querySelector('[data-route]')?.getAttribute('points')?.endsWith('275,500 325,500')).toBe(true)
  expect(screen.getByText(/Rota demonstrativa, não homologada/)).toBeTruthy()
})
