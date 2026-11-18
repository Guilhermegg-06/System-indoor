// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import App from '../App'
import { mockLocations } from '../data/locations.mock'
import { G1, G3 } from '../data/graphs/fixtures'
import type { Graph } from '../modules/navigation/types'

afterEach(cleanup)

describe('INT-01 — pesquisa e escolha do destino', () => {
  it.each(['sala 101', 's101'])('pesquisa %s e usa o resultado como destino', query => {
    render(<App initialDataset="demo" />)
    fireEvent.change(screen.getByLabelText('Origem'), { target: { value: 'entrada' } })
    const search = screen.getByRole('searchbox', { name: 'Pesquisar local' })
    expect(search).toHaveProperty('disabled', false)
    fireEvent.change(search, { target: { value: query } })
    const results = screen.getByRole('list', { name: 'Locais encontrados' })
    expect(within(results).getAllByRole('button')).toHaveLength(1)
    fireEvent.click(within(results).getByRole('button', { name: /Sala 101/ }))
    expect(screen.getByLabelText('Destino')).toHaveProperty('value', 'sala-101')
    expect(screen.getByLabelText('Origem')).toHaveProperty('value', 'entrada')
    expect(document.activeElement).toBe(screen.getByLabelText('Destino'))
  })

  it('informa consulta vazia e ausência de resultados e permite limpar a pesquisa', () => {
    render(<App initialDataset="demo" />)
    expect(screen.getByText('Pesquise por nome ou código para escolher o destino.')).toBeTruthy()
    const search = screen.getByRole('searchbox', { name: 'Pesquisar local' })
    fireEvent.change(search, { target: { value: 'biblioteca' } })
    expect(screen.getByText('Nenhum local encontrado.')).toBeTruthy()
    expect(screen.queryByRole('list', { name: 'Locais encontrados' })).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Limpar pesquisar local' }))
    expect(search).toHaveProperty('value', '')
    expect(screen.getByText('Pesquise por nome ou código para escolher o destino.')).toBeTruthy()
    expect(screen.getByLabelText('Destino')).toHaveProperty('value', '')
  })
})

describe('UI-01 e UI-03 — layout e seleção manual', () => {
  it('renderiza título, conteúdo principal e aviso de dados fictícios', () => {
    render(<App initialDataset="demo" />)
    expect(screen.getByRole('heading', { level: 1, name: 'Navegação Indoor' })).toBeTruthy()
    expect(screen.getByRole('main')).toBeTruthy()
    expect(screen.getByText('Navegação experimental · Dados fictícios')).toBeTruthy()
  })

  it('valida os dois campos vazios e direciona o foco ao primeiro erro', () => {
    render(<App initialDataset="demo" />)
    fireEvent.click(screen.getByRole('button', { name: 'Calcular rota' }))
    expect(screen.getByText('Selecione a origem.')).toBeTruthy()
    expect(screen.getByText('Selecione o destino.')).toBeTruthy()
    expect(screen.getByLabelText('Origem').getAttribute('aria-invalid')).toBe('true')
    expect(screen.getByLabelText('Destino').getAttribute('aria-describedby')).toBe('destination-error')
    expect(document.activeElement).toBe(screen.getByLabelText('Origem'))
  })

  it.each(['Origem', 'Destino'])('seleciona %s pelo id do catálogo', label => {
    render(<App initialDataset="demo" />)
    const select = screen.getByRole('combobox', { name: label })
    expect(select).toHaveProperty('disabled', false)
    expect(select).toHaveProperty('value', '')
    expect(within(select).getAllByRole('option')).toHaveLength(mockLocations.length + 1)
    for (const location of mockLocations) {
      expect(within(select).getByRole('option', { name: `${location.name} · ${location.block}` }))
        .toHaveProperty('value', location.id)
    }
    fireEvent.change(select, { target: { value: 'sala-101' } })
    expect(select).toHaveProperty('value', 'sala-101')
  })

  it('inverte origem e destino, inclusive quando um campo está vazio', () => {
    render(<App initialDataset="demo" />)
    const origin = screen.getByLabelText('Origem')
    const destination = screen.getByLabelText('Destino')
    fireEvent.change(origin, { target: { value: 'entrada' } })
    fireEvent.change(destination, { target: { value: 'sala-101' } })
    fireEvent.click(screen.getByRole('button', { name: 'Inverter origem e destino' }))
    expect(origin).toHaveProperty('value', 'sala-101')
    expect(destination).toHaveProperty('value', 'entrada')
    fireEvent.change(destination, { target: { value: '' } })
    fireEvent.click(screen.getByRole('button', { name: 'Inverter origem e destino' }))
    expect(origin).toHaveProperty('value', '')
    expect(destination).toHaveProperty('value', 'sala-101')
  })

  it.each(['Origem', 'Destino'])('valida somente o campo ausente após preencher %s', label => {
    render(<App initialDataset="demo" />)
    fireEvent.change(screen.getByLabelText(label), { target: { value: 'entrada' } })
    fireEvent.click(screen.getByRole('button', { name: 'Calcular rota' }))
    const missing = label === 'Origem' ? 'destino' : 'origem'
    expect(screen.getByText(`Selecione ${missing === 'origem' ? 'a' : 'o'} ${missing}.`)).toBeTruthy()
    expect(screen.getByLabelText(label).getAttribute('aria-invalid')).not.toBe('true')
  })

  it('identifica o mapa como esquemático e mantém resultado inicialmente vazio', () => {
    render(<App initialDataset="demo" />)
    const map = screen.getByRole('region', { name: 'Mapa / 3D' })
    expect(within(map).getByRole('img', { name: /Mapa esquemático/ })).toBeTruthy()
    expect(within(map).getByText(/Planta real não validada/)).toBeTruthy()
    const summary = screen.getByRole('region', { name: 'Resultado da rota' })
    expect(within(summary).getByText('Nenhuma rota calculada.')).toBeTruthy()
  })
})

