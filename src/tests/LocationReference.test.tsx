// @vitest-environment happy-dom
import { afterEach, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { LocationReference } from '../modules/campus/LocationReference'
import { campusLocations } from '../data/campus'

afterEach(cleanup)
it('substitui uma fotografia que falhou por uma mensagem sem interromper a interface', () => {
  render(<LocationReference location={campusLocations.find(place => place.id === 'a1-foto')} />)
  fireEvent.error(screen.getAllByRole('img')[0])
  expect(screen.getByText('Fotografia indisponível.')).toBeTruthy()
  expect(screen.getAllByRole('img')).toHaveLength(1)
})
