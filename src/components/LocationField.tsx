import type { Location } from '../modules/locations/location.types'

interface LocationFieldProps {
  id: 'origin' | 'destination'
  label: string
  locations: readonly Location[]
  value: string
  onChange: (id: string) => void
  error?: string
}

export function LocationField({ id, label, locations, value, onChange, error }: LocationFieldProps) {
  return (
    <div className="location-field">
      <label htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={event => onChange(event.target.value)}
        aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-error` : undefined}>
        <option value="">Selecionar {label.toLocaleLowerCase('pt-BR')}</option>
        {locations.map(location => (
          <option key={location.id} value={location.id}>
            {location.name} · {location.block}
          </option>
        ))}
      </select>
      {error && <p className="field-error" id={`${id}-error`}>{error}</p>}
    </div>
  )
}
