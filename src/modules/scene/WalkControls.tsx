// Three.js atualiza a câmera e as referências de entrada a cada quadro, fora do estado React.
/* oxlint-disable react/immutability */
import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Euler, PerspectiveCamera } from 'three'
import type { Viewpoint, WalkSurface } from './walkSurface'

export interface WalkInput {
  keys: Set<string>
  wake: () => void
  yaw: number
  pitch: number
  foot: number
}
export function WalkControls({ surface, start, input }: { surface: WalkSurface; start: Viewpoint; input: RefObject<WalkInput> }) {
  const { camera, gl, invalidate, setDpr } = useThree()
  const quality = useRef({ slowFrames: 0, moving: false, nativeDpr: 1 })
  useEffect(() => {
    const state = input.current
    const canvas = gl.domElement
    const nativeDpr = gl.getPixelRatio()
    quality.current.nativeDpr = nativeDpr
    quality.current.slowFrames = 0
    quality.current.moving = false
    const foot = surface.floor(start.x, start.z, start.floor)
    if (foot === undefined) return
    state.foot = foot
    state.yaw = start.yaw
    state.pitch = 0
    state.wake = invalidate
    camera.position.set(start.x, foot + 1.6, start.z)
    camera.rotation.set(0, start.yaw, 0, 'YXZ')
    canvas.dataset.eye = camera.position.toArray().join(',')
    if (camera instanceof PerspectiveCamera) {
      camera.near = .05
      camera.far = 240
      camera.updateProjectionMatrix()
    }
    canvas.tabIndex = 0
    canvas.focus({ preventScroll: true })
    invalidate()
    let finger: number | null = null
    let lastX = 0, lastY = 0
    const clear = () => { state.keys.clear() }
    const lockChange = () => { if (document.pointerLockElement !== canvas) clear() }
    const look = (x: number, y: number) => {
      state.yaw -= x * .0025
      state.pitch = Math.max(-1.44, Math.min(1.44, state.pitch - y * .0025))
      camera.rotation.copy(new Euler(state.pitch, state.yaw, 0, 'YXZ'))
      invalidate()
    }
    const mouse = (event: MouseEvent) => { if (document.pointerLockElement === canvas) look(event.movementX, event.movementY) }
    const down = (event: PointerEvent) => {
      canvas.focus({ preventScroll: true })
      if (event.pointerType === 'mouse' && document.pointerLockElement !== canvas) {
        const pending = canvas.requestPointerLock?.()
        pending?.catch(() => {})
      }
      finger = event.pointerId
      lastX = event.clientX
      lastY = event.clientY
      if (document.pointerLockElement !== canvas) canvas.setPointerCapture(event.pointerId)
    }
    const move = (event: PointerEvent) => {
      if (finger !== event.pointerId || document.pointerLockElement === canvas) return
      look(event.clientX - lastX, event.clientY - lastY)
      lastX = event.clientX
      lastY = event.clientY
    }
    const up = () => { finger = null }
    const handleKey = (event: KeyboardEvent) => {
      if (event.code === 'Escape' && document.pointerLockElement === canvas) {
        document.exitPointerLock()
        clear()
        return
      }
      if (!['KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(event.code)) return
      if (event.type === 'keyup') { state.keys.delete(event.code); return }
      if (document.activeElement !== canvas && document.pointerLockElement !== canvas) return
      event.preventDefault()
      state.keys.add(event.code)
      invalidate()
    }
    canvas.addEventListener('pointerdown', down)
    canvas.addEventListener('pointermove', move)
    canvas.addEventListener('lostpointercapture', up)
    canvas.addEventListener('pointerup', up)
    canvas.addEventListener('blur', clear)
    document.addEventListener('pointerlockchange', lockChange)
    document.addEventListener('mousemove', mouse)
    document.addEventListener('visibilitychange', clear)
    window.addEventListener('blur', clear)
    window.addEventListener('keydown', handleKey)
    window.addEventListener('keyup', handleKey)
    return () => {
      canvas.removeEventListener('pointerdown', down)
      canvas.removeEventListener('pointermove', move)
      canvas.removeEventListener('lostpointercapture', up)
      canvas.removeEventListener('pointerup', up)
      canvas.removeEventListener('blur', clear)
      document.removeEventListener('pointerlockchange', lockChange)
      document.removeEventListener('mousemove', mouse)
      document.removeEventListener('visibilitychange', clear)
      window.removeEventListener('blur', clear)
      window.removeEventListener('keydown', handleKey)
      window.removeEventListener('keyup', handleKey)
      if (document.pointerLockElement === canvas) document.exitPointerLock()
      clear()
      setDpr(nativeDpr)
      state.wake = () => {}
      delete canvas.dataset.eye
    }
  }, [camera, gl, input, invalidate, setDpr, start, surface])

  useFrame((_, delta) => {
    const state = input.current
    const forward = Number(state.keys.has('KeyW')) - Number(state.keys.has('KeyS'))
    const side = Number(state.keys.has('KeyD')) - Number(state.keys.has('KeyA'))
    const magnitude = Math.hypot(forward, side)
    const detail = quality.current
    if (!magnitude) {
      if (detail.moving) {
        detail.moving = false
        setDpr(detail.nativeDpr)
      }
      return
    }
    // Amostra apenas quadros consecutivos de caminhada. O primeiro inclui o tempo ocioso.
    if (detail.moving && delta > .05) detail.slowFrames = Math.min(8, detail.slowFrames + 1)
    if (detail.slowFrames >= 4 && gl.getPixelRatio() > .66) setDpr(.65)
    detail.moving = true
    const distance = Math.min(delta, .10) * 2.65 / magnitude
    const steps = Math.max(1, Math.ceil(distance * magnitude / .045))
    const dx = (side * Math.cos(state.yaw) - forward * Math.sin(state.yaw)) * distance / steps
    const dz = (-side * Math.sin(state.yaw) - forward * Math.cos(state.yaw)) * distance / steps
    const p = camera.position
    for (let i = 0; i < steps; i++) {
      const hx = surface.floor(p.x + dx, p.z, state.foot)
      if (hx !== undefined) { p.x += dx; state.foot = hx }
      const hz = surface.floor(p.x, p.z + dz, state.foot)
      if (hz !== undefined) { p.z += dz; state.foot = hz }
    }
    p.y = state.foot + 1.6
    gl.domElement.dataset.eye = p.toArray().map(value => value.toFixed(3)).join(',')
    invalidate()
  })
  return null
}
