import { useEffect, useRef, useState } from 'react'
import { LocationField } from './components/LocationField'
import { RouteResultView } from './components/RouteResultView'
import SearchField from './components/SearchField'
import { mockLocations } from './data/locations.mock'
import { G1 } from './data/graphs/fixtures'
import { findRoute } from './modules/navigation/findRoute'
import type { Graph, RouteResult } from './modules/navigation/types'
import { searchLocations } from './modules/search/searchLocations'

export default function App({ graph = G1 }: { graph?: Graph }) {
  const [originId, setOriginId] = useState('')
  const [destinationId, setDestinationId] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<RouteResult | null>(null)
  const resultRef = useRef<HTMLDivElement>(null)
  const matches = searchLocations(mockLocations, query)

  // Aguarda o percurso renderizar para trazer o resultado inteiro à tela no celular.
  useEffect(() => {
    if (result) resultRef.current?.focus()
  }, [result])

  function changeLocation(field: 'origin' | 'destination', id: string) {
    if (field === 'origin') setOriginId(id)
    else setDestinationId(id)
    setSubmitted(false)
    setResult(null)
  }

  function swapLocations() {
    setOriginId(destinationId)
    setDestinationId(originId)
    setSubmitted(false)
    setResult(null)
  }

  function calculateRoute() {
    setSubmitted(true)
    setResult(null)
    if (!originId || !destinationId) {
      document.getElementById(!originId ? 'origin' : 'destination')?.focus()
      return
    }
    const origin = mockLocations.find(location => location.id === originId)
    const destination = mockLocations.find(location => location.id === destinationId)
    setResult(origin && destination
      ? findRoute(graph, origin.nodeId, destination.nodeId)
      : { status: 'invalid-location', path: [] })
  }

  return (
    <>
      <a className="skip-link" href="#main-content">Ir para o conteúdo</a>
      <header className="site-header">
        <div className="brand-mark" aria-hidden="true">N</div>
        <div>
          <p className="institution">UNIMA Afya · Maceió</p>
          <h1>Navegação Indoor</h1>
        </div>
      </header>

      <main id="main-content" tabIndex={-1}>
        <div className="intro">
          <p className="eyebrow">Minishopping + parte do primeiro bloco</p>
          <p className="intro-title">Seu caminho pelo campus.</p>
          <p className="preview-label">Navegação experimental · Dados fictícios</p>
        </div>

        <div className="workspace">
          <section className="planner panel" aria-labelledby="planner-title">
            <h2 id="planner-title">Planeje seu trajeto</h2>
            <p className="section-description" id="preview-note">
              Escolha sua origem e o local que deseja encontrar.
            </p>

            <div className="search-field">
              <SearchField label="Pesquisar local" value={query} onChange={setQuery}
                placeholder="Nome ou código do local" />
              <p className="search-message" role="status" aria-live="polite" aria-atomic="true">
                {!query.trim() ? 'Pesquise por nome ou código para escolher o destino.'
                  : matches.length === 0 ? 'Nenhum local encontrado.'
                  : `${matches.length} ${matches.length === 1 ? 'local encontrado' : 'locais encontrados'}. Escolha o destino.`}
              </p>
              {matches.length > 0 && (
                <ul className="search-results" aria-label="Locais encontrados">
                  {matches.map(location => (
                    <li key={location.id}>
                      <button type="button" onClick={() => {
                        changeLocation('destination', location.id)
                        setQuery('')
                        document.getElementById('destination')?.focus()
                      }}>
                        <span>{location.name}{location.code ? ` · ${location.code}` : ''}</span>
                        <small>{location.block}</small>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <form onSubmit={event => { event.preventDefault(); calculateRoute() }}>
              <fieldset className="route-fields" aria-describedby="preview-note">
                <legend>Origem e destino</legend>
                <LocationField id="origin" label="Origem" locations={mockLocations} value={originId}
                  onChange={id => changeLocation('origin', id)} error={submitted && !originId ? 'Selecione a origem.' : undefined} />
                <button className="swap-button" type="button" onClick={swapLocations}>Inverter origem e destino</button>
                <LocationField id="destination" label="Destino" locations={mockLocations} value={destinationId}
                  onChange={id => changeLocation('destination', id)} error={submitted && !destinationId ? 'Selecione o destino.' : undefined} />
              </fieldset>

              <button className="calculate-button" type="submit">
                Calcular rota
              </button>
            </form>
            <p className="manual-origin">A origem é escolhida manualmente.</p>

            <div className="catalog-note">
              <span className="catalog-count">{mockLocations.length.toString().padStart(2, '0')}</span>
              <p>locais de exemplo<span>Para desenvolvimento da interface</span></p>
            </div>
          </section>

          <section className="map-panel panel" aria-labelledby="map-title">
            <div className="panel-heading">
              <h2 id="map-title">Mapa / 3D</h2>
              <span className="status-label">Em preparação</span>
            </div>
            <div className="map-placeholder">
              <div className="placeholder-mark" aria-hidden="true"><span /><span /><span /></div>
              <h3>Um espaço para explorar.</h3>
              <p>Esta área receberá o mapa e a exploração 3D dos ambientes.</p>
              <span className="placeholder-caption">Sem representação do campus nesta etapa</span>
            </div>
          </section>

          <div className="route-summary" ref={resultRef} tabIndex={-1}>
            <RouteResultView result={result} />
          </div>
        </div>

        <footer className="project-note">
          Projeto acadêmico · Os locais de exemplo não representam um levantamento real da instituição.
        </footer>
      </main>
    </>
  )
}
