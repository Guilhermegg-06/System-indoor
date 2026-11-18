import type { Location } from '../locations/location.types'

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase('pt-BR').normalize('NFD').replace(/\p{M}/gu, '').replace(/\bbanheiros?\b/g, 'sanitarios').replace(/\b0+(\d)/g, '$1').replace(/([a-z])\s*0*(\d+)/g, '$1 $2')
}

export function searchLocations(locations: readonly Location[], query: string): readonly Location[] {
  const term = normalize(query)
  if (!term) return []
  return locations.filter(location =>
    normalize(location.name).includes(term) || normalize(location.code ?? '').includes(term))
}
