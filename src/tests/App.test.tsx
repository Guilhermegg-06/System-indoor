// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import App from '../App'
import { mockLocations } from '../data/locations.mock'

afterEach(cleanup)

describe('INT-01 — pesquisa e escolha do destino', () => {
  it.each(['sala 101', 's101'])('pesquisa %s e usa o resultado como destino', query => {
    render(<App />)
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
    render(<App />)
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
    render(<App />)
    expect(screen.getByRole('heading', { level: 1, name: 'Navegação Indoor' })).toBeTruthy()
    expect(screen.getByRole('main')).toBeTruthy()
    expect(screen.getByText('Navegação experimental · Dados fictícios')).toBeTruthy()
  })

  it('valida os dois campos vazios e direciona o foco ao primeiro erro', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Calcular rota' }))
    expect(screen.getByText('Selecione a origem.')).toBeTruthy()
    expect(screen.getByText('Selecione o destino.')).toBeTruthy()
    expect(screen.getByLabelText('Origem').getAttribute('aria-invalid')).toBe('true')
    expect(screen.getByLabelText('Destino').getAttribute('aria-describedby')).toBe('destination-error')
    expect(document.activeElement).toBe(screen.getByLabelText('Origem'))
  })

  it.each(['Origem', 'Destino'])('seleciona %s pelo id do catálogo', label => {
    render(<App />)
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
    render(<App />)
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
    render(<App />)
    fireEvent.change(screen.getByLabelText(label), { target: { value: 'entrada' } })
    fireEvent.click(screen.getByRole('button', { name: 'Calcular rota' }))
    const missing = label === 'Origem' ? 'destino' : 'origem'
    expect(screen.getByText(`Selecione ${missing === 'origem' ? 'a' : 'o'} ${missing}.`)).toBeTruthy()
    expect(screen.getByLabelText(label).getAttribute('aria-invalid')).not.toBe('true')
  })

  it('reserva mapa e resumo, sem inventar trajeto ou representação real', () => {
    render(<App />)
    const map = screen.getByRole('region', { name: 'Mapa / 3D' })
    expect(within(map).getByText('Sem representação do campus nesta etapa')).toBeTruthy()
    const summary = screen.getByRole('region', { name: 'Resumo da rota' })
    expect(within(summary).getByText('Nenhum trajeto calculado.')).toBeTruthy()
  })
})
