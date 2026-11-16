import type { Location } from '../modules/locations/location.types'

interface LocationFieldProps {
  id: 'origin' | 'destination'
  label: string
  locations: readonly Location[]
}

/** Somente apresentação: a seleção funcional pertence a uma próxima entrega. */
export function LocationField({ id, label, locations }: LocationFieldProps) {
  return (
    <div className="location-field">
      <label htmlFor={id}>{label}</label>
      <select id={id} defaultValue="" disabled>
        <option value="">Selecionar {label.toLocaleLowerCase('pt-BR')}</option>
        {locations.map(location => (
          <option key={location.id} value={location.id}>
            {location.name} · {location.block}
          </option>
        ))}
      </select>
    </div>
  )
}
