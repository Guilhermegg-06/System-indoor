import { useState } from 'react'
import SearchField, { type SearchResult } from './components/SearchField'

const catalog: SearchResult[] = [
  { id: 'E0', label: 'Entrada principal', description: 'Ponto de entrada' },
  { id: 'C1', label: 'Corredor 1', description: 'Nível principal' },
  { id: 'C2', label: 'Corredor 2', description: 'Conexão com salas' },
  { id: 'C3', label: 'Corredor 3', description: 'Desvio de rota' },
  { id: 'S101', label: 'Sala 101', description: 'Sala de aula' },
  { id: 'S102', label: 'Sala 102', description: 'Sala de aula' },
  { id: 'L01', label: 'Laboratório 01', description: 'Laboratório de informática' },
  { id: 'I01', label: 'Índex', description: 'Ponto isolado' },
]

function App() {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<SearchResult | null>(null)

  return (
    <main className="app-shell">
      <p className="eyebrow">UNIMA Afya · Projeto acadêmico</p>
      <h1>Navegação indoor</h1>
      <p>Base de desenvolvimento preparada para navegação pelo celular.</p>
      <p>O ambiente real da faculdade ainda não foi modelado. Nesta etapa, usamos dados fictícios.</p>

      <section className="search-panel">
        <SearchField
          label="Origem ou destino"
          placeholder="Buscar local"
          value={query}
          onChange={setQuery}
          onSubmit={() => {
            const match = catalog.find(item => item.label.toLowerCase() === query.trim().toLowerCase())
            if (match) setSelected(match)
          }}
          results={catalog}
          onSelect={(item) => {
            setSelected(item)
            setQuery(item.label)
          }}
        />

        {selected ? (
          <div className="selected-result">
            <strong>Selecionado:</strong> {selected.label}
            {selected.description ? <span> · {selected.description}</span> : null}
          </div>
        ) : null}
      </section>
    </main>
  )
}

export default App

