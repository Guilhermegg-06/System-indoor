import { useId } from 'react'
import type { RouteResult } from '../modules/navigation/types'
import styles from './RouteResultView.module.css'

export interface RouteResultViewProps {
  result?: RouteResult | null
  pointNames?: Readonly<Record<string, string>>
  campus?: boolean
}

const messages = {
  ok: 'Rota encontrada. Siga os pontos na ordem apresentada.',
  'same-location': 'A origem e o destino são o mesmo local. Não é necessário se deslocar.',
  'no-path': 'Não há caminho disponível entre a origem e o destino.',
  'invalid-location': 'A origem ou o destino informado não existe nos dados de navegação.',
  'invalid-graph': 'Os dados de navegação estão inconsistentes. Não foi possível apresentar a rota.',
} satisfies Record<RouteResult['status'], string>

export function RouteResultView({ result = null, pointNames, campus = false }: RouteResultViewProps) {
  const titleId = useId()

  return (
    <section className={styles.panel} aria-labelledby={titleId}>
      <h2 className={styles.title} id={titleId}>Resultado da rota</h2>
      <p className={styles.message} role="status" aria-live="polite" aria-atomic="true">
        {result ? messages[result.status] : 'Nenhuma rota calculada.'}
      </p>

      {result?.status === 'ok' && (
        <>
          <ol className={styles.path} aria-label="Pontos da rota em ordem">
            {result.path.map((point, index) => <li key={`${index}:${point}`}>{pointNames?.[point] ?? point}</li>)}
          </ol>
          {!campus && <p className={styles.cost}>Custo fictício: {result.cost} (sem unidade física).</p>}
        </>
      )}

      <p className={styles.notice}>
        {campus ? 'Percurso demonstrativo, sem distância métrica ou homologação física.' : 'Dados fictícios. Os pontos não representam um levantamento real da instituição.'}
      </p>
    </section>
  )
}
