// @vitest-environment happy-dom
import { afterEach, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import SceneContainer from './SceneContainer'
import App from '../../App'
import { G1 } from '../../data/graphs/fixtures'
import { visualizationConfig } from '../../config/visualization'

vi.mock('./GLBViewer', () => ({ default: ({ url }: { url: string }) => {
  if (url.includes('missing')) throw new Error('404')
  if (url.includes('pending')) throw new Promise(() => {})
  return <p>Modelo carregado.</p>
} }))
afterEach(() => { cleanup(); vi.restoreAllMocks() })

it('exibe carregamento enquanto o visualizador aguarda o arquivo', async () => {
  render(<SceneContainer graph={G1} modelUrl="/models/pending.glb" />)
  expect(await screen.findByText('Carregando visualização 3D…')).toBeTruthy()
})
it('carrega o visualizador pelo caminho configurado', async () => {
  render(<SceneContainer graph={G1} modelUrl="/models/campus.glb" />)
  expect(await screen.findByText('Modelo carregado.')).toBeTruthy()
})
it('trata erro de arquivo e mantém mapa, pesquisa e cálculo utilizáveis', async () => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
  const { container } = render(<App initialDataset="demo" visualization={{ ...visualizationConfig, modelUrl: '/models/missing.glb' }} />)
  fireEvent.click(screen.getByRole('button', { name: 'Visualização 3D' }))
  expect(await screen.findByText(/Não foi possível abrir o modelo 3D/)).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Mapa esquemático' }))
  expect(screen.getByRole('img', { name: /Mapa esquemático/ })).toBeTruthy()
  fireEvent.change(screen.getByLabelText('Origem'), { target: { value: 'entrada' } })
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: 's101' } })
  fireEvent.click(screen.getByRole('button', { name: /Sala 101/ }))
  fireEvent.click(screen.getByRole('button', { name: 'Calcular rota' }))
  expect(container.querySelector('[data-route]')?.getAttribute('data-route')).toBe('E0 C1 C2 S101')
})