it('liga pesquisa e seleção ao mapa, sem depender de um modelo 3D', () => {
  const { container } = render(<App initialDataset="demo" />)
  expect(screen.getByRole('button', { name: 'Visualização 3D' })).toHaveProperty('disabled', true)
  expect(screen.getByText(/Modelo 3D ainda não fornecido/)).toBeTruthy()
  fireEvent.change(screen.getByLabelText('Origem'), { target: { value: 'entrada' } })
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: 's101' } })
  fireEvent.click(screen.getByRole('button', { name: /Sala 101/ }))
  fireEvent.click(screen.getByRole('button', { name: 'Calcular rota' }))
  expect(container.querySelector('[data-route]')?.getAttribute('data-route')).toBe('E0 C1 C2 S101')
  fireEvent.change(screen.getByLabelText('Destino'), { target: { value: 'sala-102' } })
  expect(container.querySelector('[data-route]')).toBeNull()
  expect(container.querySelector('[data-node-id="S102"]')?.textContent).toContain('Destino')
  fireEvent.click(screen.getByRole('button', { name: 'Calcular rota' }))
  expect(container.querySelector('[data-route]')?.getAttribute('data-route')).toBe('E0 C1 C2 S102')
})

function selectJourney(destination = 'sala-101') {
  fireEvent.change(screen.getByLabelText('Origem'), { target: { value: 'entrada' } })
  fireEvent.change(screen.getByLabelText('Destino'), { target: { value: destination } })
  fireEvent.click(screen.getByRole('button', { name: 'Calcular rota' }))
}

function expectClearedRoute() {
  expect(screen.getByText('Nenhuma rota calculada.')).toBeTruthy()
  expect(screen.queryByRole('list', { name: 'Pontos da rota em ordem' })).toBeNull()
  expect(screen.queryByText(/Custo fictício:/)).toBeNull()
}

