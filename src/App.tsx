import { LocationField } from './components/LocationField'
import { mockLocations } from './data/locations.mock'

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main-content">Ir para o conteúdo</a>
      <header className="site-header">
        <div className="brand-mark" aria-hidden="true">N</div>
        <div>
          <p className="institution">UNIMA Afya · Maceió</p>
          <h1>Navegação Indoor</h1>
        </div>
      </header>

      <main id="main-content" tabIndex={-1}>
        <div className="intro">
          <p className="eyebrow">Minishopping + parte do primeiro bloco</p>
          <p className="intro-title">Seu caminho pelo campus.</p>
          <p className="preview-label">Prévia de layout · Dados fictícios</p>
        </div>

        <div className="workspace">
          <section className="planner panel" aria-labelledby="planner-title">
            <h2 id="planner-title">Planeje seu trajeto</h2>
            <p className="section-description" id="preview-note">
              Busca, seleção e cálculo de rota ainda não estão disponíveis nesta prévia.
            </p>

            <div className="search-field">
              <label htmlFor="location-search">Pesquisar local</label>
              <input
                id="location-search"
                type="search"
                placeholder="Sala, laboratório ou outro local"
                aria-describedby="preview-note"
                disabled
              />
            </div>

            <fieldset className="route-fields" disabled aria-describedby="preview-note">
              <legend>Origem e destino</legend>
              <LocationField id="origin" label="Origem" locations={mockLocations} />
              <LocationField id="destination" label="Destino" locations={mockLocations} />
            </fieldset>

            <button className="calculate-button" type="button" disabled aria-describedby="preview-note">
              Calcular rota
            </button>
            <p className="manual-origin">A origem será escolhida manualmente.</p>

            <div className="catalog-note">
              <span className="catalog-count">{mockLocations.length.toString().padStart(2, '0')}</span>
              <p>locais de exemplo<span>Para desenvolvimento da interface</span></p>
            </div>
          </section>

          <section className="map-panel panel" aria-labelledby="map-title">
            <div className="panel-heading">
              <h2 id="map-title">Mapa / 3D</h2>
              <span className="status-label">Em preparação</span>
            </div>
            <div className="map-placeholder">
              <div className="placeholder-mark" aria-hidden="true"><span /><span /><span /></div>
              <h3>Um espaço para explorar.</h3>
              <p>Esta área receberá o mapa e a exploração 3D dos ambientes.</p>
              <span className="placeholder-caption">Sem representação do campus nesta etapa</span>
            </div>
          </section>

          <section className="route-summary panel" aria-labelledby="summary-title">
            <div>
              <p className="eyebrow">Seu trajeto</p>
              <h2 id="summary-title">Resumo da rota</h2>
            </div>
            <p>Nenhum trajeto calculado.</p>
          </section>
        </div>

        <footer className="project-note">
          Projeto acadêmico · Os locais de exemplo não representam um levantamento real da instituição.
        </footer>
      </main>
    </>
  )
}
