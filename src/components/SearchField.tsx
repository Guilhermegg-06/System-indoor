import { useMemo } from 'react'

export type SearchResult = {
  id: string
  label: string
  description?: string
}

type SearchFieldProps = {
  label: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  onSubmit?: () => void
  results?: SearchResult[]
  onSelect?: (result: SearchResult) => void
}

export default function SearchField({
  label,
  placeholder = 'Buscar local',
  value,
  onChange,
  onSubmit,
  results = [],
  onSelect,
}: SearchFieldProps) {
  const filteredResults = useMemo(() => {
    const term = value.trim().toLowerCase()
    if (!term) return results.slice(0, 4)
    return results.filter((item) => {
      const haystack = `${item.label} ${item.description ?? ''}`.toLowerCase()
      return haystack.includes(term)
    })
  }, [results, value])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && onSubmit) {
      event.preventDefault()
      onSubmit()
    }
  }

  return (
    <div className="search-field">
      <label htmlFor="search-input" className="search-label">{label}</label>
      <div className="search-input-wrap">
        <input
          id="search-input"
          type="search"
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          aria-label={label}
          aria-expanded={filteredResults.length > 0}
        />

        {value ? (
          <button type="button" className="clear-button" onClick={() => onChange('')} aria-label="Limpar busca">
            Limpar
          </button>
        ) : null}
      </div>

      {filteredResults.length > 0 ? (
        <ul className="search-results" aria-live="polite">
          {filteredResults.map((item) => (
            <li key={item.id}>
              <button type="button" onClick={() => onSelect?.(item)}>
                <span>{item.label}</span>
                {item.description ? <small>{item.description}</small> : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
