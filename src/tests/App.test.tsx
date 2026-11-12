// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import App from '../App'
import { mockLocations } from '../data/locations.mock'

afterEach(cleanup)

describe('UI-01 — layout sem navegação funcional', () => {
  it('renderiza título, conteúdo principal e aviso de dados fictícios', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1, name: 'Navegação Indoor' })).toBeTruthy()
    expect(screen.getByRole('main')).toBeTruthy()
    expect(screen.getByText('Prévia de layout · Dados fictícios')).toBeTruthy()
  })

  it('mantém busca e cálculo indisponíveis, sem sugerir uma rota funcional', () => {
    render(<App />)
    expect(screen.getByRole('searchbox', { name: 'Pesquisar local' })).toHaveProperty('disabled', true)
    expect(screen.getByRole('button', { name: 'Calcular rota' })).toHaveProperty('disabled', true)
    expect(screen.getByText(/Busca, seleção e cálculo de rota ainda não estão disponíveis/)).toBeTruthy()
  })

  it.each(['Origem', 'Destino'])('prepara %s a partir do catálogo sem habilitar seleção', label => {
    render(<App />)
    const select = screen.getByRole('combobox', { name: label })
    expect(select).toHaveProperty('disabled', true)
    expect(select).toHaveProperty('value', '')
    expect(within(select).getAllByRole('option')).toHaveLength(mockLocations.length + 1)
    for (const location of mockLocations) {
      expect(within(select).getByRole('option', { name: `${location.name} · ${location.block}` }))
        .toHaveProperty('value', location.id)
    }
  })

  it('reserva mapa e resumo, sem inventar trajeto ou representação real', () => {
    render(<App />)
    const map = screen.getByRole('region', { name: 'Mapa / 3D' })
    expect(within(map).getByText('Sem representação do campus nesta etapa')).toBeTruthy()
    const summary = screen.getByRole('region', { name: 'Resumo da rota' })
    expect(within(summary).getByText('Nenhum trajeto calculado.')).toBeTruthy()
  })
})
