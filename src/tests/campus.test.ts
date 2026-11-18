import { describe, expect, it } from 'vitest'
import { campusGraph, campusLocations, campusMetadata, campusMeasurements, campusModels, campusPhotos } from '../data/campus'
import { getCampusView, photosForLocation } from '../modules/campus/selectors'
import { findRoute } from '../modules/navigation/findRoute'
import { buildMapView } from '../modules/visualization/adapters'
import { preliminaryMeasurements } from '../config/visualization'

describe('referências do campus e limites do levantamento', () => {
  it('mantém IDs únicos e converte locais em nós existentes', () => {
    expect(campusLocations.length).toBeGreaterThan(6)
    expect(new Set(campusLocations.map(place => place.id)).size).toBe(campusLocations.length)
    for (const place of campusLocations) {
      expect(campusGraph.nodes.some(node => node.id === place.nodeId)).toBe(true)
      expect(campusMetadata[place.id]).toBeDefined()
      expect(place.block).not.toBe('Bloco B')
    }
  })
  it('calcula percurso externo explicitamente demonstrativo, sem custos em metros', () => {
    const origin = campusLocations.find(place => place.id === 'ms-referencia')!
    const destination = campusLocations.find(place => place.id === 'a0-referencia')!
    expect(findRoute(campusGraph, origin.nodeId, destination.nodeId)).toEqual({ status: 'ok', path: ['MS-REF', 'MS-SAIDA', 'EXT-REF', 'EXT-CURVA', 'A0-REF'], cost: 4 })
  })
  it('não cria passagem do térreo ao primeiro andar nem portas de sanitários não confirmadas', () => {
    expect(findRoute(campusGraph, 'A0-REF', 'A1-C1').status).toBe('no-path')
    expect(findRoute(campusGraph, 'MS-REF', 'A1-C1').status).toBe('no-path')
    expect(findRoute(campusGraph, 'A1-C1', 'A1-WC').status).toBe('ok')
    expect(findRoute(campusGraph, 'A1-C1', 'A1-C1').status).toBe('same-location')
  })
  it('separa o térreo pendente da topologia ilustrativa do primeiro andar', () => {
    const ground = getCampusView('bloco-a', 0)
    const first = getCampusView('bloco-a', 1)
    expect(ground.graph.nodes.some(node => node.id === 'A0-REF')).toBe(true)
    expect(ground.graph.nodes.some(node => node.id.startsWith('A1-'))).toBe(false)
    expect(ground.siteArea).toBe('bloco-a')
    expect(first.graph.nodes.some(node => node.id === 'A1-C1')).toBe(true)
    expect(first.graph.nodes.some(node => node.id === 'A0-REF')).toBe(false)
    expect(ground.notice).toContain('Planta do térreo pendente')
    expect(first.notice).toContain('original pendente')
  })
  it('adapta o percurso local e nunca liga uma rota de outro andar', () => {
    const first = getCampusView('bloco-a', 1)
    const route = findRoute(campusGraph, 'A1-C1', 'A1-C3')
    const map = buildMapView(first.graph, campusLocations, first.positions, route)
    expect(map.route.map(node => node.id)).toEqual(['A1-C1', 'A1-C4', 'A1-C3'])
    const ground = getCampusView('bloco-a', 0)
    expect(buildMapView(ground.graph, campusLocations, ground.positions, route).route).toEqual([])
  })
  it('não atribui medidas auxiliares a trechos nem inventa coordenadas métricas', () => {
    expect(campusMeasurements.map(({ meters, description }) => ({ meters, description })))
      .toEqual(preliminaryMeasurements.map(({ meters, description }) => ({ meters, description })))
    expect(campusMeasurements.every(item => item.confidence === 'approximate')).toBe(true)
    expect(campusMeasurements.slice(2).every(item => item.segmentId === null)).toBe(true)
    expect(Object.values(campusMetadata).every(item => item.positionMeters === null)).toBe(true)
  })
  it('associa fotos reais ao primeiro andar sem inventar sua posição na planta', () => {
    expect(photosForLocation('a1-foto')).toHaveLength(2)
    expect(photosForLocation('ms-referencia')).toEqual([])
    expect(campusPhotos.every(photo => photo.floor === 1 && photo.areaId === 'bloco-a')).toBe(true)
    expect(campusPhotos.every(photo => photo.positionConfidence === 'pending')).toBe(true)
  })
  it('prepara dois modelos sem URLs ou transformações fictícias', () => {
    expect(campusModels.map(model => model.areaId)).toEqual(['minishopping', 'bloco-a'])
    expect(campusModels.every(model => model.url === null && model.originMeters === null && model.metersPerUnit === null && model.yawDegrees === null)).toBe(true)
    expect(campusModels.every(model => model.entryNodeIds.length === 0)).toBe(true)
  })
})
