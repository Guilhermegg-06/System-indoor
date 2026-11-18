/** Alturas em metros sobre o plano XZ do glTF. Zero no arquivo indica área bloqueada. */
export class WalkSurface {
  private heights: Uint8Array
  private width: number
  private height: number
  private cell: number
  private west: number
  private south: number

  constructor(buffer: ArrayBuffer) {
    const header = new DataView(buffer)
    if (header.getUint32(0) !== 0x43573031) throw new Error('Formato de colisão inválido')
    this.width = header.getUint32(4, true)
    this.height = header.getUint32(8, true)
    this.cell = header.getFloat32(12, true)
    this.west = header.getFloat32(16, true)
    this.south = header.getFloat32(20, true)
    this.heights = new Uint8Array(buffer, 24)
    if (!(this.cell > 0) || this.heights.length !== 2 * this.width * this.height) throw new Error('Grade de colisão inválida')
  }

  floor(x: number, z: number, previous: number): number | undefined {
    const col = Math.floor((x - this.west) / this.cell)
    const row = Math.floor((-z - this.south) / this.cell)
    if (col < 0 || col >= this.width || row < 0 || row >= this.height) return
    const index = row * this.width + col
    let nearest: number | undefined
    for (const offset of [0, this.width * this.height]) {
      const value = this.heights[index + offset]
      if (!value) continue
      const h = (value - 1) / 50
      if (Math.abs(previous - h) <= .225 && (nearest === undefined || Math.abs(previous - h) < Math.abs(previous - nearest))) nearest = h
    }
    return nearest
  }
}

export interface Viewpoint { x: number; z: number; floor: number; yaw: number }
export type CampusArea = 'campus' | 'percurso-externo' | 'minishopping' | 'terreo' | 'primeiro'
export const viewpoint: Record<CampusArea, Viewpoint> = {
  campus: { x: 0, z: .85, floor: .08, yaw: 0 },
  'percurso-externo': { x: -.5, z: -3.1, floor: .08, yaw: 0 },
  minishopping: { x: -16.9, z: 8.6, floor: .6, yaw: -1.64 },
  terreo: { x: -12.5, z: -22, floor: .12, yaw: -1.76 },
  primeiro: { x: 1.6, z: -34.43, floor: 3.36, yaw: -1.38 },
}
