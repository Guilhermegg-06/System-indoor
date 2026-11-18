import { useState } from 'react'
import type { ReactNode } from 'react'
import type { Location } from '../locations/location.types'
import type { Graph, RouteResult } from '../navigation/types'
import SceneContainer from '../scene/SceneContainer'
import { SchematicMap } from './SchematicMap'
import type { VisualizationConfig } from './types'

interface Props {
  graph: Graph
  locations: readonly Location[]
  config: VisualizationConfig
  route: RouteResult | null
  originNodeId?: string
  destinationNodeId?: string
  contextControls?: ReactNode
}
export function VisualizationPanel({ graph, locations, config, route, originNodeId, destinationNodeId, contextControls }: Props) {
  const [mode, setMode] = useState<'map' | '3d'>('map')
  return <section className="map-panel panel" aria-labelledby="map-title">
    <div className="panel-heading">
      <h2 id="map-title">Mapa / 3D</h2>
      <span className="status-label">{config.mapNotice ? 'Referências + esquema provisório' : 'Dados fictícios'}</span>
    </div>
    {contextControls}
    <div className="view-switch" role="group" aria-label="Modo de visualização">
      <button type="button" aria-pressed={mode === 'map'} onClick={() => setMode('map')}>Mapa esquemático</button>
      <button type="button" aria-pressed={mode === '3d'} disabled={!config.modelUrl} aria-describedby={!config.modelUrl ? 'model-note' : undefined}
        onClick={() => setMode('3d')}>Visualização 3D</button>
    </div>
    {!config.modelUrl && <p className="model-note" id="model-note">Modelo 3D ainda não fornecido. Use o mapa esquemático.</p>}
    {mode === 'map' || !config.modelUrl
      ? <SchematicMap graph={graph} locations={locations} positions={config.schematicPositions} route={route}
          originNodeId={originNodeId} destinationNodeId={destinationNodeId} notice={config.mapNotice} title={config.mapTitle} regions={config.regions} />
      : <SceneContainer graph={graph} route={route} modelUrl={config.modelUrl} spatialPositions={config.spatialPositions} />}
  </section>
}
