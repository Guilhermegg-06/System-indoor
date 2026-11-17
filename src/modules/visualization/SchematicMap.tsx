import { useId, useState } from 'react'
import type { Location } from '../locations/location.types'
import type { Graph, RouteResult } from '../navigation/types'
import type { Positions2D } from './types'
import { buildMapView } from './adapters'
import styles from './SchematicMap.module.css'

interface Props {
  graph: Graph
  locations: readonly Location[]
  positions: Positions2D
  route?: RouteResult | null
  originNodeId?: string
  destinationNodeId?: string
}
const messages = {
  ok: 'Percurso destacado no esquema. Confira a sequência no resultado textual.',
  'same-location': 'Origem e destino coincidem no esquema.',
  'no-path': 'Não há caminho disponível no mapa esquemático.',
  'invalid-location': 'Local inválido. Escolha um local do catálogo.',
  'invalid-graph': 'Grafo inconsistente. Não é possível desenhar o percurso.',
}

export function SchematicMap({ graph, locations, positions, route, originNodeId, destinationNodeId }: Props) {
  const [zoom, setZoom] = useState(1)
  const titleId = useId()
  const view = buildMapView(graph, locations, positions, route)
  const xs = view.nodes.map(node => node.point.x)
  const ys = view.nodes.map(node => node.point.y)
  const left = Math.min(0, ...xs) - 20
  const top = Math.min(0, ...ys) - 20
  const width = Math.max(400, ...xs) - left + 90
  const height = Math.max(300, ...ys) - top + 90
  return (
    <div className={styles.container}>
      <p className={styles.notice}>Esquema fictício · Sem escala · Planta real não validada</p>
      <div className={styles.toolbar} role="group" aria-label="Ajustes do mapa">
        <button type="button" aria-label="Reduzir mapa" disabled={zoom <= 1} onClick={() => setZoom(value => Math.max(1, value - .25))}>−</button>
        <output aria-label="Zoom do mapa">{Math.round(zoom * 100)}%</output>
        <button type="button" aria-label="Ampliar mapa" disabled={zoom >= 2} onClick={() => setZoom(value => Math.min(2, value + .25))}>+</button>
        <button type="button" onClick={() => setZoom(1)}>Ajustar mapa</button>
      </div>
      <div className={styles.scroll} tabIndex={0} role="region" aria-label="Área do mapa; use a rolagem quando ampliado">
        <svg className={styles.map} style={{ width: `${zoom * 100}%`, height: `${zoom * 360}px` }} viewBox={`${left} ${top} ${width} ${height}`} role="img" aria-labelledby={titleId}>
          <title id={titleId}>Mapa esquemático dos locais fictícios</title>
          {view.edges.map((edge, index) => <line key={`${edge.from.id}-${edge.to.id}-${index}`} data-edge={`${edge.from.id} ${edge.to.id}`}
            x1={edge.from.point.x} y1={edge.from.point.y} x2={edge.to.point.x} y2={edge.to.point.y}
            className={edge.blocked ? styles.blocked : styles.connection} />)}
          {view.route.length > 1 && <polyline data-route={view.route.map(node => node.id).join(' ')}
            points={view.route.map(node => `${node.point.x},${node.point.y}`).join(' ')} className={styles.route} />}
          {view.nodes.map(node => {
            const origin = node.id === originNodeId
            const destination = node.id === destinationNodeId
            const role = origin && destination ? 'Origem / Destino' : origin ? 'Origem' : destination ? 'Destino' : ''
            const parts = node.name.startsWith('Corredor ') ? ['Corredor', node.name.slice(9)] : [node.name]
            return <g key={node.id} data-node-id={node.id} transform={`translate(${node.point.x} ${node.point.y})`}>
              <title>{node.name} ({node.id}){role ? ` — ${role}` : ''}</title>
              {destination && <rect x={-12} y={-12} width={24} height={24} rx={3} className={styles.destination} />}
              <circle r={origin ? 9 : 6} className={origin ? styles.origin : styles.node} />
              <text textAnchor="middle" y={36} className={styles.label}>{parts.map((part, index) => <tspan key={part} x={0} dy={index ? '1.15em' : 0}>{part}</tspan>)}</text>
              {node.name !== node.id && <text x={14} y={5} className={styles.nodeCode}>{node.id}</text>}
              {role && <text textAnchor="middle" y={-23} className={styles.marker}>{role}</text>}
            </g>
          })}
        </svg>
      </div>
      <p className={styles.legend}>● Origem · ▣ Destino · Linha vinho: percurso · Tracejado: bloqueio</p>
      <p className={styles.message} role="status">{route?.status === 'ok' && !view.route.length
        ? 'Percurso sem coordenadas ou conexões válidas para exibição.'
        : route ? messages[route.status] : 'Selecione os locais e calcule uma rota.'}</p>
      {view.missingNodeIds.length > 0 && <p role="alert">Faltam coordenadas de visualização: {view.missingNodeIds.join(', ')}.</p>}
    </div>
  )
}
