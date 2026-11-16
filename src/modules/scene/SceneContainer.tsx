import { useId } from 'react'
import type { SceneContainerProps } from './types'
import styles from './SceneContainer.module.css'

export default function SceneContainer({ graph }: SceneContainerProps) {
  const titleId = useId()

  return (
    <section className={styles.container} aria-labelledby={titleId}>
      <h2 id={titleId}>Visualização 3D</h2>
      <div className={styles.viewport} data-scene-viewport="">
        <p role="status">
          {graph === null
            ? 'Visualização 3D indisponível. Nenhum grafo fictício foi fornecido.'
            : 'Visualização 3D indisponível nesta etapa. O visualizador ainda não foi integrado.'}
        </p>
      </div>
    </section>
  )
}
