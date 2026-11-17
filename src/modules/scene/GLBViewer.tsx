import { useEffect, useMemo, useState } from 'react'
import { Canvas, useLoader, useThree } from '@react-three/fiber'
import { Box3, BufferGeometry, Line, LineBasicMaterial, PerspectiveCamera, Vector3 } from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import type { Point3D } from '../navigation/types'
import styles from './SceneContainer.module.css'
import { resolveModelUrl } from './modelUrl'

function CameraControls({ bounds, reset }: { bounds: Box3; reset: number }) {
  const { camera, gl, invalidate, size } = useThree()
  useEffect(() => {
    if (!(camera instanceof PerspectiveCamera)) return
    const center = bounds.getCenter(new Vector3())
    const radius = bounds.getSize(new Vector3()).length() / 2
    const distance = radius / Math.sin(camera.fov * Math.PI / 360) * Math.max(1, size.height / size.width) * 1.2
    // A câmera é um objeto mutável do Three.js; a atualização ocorre após o render React.
    /* oxlint-disable react/immutability */
    camera.near = Math.max(radius / 1000, .001)
    camera.far = Math.max(distance * 20, 100)
    /* oxlint-enable react/immutability */
    camera.position.copy(center).add(new Vector3(1, .8, 1).normalize().multiplyScalar(distance))
    camera.updateProjectionMatrix()
    const controls = new OrbitControls(camera, gl.domElement)
    controls.target.copy(center)
    controls.minDistance = radius * .1
    controls.maxDistance = distance * 5
    const refresh = () => invalidate()
    controls.addEventListener('change', refresh)
    controls.update()
    invalidate()
    return () => { controls.removeEventListener('change', refresh); controls.dispose() }
  }, [bounds, camera, gl, invalidate, reset, size.width, size.height])
  return null
}

function SpatialLine({ points }: { points: readonly Point3D[] }) {
  const line = useMemo(() => new Line(
    new BufferGeometry().setFromPoints(points.map(point => new Vector3(point.x, point.y, point.z))),
    new LineBasicMaterial({ color: '#97264f', depthTest: false }),
  ), [points])
  useEffect(() => () => { line.geometry.dispose(); line.material.dispose() }, [line])
  return points.length > 1 ? <primitive object={line} /> : null
}

export default function GLBViewer({ url, routePoints }: { url: string; routePoints: readonly Point3D[] }) {
  const gltf = useLoader(GLTFLoader, resolveModelUrl(url, window.location.href))
  const [reset, setReset] = useState(0)
  const bounds = useMemo(() => new Box3().setFromObject(gltf.scene), [gltf.scene])
  const extent = bounds.getSize(new Vector3()).length()
  if (bounds.isEmpty() || !Number.isFinite(extent) || extent <= 0) throw new Error('Modelo sem limites válidos')
  return <div className={styles.viewer}>
    <p role="status">Modelo carregado. Arraste para girar; use a roda do mouse ou dois dedos para aproximar.</p>
    <button type="button" onClick={() => setReset(value => value + 1)}>Reenquadrar modelo</button>
    <div className={styles.canvas}>
      <Canvas frameloop="demand" dpr={[1, 1.5]} camera={{ fov: 50 }} fallback={<p role="alert">Visualização 3D não suportada neste dispositivo. Use o mapa esquemático.</p>}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 20, 10]} intensity={2} />
        <primitive object={gltf.scene} dispose={null} />
        <CameraControls bounds={bounds} reset={reset} />
        <SpatialLine points={routePoints} />
      </Canvas>
    </div>
    <p>Visualização do arquivo fornecido. Caminhada e colisões ainda não implementadas.</p>
  </div>
}
