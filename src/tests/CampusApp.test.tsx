// @vitest-environment happy-dom
import { afterEach, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import App from '../App'

afterEach(cleanup)

it('pesquisa um local do campus e desenha o percurso demonstrativo externo', () => {
  const { container } = render(<App />)
  fireEvent.change(screen.getByLabelText('Origem'), { target: { value: 'ms-referencia' } })
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'A0' } })
  fireEvent.click(within(screen.getByRole('list', { name: 'Locais encontrados' })).getByRole('button', { name: /Bloco A/ }))
  fireEvent.click(screen.getByRole('button', { name: 'Calcular rota' }))
  expect(container.querySelector('[data-route]')?.getAttribute('data-route')).toBe('MS-REF MS-SAIDA EXT-REF EXT-CURVA A0-REF')
  expect(screen.getByText(/Percurso demonstrativo no passeio/)).toBeTruthy()
  expect(screen.getByText(/Nenhuma fotografia disponível para este local/)).toBeTruthy()
  expect(screen.getByRole('button', { name: 'Visualização 3D' })).toHaveProperty('disabled', true)
})

it('troca área/andar sem duplicar o primeiro andar no térreo e sem inventar ligação vertical', () => {
  const { container } = render(<App />)
  fireEvent.change(screen.getByLabelText('Área do mapa'), { target: { value: 'bloco-a' } })
  fireEvent.change(screen.getByLabelText('Andar do mapa'), { target: { value: '1' } })
  expect(container.querySelector('[data-node-id="A1-C1"]')).toBeTruthy()
  expect(screen.getByText(/Planta institucional original pendente/)).toBeTruthy()
  fireEvent.change(screen.getByLabelText('Origem'), { target: { value: 'a0-referencia' } })
  fireEvent.change(screen.getByLabelText('Destino'), { target: { value: 'a1-c1' } })
  fireEvent.click(screen.getByRole('button', { name: 'Calcular rota' }))
  expect(screen.getByText('Não há caminho disponível entre a origem e o destino.')).toBeTruthy()
  expect(container.querySelector('[data-route]')).toBeNull()
  fireEvent.change(screen.getByLabelText('Andar do mapa'), { target: { value: '0' } })
  expect(container.querySelector('[data-node-id="A1-C1"]')).toBeNull()
  expect(screen.getByText(/Planta do térreo pendente/)).toBeTruthy()
})

it('mostra fotografias reais ao selecionar a referência do primeiro andar', () => {
  render(<App />)
  fireEvent.click(screen.getByRole('button', { name: 'Ver fotos do primeiro andar' }))
  const photos = screen.getByRole('region', { name: 'Referências do local' })
  expect(within(photos).getAllByRole('img')).toHaveLength(2)
  expect(within(photos).getByText(/Primeiro andar/)).toBeTruthy()
  expect(within(photos).getByText(/Trecho exato ainda não localizado na planta/)).toBeTruthy()
  for (const image of within(photos).getAllByRole('img')) expect(image.getAttribute('loading')).toBe('lazy')
})

it('preserva a demonstração original, sem misturar seu catálogo com o campus', () => {
  render(<App />)
  fireEvent.change(screen.getByLabelText('Dados da navegação'), { target: { value: 'demo' } })
  fireEvent.change(screen.getByLabelText('Origem'), { target: { value: 'entrada' } })
  fireEvent.change(screen.getByLabelText('Destino'), { target: { value: 'sala-101' } })
  fireEvent.click(screen.getByRole('button', { name: 'Calcular rota' }))
  expect(screen.getAllByRole('listitem').map(item => item.textContent)).toEqual(['E0', 'C1', 'C2', 'S101'])
})

it('mantém a rota textual e explica quando a vista passa para outro andar', () => {
  const { container } = render(<App />)
  fireEvent.change(screen.getByLabelText('Origem'), { target: { value: 'a1-c1' } })
  fireEvent.change(screen.getByLabelText('Destino'), { target: { value: 'a1-c3' } })
  fireEvent.click(screen.getByRole('button', { name: 'Calcular rota' }))
  expect(container.querySelector('[data-route]')?.getAttribute('data-route')).toBe('A1-C1 A1-C4 A1-C3')
  expect(screen.getByRole('button', { name: 'Ver fotos de referência do percurso' })).toBeTruthy()
  fireEvent.change(screen.getByLabelText('Andar do mapa'), { target: { value: '0' } })
  expect(container.querySelector('[data-route]')).toBeNull()
  expect(screen.getByText('A rota está em outra área ou andar. Selecione a vista correspondente.')).toBeTruthy()
  expect(screen.getByRole('list', { name: 'Pontos da rota em ordem' })).toBeTruthy()
})
