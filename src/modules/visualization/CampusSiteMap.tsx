import { useId, useRef, useState } from 'react'
import type { Location } from '../locations/location.types'
import type { Graph, RouteResult } from '../navigation/types'
import type { MapArea } from '../campus/types'
import type { Positions2D } from './types'
import { buildMapView } from './adapters'
import { siteWalkways } from '../../data/campusSite'
import styles from './CampusSiteMap.module.css'

interface Props {
  area: MapArea; graph: Graph; locations: readonly Location[]; positions: Positions2D
  route: RouteResult | null; originNodeId?: string; destinationNodeId?: string; notice?: string
  onLocationSelect?: (field: 'origin' | 'destination', id: string) => void
  onOpenArea?: (area: MapArea, floor: number) => void
}
const views: Record<MapArea, { box: string; title: string }> = {
  campus: { box: '0 80 1280 700', title: 'Campus · implantação geral' },
  minishopping: { box: '10 440 1160 310', title: 'Minishopping · cobertura e acessos' },
  'percurso-externo': { box: '20 100 1140 640', title: 'Percurso externo · passeio de pedestres' },
  'bloco-a': { box: '710 110 460 450', title: 'Bloco A · acesso ao térreo' },
}

export function CampusSiteMap({ area, graph, locations, positions, route, originNodeId, destinationNodeId, notice, onLocationSelect, onOpenArea }: Props) {
  const [zoom, setZoom] = useState(1)
  const [field, setField] = useState<'origin' | 'destination'>('destination')
  const drag = useRef<{ x: number; y: number; left: number; top: number } | null>(null)
  const scroll = useRef<HTMLDivElement>(null)
  const titleId = useId(), roofId = useId()
  const view = buildMapView(graph, locations, positions, route)
  const visible = locations.filter(place => view.nodes.some(node => node.id === place.nodeId) && (area !== 'minishopping' || place.nodeId === 'MS-REF'))
  const incompatible = route?.status === 'ok' && !view.route.length
  return <div className={styles.container}>
    <div className={styles.heading}><div><small>PLANTA DE IMPLANTAÇÃO · SEM ESCALA</small><h3>{views[area].title}</h3></div><span>2D</span></div>
    <div className={styles.controls} role="group" aria-label="Selecionar na planta">
      <button type="button" aria-pressed={field === 'origin'} onClick={() => setField('origin')}>Definir origem</button>
      <button type="button" aria-pressed={field === 'destination'} onClick={() => setField('destination')}>Definir destino</button>
    </div>
    <p className={styles.caption}>Selecione um acesso na planta. Os interiores não foram levantados.</p>
    <div className={styles.controls} role="group" aria-label="Ajustes do mapa">
      <button type="button" aria-label="Reduzir mapa" disabled={zoom <= 1} onClick={() => setZoom(value => Math.max(1, value - .25))}>−</button>
      <output aria-label="Zoom do mapa">{Math.round(zoom * 100)}%</output>
      <button type="button" aria-label="Ampliar mapa" disabled={zoom >= 3} onClick={() => setZoom(value => Math.min(3, value + .25))}>+</button>
      <button type="button" onClick={() => { setZoom(1); if (scroll.current) { scroll.current.scrollLeft = 0; scroll.current.scrollTop = 0 } }}>Ajustar mapa</button>
    </div>
    <div className={`${styles.viewport} ${zoom > 1 ? styles.zoomed : ''}`} ref={scroll} tabIndex={0} role="region" aria-label="Planta do campus; amplie e role para explorar"
      onPointerDown={event => {
        if (zoom <= 1 || event.pointerType !== 'mouse' || event.button !== 0 || (event.target as Element).closest('[role="button"]')) return
        drag.current = { x: event.clientX, y: event.clientY, left: event.currentTarget.scrollLeft, top: event.currentTarget.scrollTop }
        event.currentTarget.setPointerCapture(event.pointerId)
      }} onPointerMove={event => {
        if (!drag.current) return
        event.currentTarget.scrollLeft = drag.current.left + drag.current.x - event.clientX
        event.currentTarget.scrollTop = drag.current.top + drag.current.y - event.clientY
      }} onPointerUp={() => { drag.current = null }} onPointerCancel={() => { drag.current = null }}>
      <svg viewBox={views[area].box} style={{ width: `${zoom * 100}%` }} role="group" aria-labelledby={titleId} data-site-plan={area}>
        <title id={titleId}>{views[area].title}</title>
        <defs><pattern id={roofId} width="18" height="18" patternUnits="userSpaceOnUse"><rect width="18" height="18" fill="#e1e7eb"/><path d="M 0 0 V 18" stroke="#c3ccd2" strokeWidth="2"/></pattern></defs>
        <g aria-hidden="true">
          <rect x="0" y="80" width="1280" height="700" fill="#e8efe5" />
          <path d="M 0 750 H 1240 V 80" fill="none" stroke="#bec6ca" strokeWidth="55" />
          <path d="M 0 750 H 1240 V 80" fill="none" stroke="white" strokeWidth="2" strokeDasharray="20 20" />
          {siteWalkways.map((rect, index) => <rect key={index} {...rect} fill="#efdfc4" stroke="#d5c3a7" strokeWidth="2" data-walkway="true" />)}
          <path d="M 80 520 H 1060 V 670 H 80 Z M 40 500 H 150 V 650 H 40 Z M 1060 580 H 1120 V 710 H 1060 Z" fill={`url(#${roofId})`} stroke="#4c5e69" strokeWidth="5" data-building="minishopping" />
          <path d="M 820 190 H 1000 V 230 H 1070 V 440 H 910 V 400 H 820 Z" fill={`url(#${roofId})`} stroke="#4c5e69" strokeWidth="5" data-building="bloco-a" />
          <path d="M 170 542 H 1020 V 560 H 170 Z" fill="#f7fafc" stroke="#c3ccd2" />
          {[180, 300, 420, 540, 660, 900, 1020].map((x, i) => <g key={x}><circle cx={x} cy={i < 5 ? 430 : 120} r="22" fill="#b9cca9" /><circle cx={x - 5} cy={i < 5 ? 423 : 113} r="15" fill="#91b286" /></g>)}
          <text x="570" y="622" textAnchor="middle" className={styles.buildingLabel}>MINISHOPPING</text>
          <text x="950" y="320" textAnchor="middle" className={styles.buildingLabel}>BLOCO A</text>
          <text x="400" y="700" textAnchor="middle" className={styles.walkLabel}>PASSEIO EXTERNO</text>
          <text x="1160" y="165" className={styles.walkLabel}>ÁREA VERDE</text>
          <text x="145" y="735" className={styles.walkLabel}>ACESSO EXTERNO</text>
        </g>
        {view.route.length > 1 && <polyline data-route={view.route.map(node => node.id).join(' ')} points={view.route.map(node => `${node.point.x},${node.point.y}`).join(' ')} className={styles.route} />}
        {visible.map(place => {
          const point = positions[place.nodeId]!
          const origin = place.nodeId === originNodeId, destination = place.nodeId === destinationNodeId
          const select = () => { onLocationSelect?.(field, place.id); if (field === 'origin') setField('destination') }
          return <g key={place.id} role="button" tabIndex={0} aria-label={`${place.name} · selecionar ${field === 'origin' ? 'origem' : 'destino'}`}
            onClick={select} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); select() } }} data-node-id={place.nodeId} className={styles.point}>
            <title>{place.name}{origin ? ' — Origem' : ''}{destination ? ' — Destino' : ''}. Acesso aproximado no passeio.</title>
            <circle cx={point.x} cy={point.y} r="26" fill="transparent" />
            <circle cx={point.x} cy={point.y} r={origin || destination ? 15 : 10} fill={origin ? '#18765e' : destination ? '#97264f' : '#fff'} stroke="#97264f" strokeWidth="4" />
            <text x={point.x} y={point.y - 28} textAnchor="middle" className={styles.accessLabel}>{origin ? 'ORIGEM · ' : ''}{destination ? 'DESTINO · ' : ''}{place.nodeId === 'MS-REF' ? 'SAÍDA MINISHOPPING' : place.nodeId === 'EXT-REF' ? 'PASSEIO' : 'ENTRADA BLOCO A'}</text>
          </g>
        })}
      </svg>
    </div>
    <div className={styles.controls} aria-label="Abrir plantas">
      <button type="button" onClick={() => onOpenArea?.('campus', 0)}>Visão geral</button>
      <button type="button" onClick={() => onOpenArea?.('minishopping', 0)}>Abrir Minishopping</button>
      <button type="button" onClick={() => onOpenArea?.('percurso-externo', 0)}>Abrir percurso externo</button>
      <button type="button" onClick={() => onOpenArea?.('bloco-a', 0)}>Abrir térreo</button>
      <button type="button" onClick={() => onOpenArea?.('bloco-a', 1)}>Abrir primeiro andar</button>
    </div>
    <p className={styles.caption}>Legenda: cobertura cinza · passeio bege · área verde · percurso vinho · origem verde · destino vinho.</p>
    <p className={styles.notice} role="status">{incompatible ? 'A rota está em outra área ou andar. Selecione a vista correspondente.'
      : route?.status === 'ok' ? 'Percurso demonstrativo no passeio. A vista pode mostrar apenas um trecho; acompanhe pelas etapas da rota.'
      : route?.status === 'same-location' ? 'Origem e destino coincidem; não há deslocamento.'
      : route ? 'Rota indisponível nesta seleção. Confira o resultado e as pendências de acesso.' : 'Selecione os acessos e calcule uma rota.'}</p>
    <p className={styles.notice}>{notice}</p>
  </div>
}