describe('INT-02 — interface integrada ao motor existente', () => {
  it('converte Location.id em nodeId e exibe Entrada → Sala 101 na ordem correta', () => {
    render(<App initialDataset="demo" />)
    selectJourney()
    const route = screen.getByRole('region', { name: 'Resultado da rota' })
    expect(within(route).getByRole('status').textContent).toBe('Rota encontrada. Siga os pontos na ordem apresentada.')
    expect(within(route).getAllByRole('listitem').map(item => item.textContent)).toEqual(['E0', 'C1', 'C2', 'S101'])
    expect(within(route).getByText('Custo fictício: 3 (sem unidade física).')).toBeTruthy()
  })

  it('calcula um destino escolhido pela pesquisa', () => {
    render(<App initialDataset="demo" />)
    fireEvent.change(screen.getByLabelText('Origem'), { target: { value: 'entrada' } })
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 's101' } })
    fireEvent.click(screen.getByRole('button', { name: /Sala 101/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Calcular rota' }))
    expect(screen.getAllByRole('listitem').map(item => item.textContent)).toEqual(['E0', 'C1', 'C2', 'S101'])
  })

  it('informa origem igual ao destino sem mostrar deslocamento', () => {
    render(<App initialDataset="demo" />)
    selectJourney('entrada')
    expect(screen.getByText('A origem e o destino são o mesmo local. Não é necessário se deslocar.')).toBeTruthy()
    expect(screen.queryByRole('list', { name: 'Pontos da rota em ordem' })).toBeNull()
  })

  const missingNode: Graph = { nodes: G1.nodes.filter(node => node.id !== 'E0'), edges: G1.edges.filter(edge => edge.from !== 'E0' && edge.to !== 'E0') }
  const invalidGraph: Graph = { ...G1, edges: [...G1.edges, { from: 'E0', to: 'C1', weight: -1 }] }
  it.each([
    ['no-path', G3, 'Não há caminho disponível entre a origem e o destino.'],
    ['invalid-location', missingNode, 'A origem ou o destino informado não existe nos dados de navegação.'],
    ['invalid-graph', invalidGraph, 'Os dados de navegação estão inconsistentes. Não foi possível apresentar a rota.'],
  ] as const)('apresenta %s retornado pelo motor real', (_status, graph, message) => {
    render(<App initialDataset="demo" graph={graph} />)
    selectJourney()
    expect(screen.getByText(message)).toBeTruthy()
    expect(screen.queryByRole('list', { name: 'Pontos da rota em ordem' })).toBeNull()
  })

  it('rejeita um id desconhecido mesmo se uma opção for inserida fora do catálogo', () => {
    render(<App initialDataset="demo" />)
    selectJourney()
    const destination = screen.getByLabelText('Destino')
    const option = document.createElement('option')
    option.value = 'inexistente'
    option.textContent = 'Local inexistente'
    destination.appendChild(option)
    fireEvent.change(destination, { target: { value: 'inexistente' } })
    fireEvent.click(screen.getByRole('button', { name: 'Calcular rota' }))
    expect(screen.getByText('A origem ou o destino informado não existe nos dados de navegação.')).toBeTruthy()
    expect(screen.queryByRole('list', { name: 'Pontos da rota em ordem' })).toBeNull()
    expect(screen.queryByText(/Custo fictício:/)).toBeNull()
  })

  it.each(['Origem', 'Destino'])('limpa a rota ao alterar %s e calcula somente com os novos valores', label => {
    render(<App initialDataset="demo" />)
    selectJourney()
    expect(screen.getByRole('list', { name: 'Pontos da rota em ordem' })).toBeTruthy()
    fireEvent.change(screen.getByLabelText(label), { target: { value: 'sala-102' } })
    expectClearedRoute()
    fireEvent.click(screen.getByRole('button', { name: 'Calcular rota' }))
    expect(screen.getAllByRole('listitem').map(item => item.textContent)).toEqual(label === 'Origem'
      ? ['S102', 'C2', 'S101'] : ['E0', 'C1', 'C2', 'S102'])
  })

  it('limpa ao inverter e calcula o percurso de retorno', () => {
    render(<App initialDataset="demo" />)
    selectJourney()
    fireEvent.click(screen.getByRole('button', { name: 'Inverter origem e destino' }))
    expectClearedRoute()
    fireEvent.click(screen.getByRole('button', { name: 'Calcular rota' }))
    expect(screen.getAllByRole('listitem').map(item => item.textContent)).toEqual(['S101', 'C2', 'C1', 'E0'])
  })

  it('limpa a rota quando a pesquisa substitui o destino', () => {
    render(<App initialDataset="demo" />)
    selectJourney()
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'l01' } })
    fireEvent.click(screen.getByRole('button', { name: /Laboratório 01/ }))
    expectClearedRoute()
    expect(screen.getByLabelText('Destino')).toHaveProperty('value', 'laboratorio-01')
  })

  it('remove percurso e custo ao esvaziar o destino, e valida nova tentativa', () => {
    render(<App initialDataset="demo" />)
    selectJourney()
    fireEvent.change(screen.getByLabelText('Destino'), { target: { value: '' } })
    expectClearedRoute()
    fireEvent.click(screen.getByRole('button', { name: 'Calcular rota' }))
    expect(screen.getByText('Selecione o destino.')).toBeTruthy()
    expectClearedRoute()
  })
})
