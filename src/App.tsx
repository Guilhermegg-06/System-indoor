import { useMemo, useState } from 'react'
import SearchField, { type SearchResult } from './components/SearchField'
import { filterLocations, getLocationCatalog } from './modules/search/catalog'

function App() {
  const catalog = useMemo(() => getLocationCatalog(), [])
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<SearchResult | null>(null)

  const visibleResults = useMemo(() => filterLocations(query, catalog), [catalog, query])

  return (
    <main className="app-shell">
      <p className="eyebrow">UNIMA Afya · Projeto acadêmico</p>
      <h1>Navegação indoor</h1>
      <p>Base de desenvolvimento preparada para navegação pelo celular.</p>
      <p>O ambiente real da faculdade ainda não foi modelado. Nesta etapa, usamos dados fictícios.</p>

      <section className="search-panel">
        <SearchField
          label="Origem ou destino"
          placeholder="Buscar local"
          value={query}
          onChange={setQuery}
          onSubmit={() => {
            const match = visibleResults[0]
            if (match) {
              setSelected(match)
              setQuery(match.label)
            }
          }}
          results={catalog}
          onSelect={(item) => {
            setSelected(item)
            setQuery(item.label)
          }}
        />

        {selected ? (
          <div className="selected-result">
            <strong>Selecionado:</strong> {selected.label}
            {selected.description ? <span> · {selected.description}</span> : null}
          </div>
        ) : null}
      </section>
    </main>
  )
}

export default App

