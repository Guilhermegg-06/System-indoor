import { describe, expect, it } from 'vitest'
import { filterLocations, getLocationCatalog } from './catalog'

describe('INT-01: pesquisa ligada a dados fictícios', () => {
  it('expõe o catálogo do grafo fictício', () => {
    const catalog = getLocationCatalog()
    expect(catalog.map(item => item.id)).toEqual(['E0', 'C1', 'C2', 'S101', 'S102', 'L01', 'C3', 'I01'])
    expect(catalog[0]).toMatchObject({ id: 'E0', label: 'Entrada principal' })
  })

  it('filtra resultados por texto e código, priorizando o nome do local', () => {
    const catalog = getLocationCatalog()
    expect(filterLocations('sala', catalog).slice(0, 2).map(item => item.id)).toEqual(['S101', 'S102'])
    expect(filterLocations('E0', catalog).map(item => item.id)).toEqual(['E0'])
  })

  it('mantém a interface resiliente quando a consulta estiver vazia', () => {
    const catalog = getLocationCatalog()
    expect(filterLocations('', catalog)).toHaveLength(4)
  })
})
