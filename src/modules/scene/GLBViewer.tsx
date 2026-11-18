import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useLoader, useThree } from '@react-three/fiber'
import { Box3, BufferGeometry, Line, LineBasicMaterial, PerspectiveCamera, Vector3 } from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import type { Point3D } from '../navigation/types'
import styles from './SceneContainer.module.css'
import { resolveModelUrl } from './modelUrl'

import { viewpoint, WalkSurface } from './walkSurface'
import type { CampusArea } from './walkSurface'
import { WalkControls } from './WalkControls'
import type { WalkInput } from './WalkControls'

function CameraControls({ bounds, reset, area }: { bounds: Box3; reset: number; area?: CampusArea }) {
  const { camera, gl, invalidate, size } = useThree()
  useEffect(() => {
    if (!(camera instanceof PerspectiveCamera)) return
    const center = bounds.getCenter(new Vector3())
    const radius = bounds.getSize(new Vector3()).length() / 2
    const direction = new Vector3(1, .78, 1).normalize()
    const right = new Vector3().crossVectors(camera.up, direction).normalize()
    const up = new Vector3().crossVectors(direction, right)
    const tangent = Math.tan(camera.fov * Math.PI / 360)
    let distance = 0
    for (const x of [bounds.min.x, bounds.max.x]) {
      for (const y of [bounds.min.y, bounds.max.y]) {
        for (const z of [bounds.min.z, bounds.max.z]) {
          const corner = new Vector3(x, y, z).sub(center)
          const halfHeight = Math.max(Math.abs(corner.dot(up)), Math.abs(corner.dot(right)) * size.height / size.width)
          distance = Math.max(distance, corner.dot(direction) + halfHeight / tangent * 1.12)
        }
      }
    }
    // A câmera é um objeto mutável do Three.js; a atualização ocorre após o render React.
    /* oxlint-disable react/immutability */
    camera.near = Math.max(radius / 1000, .001)
    camera.far = Math.max(distance * 20, 100)
    /* oxlint-enable react/immutability */
    camera.position.copy(center).add(direction.multiplyScalar(distance))
    if (area && area !== 'campus') {
      const start = viewpoint[area]
      camera.position.set(start.x, start.floor + 1.65, start.z)
      center.copy(camera.position).add(new Vector3(-Math.sin(start.yaw), -.035, -Math.cos(start.yaw)).multiplyScalar(4))
    }
    camera.updateProjectionMatrix()
    const controls = new OrbitControls(camera, gl.domElement)
    controls.target.copy(center)
    controls.minDistance = .25
    controls.maxDistance = distance * 5
    const refresh = () => invalidate()
    controls.addEventListener('change', refresh)
    controls.update()
    invalidate()
    return () => { controls.removeEventListener('change', refresh); controls.dispose() }
  }, [area, bounds, camera, gl, invalidate, reset, size.width, size.height])
  return null
}

function SpatialLine({ points }: { points: readonly Point3D[] }) {
  const line = useMemo(() => new Line(
    new BufferGeometry().setFromPoints(points.map(point => new Vector3(point.x, point.y, point.z))),
    new LineBasicMaterial({ color: '#97264f' }),
  ), [points])
  useEffect(() => () => { line.geometry.dispose(); line.material.dispose() }, [line])
  return points.length > 1 ? <primitive object={line} /> : null
}

export default function GLBViewer({ url, walkUrl, area = 'campus', routePoints }: {
  url: string; walkUrl?: string; area?: CampusArea; routePoints: readonly Point3D[]
}) {
  const gltf = useLoader(GLTFLoader, resolveModelUrl(url, window.location.href))
  const [reset, setReset] = useState(0)
  const [walking, setWalking] = useState(false)
  const [surface, setSurface] = useState<WalkSurface | null>(null)
  const [walkFailed, setWalkFailed] = useState(false)
  const input = useRef<WalkInput>({ keys: new Set(), wake: () => {}, yaw: 0, pitch: 0, foot: 0 })
  const viewport = useRef<HTMLDivElement>(null)
  const start = viewpoint[area]
  useEffect(() => {
    if (!walkUrl) return
    const controller = new AbortController()
    fetch(walkUrl, { signal: controller.signal }).then(response => {
      if (!response.ok) throw new Error('Colisores indisponíveis')
      return response.arrayBuffer()
    }).then(data => {
      const grid = new WalkSurface(data)
      if (grid.floor(start.x, start.z, start.floor) === undefined) throw new Error('Entrada bloqueada')
      if (!controller.signal.aborted) setSurface(grid)
    }).catch(() => { if (!controller.signal.aborted) setWalkFailed(true) })
    return () => controller.abort()
  }, [walkUrl, start])
  const bounds = useMemo(() => new Box3().setFromObject(gltf.scene), [gltf.scene])
  const extent = bounds.getSize(new Vector3()).length()
  if (bounds.isEmpty() || !Number.isFinite(extent) || extent <= 0) throw new Error('Modelo sem limites válidos')
  function enterWalk() {
    setWalking(true)
    if (window.matchMedia('(pointer: fine)').matches) {
      viewport.current?.querySelector('canvas')?.requestPointerLock?.()?.catch(() => {})
    }
  }
  return <div className={styles.viewer}>
    <p role="status">{walking
      ? 'Use W, A, S e D para caminhar. Mova o mouse para olhar. Esc libera o mouse. No toque, arraste a cena para olhar.'
      : 'Modelo carregado. Arraste para girar e use a roda do mouse ou dois dedos para aproximar.'}</p>
    <div className={styles.toolbar}>
      {walking ? <button type="button" onClick={() => setWalking(false)}>Voltar à câmera orbital</button> : <>
        {walkUrl && <button type="button" disabled={!surface} onClick={enterWalk}>Explorar em primeira pessoa</button>}
        <button type="button" onClick={() => setReset(value => value + 1)}>Reenquadrar modelo</button>
      </>}
    </div>
    {walkUrl && !surface && <p role="status">{walkFailed ? 'Caminhada indisponível. A câmera orbital está disponível.' : 'Preparando as áreas transitáveis…'}</p>}
    <div ref={viewport} className={styles.canvas} data-mode={walking ? 'caminhada' : 'orbital'}>
      <Canvas frameloop="demand" gl={{ antialias: false, powerPreference: 'high-performance' }} dpr={[1, 1.25]} camera={{ fov: 55 }} fallback={<p role="alert">Visualização 3D não suportada neste dispositivo. Use a planta 2D.</p>}>
        <color attach="background" args={['#deebf1']} />
        <hemisphereLight args={['#fff8eb', '#bcb4a5', 2]} />
        <directionalLight position={[-16, 28, 12]} intensity={1.65} />
        <primitive object={gltf.scene} dispose={null} />
        {walking && surface ? <WalkControls surface={surface} start={start} input={input} />
          : <CameraControls bounds={bounds} reset={reset} area={walkUrl ? area : undefined} />}
        <SpatialLine points={routePoints} />
      </Canvas>
    </div>
    {walking && <div className={styles.touch} role="group" aria-label="Controles de caminhada">
      {([['KeyW', 'Avançar', '↑'], ['KeyA', 'Esquerda', '←'], ['KeyS', 'Recuar', '↓'], ['KeyD', 'Direita', '→']] as const).map(([key, label, arrow]) =>
        <button type="button" key={key} aria-label={label} onPointerDown={event => {
          event.currentTarget.setPointerCapture(event.pointerId)
          input.current.keys.add(key)
          input.current.wake()
        }} onLostPointerCapture={() => input.current.keys.delete(key)}>{arrow}</button>)}
    </div>}
  </div>
}
