// @vitest-environment happy-dom
import { afterEach, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { SchematicMap } from '../modules/visualization/SchematicMap'
import { G1, G3 } from '../data/graphs/fixtures'
import { mockLocations } from '../data/locations.mock'
import { schematicPositions } from '../config/visualization'
import { findRoute } from '../modules/navigation/findRoute'

afterEach(cleanup)
const props = { graph: G1, locations: mockLocations, positions: schematicPositions, originNodeId: 'E0', destinationNodeId: 'S101' }

it('desenha nós/conexões, nomes e marcadores de origem/destino acessíveis', () => {
  const { container } = render(<SchematicMap {...props} />)
  expect(screen.getByRole('img', { name: /Mapa esquemático/ })).toBeTruthy()
  expect(container.querySelectorAll('[data-node-id]')).toHaveLength(8)
  expect(container.querySelectorAll('[data-edge]')).toHaveLength(5)
  expect(container.querySelector('[data-node-id="E0"]')?.textContent).toContain('Origem')
  expect(container.querySelector('[data-node-id="S101"]')?.textContent).toContain('Destino')
  expect(screen.getByText('Entrada')).toBeTruthy()
  expect(screen.getByText('E0')).toBeTruthy()
  expect(screen.getByText('S101')).toBeTruthy()
})

it('desenha, substitui e limpa a rota recebida', () => {
  const { container, rerender } = render(<SchematicMap {...props} route={findRoute(G1, 'E0', 'S101')} />)
  expect(container.querySelector('[data-route]')?.getAttribute('data-route')).toBe('E0 C1 C2 S101')
  rerender(<SchematicMap {...props} destinationNodeId="S102" route={findRoute(G1, 'E0', 'S102')} />)
  expect(container.querySelector('[data-route]')?.getAttribute('data-route')).toBe('E0 C1 C2 S102')
  rerender(<SchematicMap {...props} route={null} />)
  expect(container.querySelector('[data-route]')).toBeNull()
  expect(screen.getByText('Selecione os locais e calcule uma rota.')).toBeTruthy()
  rerender(<SchematicMap {...props} graph={G3} route={findRoute(G3, 'E0', 'S101')} />)
  expect(container.querySelector('[data-route]')).toBeNull()
  expect(screen.getByText(/Não há caminho disponível/)).toBeTruthy()
})

it('permite ampliar, reduzir e restaurar a visualização sem alterar a rota', () => {
  render(<SchematicMap {...props} />)
  fireEvent.click(screen.getByRole('button', { name: 'Ampliar mapa' }))
  expect(screen.getByText('125%')).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Ajustar mapa' }))
  expect(screen.getByText('100%')).toBeTruthy()
  expect(screen.getByRole('button', { name: 'Reduzir mapa' })).toHaveProperty('disabled', true)
})
