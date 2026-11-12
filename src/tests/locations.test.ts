import { describe, expect, it } from 'vitest'
import { mockLocations } from '../data/locations.mock'

// IDs compartilhados com os cenários fictícios planejados; não são um mapa real.
const knownNodeIds = ['E0', 'C1', 'C2', 'S101', 'S102', 'L01'] as const
const allowedTypes = [
  'entrance', 'corridor', 'room', 'laboratory', 'service',
  'shop', 'restroom', 'stairs', 'elevator', 'other',
]

describe('DATA-01 — contrato do catálogo fictício', () => {
  it.each(knownNodeIds)('recupera %s com identificação e setor válidos', nodeId => {
    const location = mockLocations.find(item => item.nodeId === nodeId)
    expect(location, `Local do nó ${nodeId} deve existir`).toBeDefined()
    if (!location) throw new Error(`Local ausente: ${nodeId}`)

    expect(location.id.trim().length).toBeGreaterThan(0)
    expect(location.name.trim().length).toBeGreaterThan(0)
    expect(location.nodeId.trim()).toBe(nodeId)
    expect(location.block.trim().length).toBeGreaterThan(0)
    expect(typeof location.floor).toBe('number')
    expect(Number.isFinite(location.floor)).toBe(true)
    expect(allowedTypes).toContain(location.type)
  })

  it('mantém seis registros com IDs únicos para identificação na interface', () => {
    expect(mockLocations).toHaveLength(6)
    expect(new Set(mockLocations.map(location => location.id)).size).toBe(mockLocations.length)
  })

  it('referencia somente os nós fictícios esperados, sem referências vazias', () => {
    expect(mockLocations.map(location => location.nodeId).sort()).toEqual([...knownNodeIds].sort())
  })

  it('permite recuperar a sala pelo código e mantém coordenadas opcionais', () => {
    const room = mockLocations.find(location => location.code === 'S101')
    expect(room).toMatchObject({ name: 'Sala 101', type: 'room', nodeId: 'S101' })
    expect(room).not.toHaveProperty('position')
  })
})
