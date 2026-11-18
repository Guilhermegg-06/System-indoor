import { useEffect, useRef, useState } from 'react'
import { LocationField } from './components/LocationField'
import { RouteResultView } from './components/RouteResultView'
import SearchField from './components/SearchField'
import { mockLocations } from './data/locations.mock'
import { G1 } from './data/graphs/fixtures'
import { findRoute } from './modules/navigation/findRoute'
import type { Graph, RouteResult } from './modules/navigation/types'
import { searchLocations } from './modules/search/searchLocations'
import { VisualizationPanel } from './modules/visualization/VisualizationPanel'
import { visualizationConfig } from './config/visualization'
import type { VisualizationConfig } from './modules/visualization/types'
import { campusGraph, campusLocations, campusMetadata, campusModels } from './data/campus'
import { getCampusView, photosForLocation } from './modules/campus/selectors'
import { CampusViewControls } from './modules/campus/CampusViewControls'
import { LocationReference } from './modules/campus/LocationReference'
import type { MapArea } from './modules/campus/types'

interface AppProps { graph?: Graph; visualization?: VisualizationConfig; initialDataset?: 'campus' | 'demo'; initialView?: 'campus' | 'first' }

export default function App({ graph, visualization = visualizationConfig, initialDataset = 'campus', initialView = 'campus' }: AppProps) {
  const [dataset, setDataset] = useState(initialDataset)
  return <NavigationApp key={dataset} graph={graph ?? (dataset === 'campus' ? campusGraph : G1)} visualization={visualization}
    isCampus={dataset === 'campus'} initialView={initialView} onDatasetChange={setDataset} />
}

