import { describe, expect, it } from 'vitest'
import { mockLocations } from '../data/locations.mock'
import { searchLocations } from '../modules/search/searchLocations'

describe('INT-01 — consulta ao catálogo existente', () => {
  it.each([
    [' SALA 101 ', ['sala-101']],
    ['s101', ['sala-101']],
    ['laboratorio', ['laboratorio-01']],
    ['sala', ['sala-101', 'sala-102']],
    ['entrada', ['entrada']],
    ['', []], ['   ', []], ['biblioteca', []],
  ])('busca por nome ou código: %s', (query, expected) => {
    expect(searchLocations(mockLocations, query).map(location => location.id)).toEqual(expected)
  })

  it('retorna registros originais sem alterar o catálogo', () => {
    const before = structuredClone(mockLocations)
    expect(searchLocations(mockLocations, 'S101')[0]).toBe(mockLocations[3])
    expect(mockLocations).toEqual(before)
  })
})
