import { G1 } from '../../data/graphs/fixtures'

export type SearchLocation = {
  id: string
  label: string
  description: string
}

const locationMeta: Record<string, { label: string; description: string }> = {
  E0: { label: 'Entrada principal', description: 'Ponto de entrada do bloco' },
  C1: { label: 'Corredor 1', description: 'Conexão principal do pavimento' },
  C2: { label: 'Corredor 2', description: 'Conexão entre salas e laboratório' },
  C3: { label: 'Corredor 3', description: 'Desvio temporário' },
  S101: { label: 'Sala 101', description: 'Sala de aula' },
  S102: { label: 'Sala 102', description: 'Sala de aula' },
  L01: { label: 'Laboratório 01', description: 'Laboratório de informática' },
  I01: { label: 'Índex', description: 'Ponto isolado para testes' },
}

export function getLocationCatalog() {
  return G1.nodes.map((node) => ({
    id: node.id,
    label: locationMeta[node.id]?.label ?? node.id,
    description: locationMeta[node.id]?.description ?? 'Local cadastrado no gráfico fictício',
  }))
}

export function filterLocations(query: string, locations: SearchLocation[] = getLocationCatalog()) {
  const term = query.trim().toLowerCase()
  if (!term) return locations.slice(0, 4)

  return [...locations]
    .map((location) => {
      const haystack = `${location.label} ${location.description} ${location.id}`.toLowerCase()
      const matchesLabel = location.label.toLowerCase().includes(term)
      const matchesId = location.id.toLowerCase().includes(term)
      const matchesDescription = location.description.toLowerCase().includes(term)

      if (!haystack.includes(term)) return null

      if (matchesLabel || matchesId) return { location, rank: 0 }
      if (matchesDescription) return { location, rank: 1 }
      return { location, rank: 2 }
    })
    .filter((entry): entry is { location: SearchLocation; rank: number } => entry !== null)
    .sort((a, b) => a.rank - b.rank)
    .map(({ location }) => location)
}
