import { useId } from 'react'
import styles from './SearchField.module.css'

export type SearchFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function SearchField({
  label,
  value,
  onChange,
  placeholder = 'Digite para pesquisar',
}: SearchFieldProps) {
  const inputId = useId()

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={inputId}>
        {label}
      </label>
      <div className={styles.control}>
        <input
          className={styles.input}
          id={inputId}
          type="search"
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
        {value ? (
          <button
            className={styles.clearButton}
            type="button"
            aria-label={`Limpar ${label.toLowerCase()}`}
            onClick={() => onChange('')}
          >
            Limpar
          </button>
        ) : null}
      </div>
    </div>
  )
}