function NavigationApp({ graph, visualization, isCampus, initialView, onDatasetChange }: {
  graph: Graph; visualization: VisualizationConfig; isCampus: boolean; initialView: 'campus' | 'first'; onDatasetChange: (dataset: 'campus' | 'demo') => void
}) {
  const locations = isCampus ? campusLocations : mockLocations
  const navigableLocations = isCampus ? locations.filter(place => campusMetadata[place.id].navigation !== 'pending') : locations
  const [area, setArea] = useState<MapArea>(isCampus && initialView === 'first' ? 'bloco-a' : 'campus')
  const [floor, setFloor] = useState(isCampus && initialView === 'first' ? 1 : 0)
  const [inspectedLocationId, setInspectedLocationId] = useState('')
  const [originId, setOriginId] = useState('')
  const [destinationId, setDestinationId] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<RouteResult | null>(null)
  const resultRef = useRef<HTMLDivElement>(null)
  const matches = searchLocations(navigableLocations, query)
  const campusView = getCampusView(area, floor)
  const model = campusModels.find(item => item.areaId === area && item.floorId === (area === 'minishopping' ? 'ms-0' : floor === 1 ? 'a-1' : 'a-0'))
  const mapConfig: VisualizationConfig = isCampus ? { ...visualization, modelUrl: model?.url ?? null,
    schematicPositions: campusView.positions, spatialPositions: {}, mapNotice: campusView.notice,
    mapTitle: `Mapa esquemático · ${area === 'campus' ? 'Campus' : area} · ${floor === 1 ? 'Primeiro andar' : 'Térreo / exterior'}`,
    regions: campusView.regions, floorPlan: campusView.floorPlan, siteArea: campusView.siteArea } : visualization
  const mapGraph = isCampus ? campusView.graph : graph
  const routePhotoLocation = result?.status === 'ok' && isCampus
    ? locations.find(place => result.path.includes(place.nodeId) && photosForLocation(place.id).length > 0) : undefined

  // Aguarda o percurso renderizar para trazer o resultado inteiro à tela no celular.
  useEffect(() => {
    if (result) resultRef.current?.focus()
  }, [result])

  function changeLocation(field: 'origin' | 'destination', id: string) {
    if (field === 'origin') setOriginId(id)
    else setDestinationId(id)
    setSubmitted(false)
    setResult(null)
    setInspectedLocationId(id)
    if (isCampus) {
      const location = locations.find(place => place.id === id)
      if (location) { setArea(location.floor === 1 ? 'bloco-a' : 'campus'); setFloor(location.floor) }
    }
  }

  function swapLocations() {
    setOriginId(destinationId)
    setDestinationId(originId)
    setSubmitted(false)
    setResult(null)
    setInspectedLocationId(originId)
  }

  function calculateRoute() {
    setSubmitted(true)
    setResult(null)
    if (!originId || !destinationId) {
      document.getElementById(!originId ? 'origin' : 'destination')?.focus()
      return
    }
    const origin = locations.find(location => location.id === originId)
    const destination = locations.find(location => location.id === destinationId)
    const next = origin && destination
      ? findRoute(graph, origin.nodeId, destination.nodeId)
      : { status: 'invalid-location' as const, path: [] as [] }
    setResult(next)
    if (isCampus && next.status === 'ok') {
      setArea(origin?.floor === 1 ? 'bloco-a' : 'campus')
      setFloor(origin?.floor ?? 0)
    }
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
          <p className="eyebrow">Minishopping + Bloco A · Escopo inicial</p>
          <p className="intro-title">Seu caminho pelo campus.</p>
          <p className="preview-label">{isCampus ? 'Referências reais · Mapa e rotas provisórios' : 'Navegação experimental · Dados fictícios'}</p>
          <div className="dataset-switch"><label htmlFor="navigation-data">Dados da navegação</label>
            <select id="navigation-data" value={isCampus ? 'campus' : 'demo'} onChange={event => onDatasetChange(event.target.value as 'campus' | 'demo')}>
              <option value="campus">Campus · referências e esquema provisório</option>
              <option value="demo">Demonstração original · 6 locais fictícios</option>
            </select>
          </div>
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
              <LocationField id="origin" label="Origem" locations={navigableLocations} value={originId}
                  onChange={id => changeLocation('origin', id)} error={submitted && !originId ? 'Selecione a origem.' : undefined} />
                <button className="swap-button" type="button" onClick={swapLocations}>Inverter origem e destino</button>
              <LocationField id="destination" label="Destino" locations={navigableLocations} value={destinationId}
                  onChange={id => changeLocation('destination', id)} error={submitted && !destinationId ? 'Selecione o destino.' : undefined} />
              </fieldset>

              <button className="calculate-button" type="submit">
                Calcular rota
              </button>
            </form>
            <p className="manual-origin">A origem é escolhida manualmente.</p>
            {isCampus && <aside className="mapping-note"><p>Mapeamento: acessos e rotas demonstrativos, ainda não homologados. Sem conexão entre térreo e primeiro andar.</p>
              <p>Corredores · fotos: referência geral pendente de localização, não é destino navegável.</p>
              <button type="button" onClick={() => setInspectedLocationId('a1-foto')}>Ver fotos do primeiro andar</button></aside>}

            <div className="catalog-note">
              <span className="catalog-count">{locations.length.toString().padStart(2, '0')}</span>
              <p>{isCampus ? 'referências de locais' : 'locais de exemplo'}<span>{isCampus ? 'Salas 09–16 · posições aproximadas' : 'Para desenvolvimento da interface'}</span></p>
            </div>
          </section>

          <VisualizationPanel key={isCampus ? campusView.id : 'demo'} graph={mapGraph} locations={locations} config={mapConfig} route={result}
            onOpenArea={(nextArea, nextFloor) => { setArea(nextArea); setFloor(nextFloor) }}
            onLocationSelect={isCampus ? changeLocation : undefined}
            originNodeId={locations.find(location => location.id === originId)?.nodeId}
            destinationNodeId={locations.find(location => location.id === destinationId)?.nodeId}
            contextControls={isCampus && <><CampusViewControls area={area} floor={floor} onAreaChange={next => { setArea(next); setFloor(0) }} onFloorChange={setFloor} />
              {result?.status === 'ok' && <nav className="route-stages" aria-label="Etapas da rota">
                <p>Rota demonstrativa · {result.path.some(id => id.startsWith('A1-')) ? 'Primeiro andar' : 'Passeio externo · acessos do térreo'}. Resultado completo preservado abaixo.</p>
                {(result.path.some(id => id.startsWith('A1-')) ? [{ area: 'bloco-a' as MapArea, floor: 1, name: 'Ver rota no primeiro andar' }]
                  : [{ area: 'campus' as MapArea, floor: 0, name: 'Ver rota completa' },
                    ...[{ id: 'MS-REF', area: 'minishopping' as MapArea, name: 'Etapa: Minishopping' }, { id: 'EXT-REF', area: 'percurso-externo' as MapArea, name: 'Etapa: percurso externo' }, { id: 'A0-REF', area: 'bloco-a' as MapArea, name: 'Etapa: Bloco A térreo' }]
                      .filter(step => result.path.includes(step.id)).map(step => ({ ...step, floor: 0 }))]).map(step => <button key={step.name} type="button" onClick={() => { setArea(step.area); setFloor(step.floor) }}>{step.name}</button>)}
              </nav>}
            </>} />

          <div className="route-summary" ref={resultRef} tabIndex={-1}>
            <RouteResultView result={result} />
            {isCampus && result?.status === 'no-path' && <p className="mapping-note">{locations.find(place => place.id === originId)?.floor !== locations.find(place => place.id === destinationId)?.floor
              ? 'Não há escada, elevador ou ligação entre pavimentos cadastrada. Este trajeto está indisponível por falta de levantamento.'
              : 'Não há ligação utilizável cadastrada para estes acessos. Consulte a pendência de mapeamento.'}</p>}
            {isCampus && <>
              {routePhotoLocation && <button type="button" className="route-photo-button" onClick={() => setInspectedLocationId(routePhotoLocation.id)}>Ver fotos de referência do percurso</button>}
              <LocationReference location={locations.find(place => place.id === inspectedLocationId)} />
              {inspectedLocationId && <p className="reference-caption">{campusMetadata[inspectedLocationId]?.source} Coordenadas métricas: pendentes.</p>}
            </>}
          </div>
        </div>

        <footer className="project-note">
          {isCampus ? 'Projeto acadêmico · Fotos reais do primeiro andar; posições e passagens ainda não homologadas. Não há conexão entre pisos cadastrada. Bloco B fora do escopo.'
            : 'Projeto acadêmico · Os locais de exemplo não representam um levantamento real da instituição.'}
        </footer>
      </main>
    </>
  )
}
