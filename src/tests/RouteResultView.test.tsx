// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import { RouteResultView } from '../components/RouteResultView'
import { G1, G2, G3 } from '../data/graphs/fixtures'
import { findRoute } from '../modules/navigation/findRoute'
import type { RouteResult } from '../modules/navigation/types'

afterEach(cleanup)

const nonRouteCases: { scenario: string; result: RouteResult | null; message: string }[] = [
  {
    scenario: 'estado inicial',
    result: null,
    message: 'Nenhuma rota calculada.',
  },
  {
    scenario: 'CTF019: mesma origem e destino',
    result: findRoute(G1, 'E0', 'E0'),
    message: 'A origem e o destino são o mesmo local. Não é necessário se deslocar.',
  },
  {
    scenario: 'CTF028: G3 sem caminho',
    result: findRoute(G3, 'E0', 'S101'),
    message: 'Não há caminho disponível entre a origem e o destino.',
  },
  {
    scenario: 'local inválido',
    result: findRoute(G1, 'ausente', 'S101'),
    message: 'A origem ou o destino informado não existe nos dados de navegação.',
  },
  {
    scenario: 'grafo inválido',
    result: findRoute({ ...G1, edges: [{ from: 'E0', to: 'S101', weight: -1 }] }, 'E0', 'S101'),
    message: 'Os dados de navegação estão inconsistentes. Não foi possível apresentar a rota.',
  },
]

describe('UI-04 — apresentação de resultados exclusivamente fictícios', () => {
  it('aceita a propriedade omitida no estado inicial', () => {
    render(<RouteResultView />)
    expect(screen.getByRole('region', { name: 'Resultado da rota' })).toBeTruthy()
    expect(screen.getByRole('status').textContent).toBe('Nenhuma rota calculada.')
    expect(screen.queryByRole('list')).toBeNull()
  })

  it.each(nonRouteCases)('apresenta mensagem distinta para $scenario', ({ result, message }) => {
    render(<RouteResultView result={result} />)
    expect(screen.getByRole('status').textContent).toBe(message)
    expect(screen.queryByRole('list')).toBeNull()
    expect(screen.queryByText(/Custo fictício:/)).toBeNull()
  })

  it.each([
    { scenario: 'CTF022: G1 normal', result: findRoute(G1, 'E0', 'S101'), path: ['E0', 'C1', 'C2', 'S101'] },
    { scenario: 'CTF023: G1 inverso', result: findRoute(G1, 'S101', 'E0'), path: ['S101', 'C2', 'C1', 'E0'] },
    { scenario: 'CTF026: G2 com desvio', result: findRoute(G2, 'E0', 'S101'), path: ['E0', 'C1', 'C3', 'C2', 'S101'] },
  ])('apresenta todos os pontos na ordem recebida — $scenario', ({ result, path }) => {
    render(<RouteResultView result={result} />)
    const list = screen.getByRole('list', { name: 'Pontos da rota em ordem' })
    expect(list.tagName).toBe('OL')
    expect(within(list).getAllByRole('listitem').map(item => item.textContent)).toEqual(path)
    expect(screen.getByRole('status').textContent).toBe('Rota encontrada. Siga os pontos na ordem apresentada.')
    expect(screen.getByText('Dados fictícios. Os pontos não representam um levantamento real da instituição.')).toBeTruthy()
  })

  it.each([0, 1.5])('mostra o custo recebido (%s) sem convertê-lo em distância ou tempo', cost => {
    const result: RouteResult = { status: 'ok', path: ['Ponto de teste B', 'Ponto de teste A'], cost }
    const { container } = render(<RouteResultView result={result} />)
    expect(screen.getByText(`Custo fictício: ${cost} (sem unidade física).`)).toBeTruthy()
    expect(within(screen.getByRole('list')).getAllByRole('listitem').map(item => item.textContent))
      .toEqual(result.path)
    expect(container.textContent).not.toMatch(/metros|minutos|\bkm\b|\bmin\b/)
  })

  it.each(nonRouteCases)('remove o caminho anterior ao receber $scenario', ({ result, message }) => {
    const { rerender } = render(<RouteResultView result={findRoute(G2, 'E0', 'S101')} />)
    expect(screen.getAllByRole('listitem')).toHaveLength(5)
    rerender(<RouteResultView result={result} />)
    expect(screen.getByRole('status').textContent).toBe(message)
    expect(screen.queryByRole('list')).toBeNull()
    expect(screen.queryByText(/Custo fictício:/)).toBeNull()
  })

  it('atualiza o caminho quando recebe outro resultado, sem reter os pontos do desvio', () => {
    const { rerender } = render(<RouteResultView result={null} />)
    rerender(<RouteResultView result={findRoute(G2, 'E0', 'S101')} />)
    expect(screen.getByRole('list').textContent).toContain('C3')
    rerender(<RouteResultView result={findRoute(G1, 'S101', 'E0')} />)
    expect(screen.getAllByRole('listitem').map(item => item.textContent)).toEqual(['S101', 'C2', 'C1', 'E0'])
    expect(screen.queryByText('C3')).toBeNull()
    rerender(<RouteResultView result={undefined} />)
    expect(screen.getByRole('status').textContent).toBe('Nenhuma rota calculada.')
    expect(screen.queryByRole('list')).toBeNull()
  })
})
