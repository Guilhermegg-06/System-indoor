import type { MapArea } from './types'

interface Props { area: MapArea; floor: number; onAreaChange: (area: MapArea) => void; onFloorChange: (floor: number) => void }
export function CampusViewControls({ area, floor, onAreaChange, onFloorChange }: Props) {
  return <div className="campus-view-controls">
    <div><label htmlFor="map-area">Área do mapa</label>
      <select id="map-area" value={area} onChange={event => onAreaChange(event.target.value as MapArea)}>
        <option value="campus">Campus · visão geral</option><option value="minishopping">Minishopping</option>
        <option value="percurso-externo">Percurso externo</option><option value="bloco-a">Bloco A</option>
      </select>
    </div>
    {area === 'bloco-a' && <div><label htmlFor="map-floor">Andar do mapa</label>
      <select id="map-floor" value={floor} onChange={event => onFloorChange(Number(event.target.value))}>
        <option value={0}>Térreo · planta pendente</option><option value={1}>Primeiro andar · planta 2D</option>
      </select>
    </div>}
  </div>
}
