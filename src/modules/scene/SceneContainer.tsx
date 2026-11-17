import { Component, lazy, Suspense, useId } from 'react'
import type { ReactNode } from 'react'
import type { SceneContainerProps } from './types'
import { toSpatialRoute } from '../visualization/adapters'
import styles from './SceneContainer.module.css'

const GLBViewer = lazy(() => import('./GLBViewer'))

class SceneErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    return this.state.failed
      ? <p role="alert">Não foi possível abrir o modelo 3D. Confira o arquivo e o suporte gráfico do dispositivo. O mapa esquemático continua disponível.</p>
      : this.props.children
  }
}

export default function SceneContainer({ graph, route, modelUrl, spatialPositions = {} }: SceneContainerProps) {
  const titleId = useId()
  const points = graph ? toSpatialRoute(graph, route, spatialPositions) : []

  return (
    <section className={styles.container} aria-labelledby={titleId}>
      <h2 id={titleId}>Visualização 3D</h2>
      <div className={styles.viewport} data-scene-viewport="">
        {!graph || !modelUrl ? <p role="status">{!graph
          ? 'Visualização 3D indisponível. Nenhum grafo fictício foi fornecido.'
          : 'Visualização 3D indisponível. Modelo 3D ainda não fornecido. Use o mapa esquemático.'}</p>
          : <SceneErrorBoundary key={modelUrl}>
              <Suspense fallback={<p role="status">Carregando visualização 3D…</p>}>
                <GLBViewer url={modelUrl} routePoints={points} />
              </Suspense>
            </SceneErrorBoundary>}
      </div>
      {modelUrl && route?.status === 'ok' && points.length === 0 && <p className={styles.note}>Percurso 3D indisponível: posições ainda não validadas.</p>}
    </section>
  )
}
