import { useState } from 'react'
import type { Location } from '../locations/location.types'
import { photosForLocation } from './selectors'
import type { CampusPhoto } from './types'

function ReferencePhoto({ photo }: { photo: CampusPhoto }) {
  const [failed, setFailed] = useState(false)
  return failed ? <p className="photo-placeholder">Fotografia indisponível.</p>
    : <a href={photo.src} target="_blank" rel="noreferrer" aria-label={`Abrir fotografia: ${photo.alt}`}>
        <img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" decoding="async" onError={() => setFailed(true)} />
      </a>
}

export function LocationReference({ location }: { location?: Location }) {
  const photos = location ? photosForLocation(location.id) : []
  return <section className="location-reference" aria-label="Referências do local">
    <h2>{location?.name ?? 'Fotografias dos locais'}</h2>
    {location && <p className="reference-caption">{location.block} · {location.floor === 1 ? 'Primeiro andar' : 'Térreo / nível externo'} · {location.code}</p>}
    {photos.length > 0 ? <>
      <p className="reference-caption">Fotos reais do grupo, confirmadas no primeiro andar. Trecho exato ainda não localizado na planta. Referência geral do pavimento, não confirmação deste ponto.</p>
      <div className="photo-grid">{photos.map(photo => <ReferencePhoto key={photo.id} photo={photo} />)}</div>
    </> : <p className="photo-placeholder">{location ? 'Nenhuma fotografia disponível para este local.' : 'Selecione um local para consultar suas fotografias.'}</p>}
  </section>
}
