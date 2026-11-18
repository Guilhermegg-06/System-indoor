import { useId, useRef, useState } from 'react'
import type { Location } from '../locations/location.types'
import type { Graph, RouteResult } from '../navigation/types'
import { buildMapView } from './adapters'
import { floorPlanEdgePoints, floorPlanRoutePoints } from './floorPlanGeometry'
import type { FloorPlan, PlanRoom, Point2D, Positions2D } from './types'
import styles from './FloorPlanMap.module.css'

interface Props {
  plan: FloorPlan
  graph: Graph
  locations: readonly Location[]
  positions: Positions2D
  route: RouteResult | null
  originNodeId?: string
  destinationNodeId?: string
  notice?: string
  onLocationSelect?: (field: 'origin' | 'destination', locationId: string) => void
}

const pointList = (points: readonly Point2D[]) => points.map(point => `${point.x},${point.y}`).join(' ')
const doorRotation = { north: 180, south: 0, east: -90, west: 90 }

function Door({ room }: { room: PlanRoom }) {
  return <g transform={`translate(${room.door.x} ${room.door.y}) rotate(${doorRotation[room.doorSide]})`} aria-hidden="true">
    <path d="M -22 0 H 22" className={styles.doorGap} />
    <path d="M -22 0 V -44 M -22 -44 A 44 44 0 0 1 22 0" className={styles.door} />
  </g>
}

