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
import { getCampusView, photosForLocation, routeStages, campusFrame } from './modules/campus/selectors'
import { CampusViewControls } from './modules/campus/CampusViewControls'
import { LocationReference } from './modules/campus/LocationReference'
import { projectRouteToView } from './modules/visualization/adapters'
import type { MapArea } from './modules/campus/types'

interface AppProps { graph?: Graph; visualization?: VisualizationConfig; initialDataset?: 'campus' | 'demo'; initialView?: 'campus' | 'first' }

export default function App({ graph, visualization = visualizationConfig, initialDataset = 'campus', initialView = 'campus' }: AppProps) {
  const dataset = initialDataset
  return <NavigationApp key={dataset} graph={graph ?? (dataset === 'campus' ? campusGraph : G1)} visualization={visualization}
    isCampus={dataset === 'campus'} initialView={initialView} />
}

function NavigationApp({ graph, visualization, isCampus, initialView }: {
  graph: Graph; visualization: VisualizationConfig; isCampus: boolean; initialView: 'campus' | 'first'
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
    mapTitle: `Planta 2D · ${area === 'campus' ? 'Campus' : area} · ${floor === 1 ? 'Primeiro andar' : 'Térreo / exterior'}`,
    regions: campusView.regions, floorPlan: campusView.floorPlan, siteArea: campusView.siteArea } : visualization
  const viewIds = new Set(campusView.graph.nodes.map(node => node.id))
  const mapGraph = isCampus ? { nodes: graph.nodes.filter(node => viewIds.has(node.id)), edges: graph.edges.filter(edge => viewIds.has(edge.from) && viewIds.has(edge.to)) } : graph
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
      if (location) { setArea(location.nodeId === 'A0-REF' ? 'campus' : campusMetadata[location.id].areaId); setFloor(location.floor) }
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
      const step = routeStages(next.path)[0]
      if (step) { setArea(step.area); setFloor(step.floor) }
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
        <div className="intro" data-release="mvp-2d-final">
          <p className="eyebrow">Minishopping + Bloco A · Escopo inicial</p>
          <p className="intro-title">Seu caminho pelo campus.</p>
          <p className="preview-label">{isCampus ? 'Campus UNIMA Afya · plantas e percursos provisórios' : 'Navegação experimental · Dados fictícios'}</p>

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
                        <span>{location.name}{!isCampus && location.code ? ` · ${location.code}` : ''}</span>
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
            {isCampus && <aside className="mapping-note"><p>Plantas e trajetos demonstrativos, ainda não homologados. A troca de pavimento é simulada para apresentação acadêmica.</p>
              <button type="button" onClick={() => setInspectedLocationId('a1-foto')}>Ver fotos do primeiro andar</button></aside>}

            <div className="catalog-note">
              <span className="catalog-count">{locations.length.toString().padStart(2, '0')}</span>
              <p>{isCampus ? 'locais cadastrados' : 'locais de exemplo'}<span>{isCampus ? 'Salas 01–16 · dois pavimentos' : 'Para desenvolvimento da interface'}</span></p>
            </div>
          </section>

          <VisualizationPanel key={isCampus ? campusView.id : 'demo'} graph={mapGraph} locations={locations} config={mapConfig} route={isCampus ? projectRouteToView(graph, mapGraph, result) : result}
            onOpenArea={(nextArea, nextFloor) => { setArea(nextArea); setFloor(nextFloor) }}
            onLocationSelect={isCampus ? changeLocation : undefined}
            originNodeId={locations.find(location => location.id === originId)?.nodeId}
            destinationNodeId={locations.find(location => location.id === destinationId)?.nodeId}
            contextControls={isCampus && <><CampusViewControls area={area} floor={floor} onAreaChange={next => { setArea(next); setFloor(0) }} onFloorChange={setFloor} />
              {result?.status === 'ok' && <nav className="route-stages" aria-label="Etapas da rota">
                <p>Rota demonstrativa · acompanhe as etapas em ordem. Vista atual: {area === 'bloco-a' ? floor === 0 ? 'Térreo' : 'Primeiro andar' : area === 'campus' ? 'Campus' : area === 'minishopping' ? 'Minishopping' : 'Percurso externo'}.</p>
                <button type="button" onClick={() => { setArea('campus'); setFloor(0) }}>Visão geral da rota</button>
                {routeStages(result.path).map((step, index) => <button key={`${index}-${step.name}`} type="button"
                  aria-pressed={area === step.area && floor === step.floor}
                  onClick={() => { setArea(step.area); setFloor(step.floor) }}>{index + 1}. {step.name}</button>)}
                {result.path.some(id => campusFrame(id) === 'a0') && result.path.some(id => campusFrame(id) === 'a1') &&
                  <p>Conexão vertical simulada e provisória. Não representa uma escada real nem uma rota acessível homologada.</p>}
              </nav>}
            </>} />

          <div className="route-summary" ref={resultRef} tabIndex={-1}>
            <RouteResultView result={result} campus={isCampus} pointNames={isCampus ? Object.fromEntries(graph.nodes.map(node => [node.id,
              locations.find(place => place.nodeId === node.id)?.name ?? (node.id === 'MS-SAIDA' ? 'Saída do Minishopping' : node.id === 'EXT-CURVA' ? 'Curva no passeio externo' : node.id === 'A0-ENTRADA' ? 'Entrada demonstrativa do térreo' : 'Acesso aos sanitários')])) : undefined} />
            {isCampus && result?.status === 'no-path' && <p className="mapping-note">Não há passagem disponível na rede demonstrativa para esta seleção. Uma conexão pode estar bloqueada ou pendente.</p>}
            {isCampus && <>
              {routePhotoLocation && <button type="button" className="route-photo-button" onClick={() => setInspectedLocationId(routePhotoLocation.id)}>Ver fotos de referência do percurso</button>}
              {inspectedLocationId === 'a1-foto' && <LocationReference location={locations.find(place => place.id === inspectedLocationId)} />}
              {inspectedLocationId === 'a1-foto' && <p className="reference-caption">{campusMetadata[inspectedLocationId]?.source} Coordenadas métricas: pendentes.</p>}
            </>}
          </div>
        </div>

        <footer className="project-note">
          {isCampus ? 'Projeto acadêmico · Plantas e acessos aproximados. Térreo provisório e transição vertical simulada. Sem homologação física ou de acessibilidade.'
            : 'Projeto acadêmico · Os locais de exemplo não representam um levantamento real da instituição.'}
        </footer>
      </main>
    </>
  )
}
