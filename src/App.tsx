import { useMemo, useState } from 'react'
import SearchField, { type SearchResult } from './components/SearchField'
import { G1 } from './data/graphs/fixtures'
import { findRoute } from './modules/navigation/findRoute'
import { filterLocations, getLocationCatalog } from './modules/search/catalog'

function App() {
  const catalog = useMemo(() => getLocationCatalog(), [])
  const [originQuery, setOriginQuery] = useState('')
  const [destinationQuery, setDestinationQuery] = useState('')
  const [origin, setOrigin] = useState<SearchResult | null>(null)
  const [destination, setDestination] = useState<SearchResult | null>(null)

  const visibleOriginResults = useMemo(() => filterLocations(originQuery, catalog), [catalog, originQuery])
  const visibleDestinationResults = useMemo(() => filterLocations(destinationQuery, catalog), [catalog, destinationQuery])

  const routeResult = useMemo(() => {
    if (!origin || !destination) return null
    return findRoute(G1, origin.id, destination.id)
  }, [destination, origin])

  return (
    <main className="app-shell">
      <p className="eyebrow">UNIMA Afya · Projeto acadêmico</p>
      <h1>Navegação indoor</h1>
      <p>Base de desenvolvimento preparada para navegação pelo celular.</p>
      <p>O ambiente real da faculdade ainda não foi modelado. Nesta etapa, usamos dados fictícios.</p>

      <section className="route-panel">
        <SearchField
          label="Origem"
          placeholder="Buscar origem"
          value={originQuery}
          onChange={setOriginQuery}
          onSubmit={() => {
            const match = visibleOriginResults[0]
            if (match) {
              setOrigin(match)
              setOriginQuery(match.label)
            }
          }}
          results={catalog}
          onSelect={(item) => {
            setOrigin(item)
            setOriginQuery(item.label)
          }}
        />

        <SearchField
          label="Destino"
          placeholder="Buscar destino"
          value={destinationQuery}
          onChange={setDestinationQuery}
          onSubmit={() => {
            const match = visibleDestinationResults[0]
            if (match) {
              setDestination(match)
              setDestinationQuery(match.label)
            }
          }}
          results={catalog}
          onSelect={(item) => {
            setDestination(item)
            setDestinationQuery(item.label)
          }}
        />

        {origin ? <div className="selection-pill"><strong>Origem:</strong> {origin.label}</div> : null}
        {destination ? <div className="selection-pill"><strong>Destino:</strong> {destination.label}</div> : null}

        {routeResult ? (
          <div className="route-summary" data-status={routeResult.status}>
            <strong>Status:</strong> {routeResult.status}
            {routeResult.status === 'ok' ? <span> · caminho: {routeResult.path.join(' → ')} · custo: {routeResult.cost}</span> : null}
            {routeResult.status === 'same-location' ? <span> · origem e destino iguais</span> : null}
            {routeResult.status === 'no-path' ? <span> · sem caminho disponível</span> : null}
            {(routeResult.status === 'invalid-location' || routeResult.status === 'invalid-graph') ? <span> · dados inválidos</span> : null}
          </div>
        ) : null}
      </section>
    </main>
  )
}

export default App