export function FloorPlanMap({ plan, graph, locations, positions, route, originNodeId, destinationNodeId, notice, onLocationSelect }: Props) {
  const floor = plan.floor ?? 1
  const prefix = `A${floor}`
  const floorName = floor === 0 ? 'Térreo' : 'Primeiro andar'
  const range = floor === 0 ? '01–08' : '09–16'
  const [zoom, setZoom] = useState(1)
  const [selectionTarget, setSelectionTarget] = useState<'origin' | 'destination'>('destination')
  const viewport = useRef<HTMLDivElement>(null)
  const drag = useRef<{ x: number; y: number; left: number; top: number } | null>(null)
  const titleId = useId()
  const gridId = useId()
  const view = buildMapView(graph, locations, positions, route)
  const routePoints = floorPlanRoutePoints(view.route, plan)
  const selectedName = (id?: string) => locations.find(location => location.nodeId === id)?.name ?? 'Não definida'
  const routeMessage = route?.status === 'ok'
    ? route.path.length === 1 && graph.nodes.some(node => node.id === route.path[0]) ? 'Chegada ou saída desta etapa. Continue pela próxima vista da rota.' : view.route.length > 0 ? 'Percurso destacado pelos corredores até a porta. Siga a sequência no resultado da rota.'
      : route.path.some(id => !graph.nodes.some(node => node.id === id))
        ? 'A rota está em outra área ou andar. Selecione a vista correspondente.'
        : 'Percurso sem coordenadas ou conexões válidas para exibição.'
    : route?.status === 'same-location' ? 'Origem e destino coincidem. Não é necessário se deslocar.'
    : route?.status === 'no-path' ? 'Não há caminho disponível entre os locais selecionados.'
    : route?.status === 'invalid-location' ? 'Local inválido. Escolha um local do catálogo.'
    : route?.status === 'invalid-graph' ? 'Grafo inconsistente. Não é possível desenhar o percurso.'
    : 'Escolha a origem e o destino e clique em Calcular rota.'

  function selectRoom(room: PlanRoom) {
    onLocationSelect?.(selectionTarget, room.locationId)
    if (selectionTarget === 'origin') setSelectionTarget('destination')
  }

  function fitMap() {
    setZoom(1)
    if (viewport.current) { viewport.current.scrollLeft = 0; viewport.current.scrollTop = 0 }
  }

  return <div className={styles.container}>
    <div className={styles.heading}>
      <div><p className={styles.eyebrow}>PLANTA DO PAVIMENTO</p><h3>Bloco A <span>/ {floorName}</span></h3></div>
      <span className={styles.floorBadge}>{floor === 0 ? '00' : '01'}</span>
    </div>
    {onLocationSelect && <div className={styles.selection}>
      <div className={styles.selectionButtons} role="group" aria-label="Selecionar na planta">
        <button type="button" aria-pressed={selectionTarget === 'origin'} onClick={() => setSelectionTarget('origin')}>
          <span className={styles.originDot} aria-hidden="true" />Definir origem</button>
        <button type="button" aria-pressed={selectionTarget === 'destination'} onClick={() => setSelectionTarget('destination')}>
          <span className={styles.destinationDot} aria-hidden="true" />Definir destino</button>
      </div>
      <p>Toque em uma sala para definir {selectionTarget === 'origin' ? 'a origem' : 'o destino'}.</p>
    </div>}
    <div className={styles.toolbar} role="group" aria-label="Ajustes do mapa">
      <span className={styles.planCaption}>Salas {range} · circulação em anel</span>
      <div className={styles.zoomControls}>
        <button type="button" aria-label="Reduzir mapa" disabled={zoom <= 1} onClick={() => setZoom(value => Math.max(1, value - .25))}>−</button>
        <output aria-label="Zoom do mapa">{Math.round(zoom * 100)}%</output>
        <button type="button" aria-label="Ampliar mapa" disabled={zoom >= 3} onClick={() => setZoom(value => Math.min(3, value + .25))}>+</button>
        <button type="button" onClick={fitMap}>Ajustar mapa</button>
      </div>
    </div>
    <div className={`${styles.viewport} ${zoom > 1 ? styles.zoomed : ''}`} ref={viewport} tabIndex={0} role="region"
      aria-label="Planta interativa; amplie e role para explorar" onPointerDown={event => {
        if (zoom <= 1 || event.pointerType !== 'mouse' || event.button !== 0 || (event.target as Element).closest('[role="button"]')) return
        drag.current = { x: event.clientX, y: event.clientY, left: event.currentTarget.scrollLeft, top: event.currentTarget.scrollTop }
        event.currentTarget.setPointerCapture(event.pointerId)
      }} onPointerMove={event => {
        if (!drag.current) return
        event.currentTarget.scrollLeft = drag.current.left + drag.current.x - event.clientX
        event.currentTarget.scrollTop = drag.current.top + drag.current.y - event.clientY
      }} onPointerUp={() => { drag.current = null }} onPointerCancel={() => { drag.current = null }}>
      <svg className={styles.plan} style={{ width: `${zoom * 100}%` }} viewBox={`0 0 ${plan.width} ${plan.height}`}
        role="group" aria-labelledby={titleId} data-floor-plan={plan.id}>
        <title id={titleId}>Planta interativa do Bloco A · {floorName} · Salas {range}</title>
        <defs><pattern id={gridId} width={40} height={40} patternUnits="userSpaceOnUse">
          <path d="M 40 0 H 0 V 40" fill="none" stroke="#e9edef" strokeWidth={1} />
        </pattern></defs>
        <rect width={plan.width} height={plan.height} fill={`url(#${gridId})`} aria-hidden="true" />
        <g aria-hidden="true">
          <rect {...plan.circulation} className={styles.circulation} />
          <text x={640} y={296} textAnchor="middle" className={styles.corridorLabel}>CIRCULAÇÃO</text>
          <text x={640} y={721} textAnchor="middle" className={styles.corridorLabel}>CIRCULAÇÃO</text>
          <rect {...plan.courtyard} className={styles.courtyard} />
          <path d="M 595 330 L 665 400 M 930 330 L 860 400 M 595 670 L 665 600 M 930 670 L 860 600" className={styles.patioLines} />
          <text x={762} y={480} textAnchor="middle" className={styles.patioTitle}>PÁTIO INTERNO</text>
          <text x={762} y={514} textAnchor="middle" className={styles.patioSubtitle}>VAZIO · SEM CIRCULAÇÃO</text>
          <rect {...plan.restrooms} className={styles.restrooms} />
          <path d="M 330 500 H 575 M 410 310 V 375 H 575 M 410 690 V 625 H 575" className={styles.innerWall} />
          {[0, 1, 2].map(index => <g key={index}>
            <path d={`M ${455 + index * 40} 310 V 375 M ${455 + index * 40} 625 V 690`} className={styles.innerWall} />
            <ellipse cx={433 + index * 45} cy={342} rx={10} ry={14} className={styles.fixture} />
            <ellipse cx={433 + index * 45} cy={658} rx={10} ry={14} className={styles.fixture} />
          </g>)}
          <text x={452} y={437} textAnchor="middle" className={styles.wcLabel}>WC FEM.</text>
          <text x={452} y={580} textAnchor="middle" className={styles.wcLabel}>WC MASC.</text>
          <text x={370} y={350} textAnchor="middle" className={styles.pneLabel}>PNE</text>
          <text x={370} y={660} textAnchor="middle" className={styles.pneLabel}>PNE</text>
          <text x={126} y={890} textAnchor="middle" className={styles.orientation}>SEM ESCALA</text>
          <text x={1150} y={890} textAnchor="middle" className={styles.orientation}>BLOCO A</text>
          <text x={1150} y={916} textAnchor="middle" className={styles.orientation}>{floor === 0 ? 'TÉRREO' : '1º ANDAR'}</text>
        </g>
        {plan.rooms.filter(room => view.nodes.some(node => node.id === room.nodeId)).map(room => {
          const origin = originNodeId === room.nodeId
          const destination = destinationNodeId === room.nodeId
          const marker = origin && destination ? 'ORIGEM / DESTINO' : origin ? 'ORIGEM' : destination ? 'DESTINO' : ''
          return <g key={room.nodeId} data-node-id={room.nodeId} data-room-number={room.number}
            role={onLocationSelect ? 'button' : undefined} tabIndex={onLocationSelect ? 0 : undefined}
            aria-label={`Sala ${room.number.toString().padStart(2, '0')}${marker ? ` · ${marker.toLocaleLowerCase('pt-BR')}` : ''}`}
            aria-pressed={onLocationSelect ? (selectionTarget === 'origin' ? origin : destination) : undefined}
            className={styles.roomButton} onClick={() => selectRoom(room)} onKeyDown={event => {
              if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectRoom(room) }
            }}>
            <title>{`Sala ${room.number.toString().padStart(2, '0')}${marker ? ` — ${marker}` : ''}. Posição aproximada.`}</title>
            <rect x={room.x} y={room.y} width={room.width} height={room.height}
              className={`${styles.room} ${origin ? styles.originRoom : ''} ${destination ? styles.destinationRoom : ''}`} />
            <Door room={room} />
            <g pointerEvents="none" aria-hidden="true">
              <text x={room.x + room.width / 2} y={room.y + room.height / 2 - 20} textAnchor="middle" className={styles.roomCaption}>SALA</text>
              <text x={room.x + room.width / 2} y={room.y + room.height / 2 + 28} textAnchor="middle" className={styles.roomNumber}>{room.number.toString().padStart(2, '0')}</text>
              {marker && <text x={room.x + room.width / 2} y={room.y + room.height / 2 + 57} textAnchor="middle" className={styles.roomMarker}>{marker}</text>}
            </g>
          </g>
        })}
        <g aria-hidden="true" pointerEvents="none">
          {view.edges.filter(edge => edge.blocked).map(edge => <polyline key={`${edge.from.id}-${edge.to.id}`} data-blocked-edge={`${edge.from.id} ${edge.to.id}`}
            points={pointList(floorPlanEdgePoints(edge.from, edge.to, plan))} className={styles.blocked} />)}
          {routePoints.length > 1 && <>
            <polyline points={pointList(routePoints)} className={styles.routeHalo} />
            <polyline data-route={view.route.map(node => node.id).join(' ')} points={pointList(routePoints)} className={styles.route} />
          </>}
        </g>
        {view.nodes.filter(node => node.id.startsWith(`${prefix}-C`) || node.id === `${prefix}-WC` || node.id === `${prefix}-TRANSFER` || node.id === 'A0-ENTRADA').map(node => {
          const selected = node.id === originNodeId || node.id === destinationNodeId
          const isWc = node.id === `${prefix}-WC`
          const isTransfer = node.id === `${prefix}-TRANSFER`
          const location = locations.find(place => place.nodeId === node.id)
          const choose = () => { if (location) { onLocationSelect?.(selectionTarget, location.id); if (selectionTarget === 'origin') setSelectionTarget('destination') } }
          return <g key={node.id} data-node-id={node.id} transform={`translate(${node.point.x} ${node.point.y})`}
            role={location && (isWc || isTransfer) ? 'button' : undefined} tabIndex={location && (isWc || isTransfer) ? 0 : undefined}
            aria-label={location && (isWc || isTransfer) ? `${location.name} · acesso demonstrativo` : undefined}
            onClick={choose} onKeyDown={event => { if (location && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); choose() } }}>
            <title>{node.name}{node.id === originNodeId ? ' — Origem' : ''}{node.id === destinationNodeId ? ' — Destino' : ''}</title>
            {isWc && <><circle r={27} fill="transparent" /><circle r={12} fill="#fff" stroke="#536d85" strokeWidth={4} /><text x={-15} y={-32} className={styles.pneLabel}>ACESSO WC</text></>}
            {isTransfer && <><rect x={-15} y={-15} width={30} height={30} rx={5} fill="#fff" stroke="#97264f" strokeWidth={3} /><text x={0} y={6} textAnchor="middle" fontSize={20} fill="#97264f">↕</text><text x={0} y={-38} textAnchor="middle" fontSize={12} fill="#97264f">TROCA</text><text x={0} y={-22} textAnchor="middle" fontSize={12} fill="#97264f">SIMULADA</text></>}
            {node.id === 'A0-ENTRADA' && <><circle r={12} fill="#fff" stroke="#536d85" strokeWidth={4} /><text x={-20} y={-8} textAnchor="end" className={styles.pneLabel}>ENTRADA PROVISÓRIA</text></>}
            {selected && <circle r={20} className={node.id === originNodeId ? styles.originPoint : styles.destinationPoint} />}
          </g>
        })}
        <g aria-hidden="true" pointerEvents="none">
          {[{ id: originNodeId, label: 'O', style: styles.originPoint }, { id: destinationNodeId, label: 'D', style: styles.destinationPoint }].map(({ id, label, style }) => {
            const room = plan.rooms.find(item => item.nodeId === id)
            return room && <g key={label} transform={`translate(${room.door.x} ${room.door.y})`}>
              <circle r={22} className={style} /><text textAnchor="middle" dy={8} className={styles.pointLetter}>{label}</text>
            </g>
          })}
        </g>
      </svg>
    </div>
    <div className={styles.journey} aria-label="Locais selecionados na planta">
      <p><span className={styles.originDot} aria-hidden="true" /><span><small>ORIGEM</small>{selectedName(originNodeId)}</span></p>
      <span className={styles.journeyArrow} aria-hidden="true">→</span>
      <p><span className={styles.destinationDot} aria-hidden="true" /><span><small>DESTINO</small>{selectedName(destinationNodeId)}</span></p>
    </div>
    <div className={styles.legend} aria-label="Legenda da planta">
      <span><i className={styles.roomSwatch} />Sala</span><span><i className={styles.corridorSwatch} />Corredor</span>
      <span><i className={styles.patioSwatch} />Pátio</span><span><i className={styles.routeSwatch} />Percurso</span>
    </div>
    <p className={styles.message} role="status">{routeMessage}</p>
    {floor === 0 && <p className={styles.notice}>Planta provisória do térreo — distribuição sujeita a validação.</p>}
    <p className={styles.notice}>Rota demonstrativa, não homologada. Sanitários: chegada ao acesso coletivo pelo corredor esquerdo; entrada interna e portas separadas pendentes de vistoria.</p>
    {(originNodeId === 'A1-FOTO' || destinationNodeId === 'A1-FOTO') && <p className={styles.notice}>As fotos são referências gerais do andar e não têm posição exata marcada na planta.</p>}
    <details className={styles.details}><summary>Sobre esta planta aproximada</summary>
      <p>{notice}</p><p>Numeração em anel, iniciando no corredor inferior direito. A transição vertical marcada é simulada e não representa uma escada real. Distribuição das salas intermediárias e portas estimada para o MVP. Os custos das rotas não representam metros.</p>
    </details>
    {view.missingNodeIds.length > 0 && <p className={styles.notice} role="alert">Faltam coordenadas de visualização: {view.missingNodeIds.join(', ')}.</p>}
  </div>
}
