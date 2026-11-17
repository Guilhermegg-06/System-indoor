// @vitest-environment happy-dom
import { afterEach, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { LocationField } from '../components/LocationField'
import { mockLocations } from '../data/locations.mock'

afterEach(cleanup)

it('recebe o valor controlado e comunica o Location.id sem manter seleção própria', () => {
  const onChange = vi.fn()
  const { rerender } = render(<LocationField id="origin" label="Origem" locations={mockLocations} value="entrada" onChange={onChange} />)
  const select = screen.getByLabelText('Origem')
  expect(select).toHaveProperty('value', 'entrada')
  fireEvent.change(select, { target: { value: 'sala-101' } })
  expect(onChange).toHaveBeenCalledWith('sala-101')
  expect(select).toHaveProperty('value', 'entrada')
  rerender(<LocationField id="origin" label="Origem" locations={mockLocations} value="sala-101" onChange={onChange} />)
  expect(select).toHaveProperty('value', 'sala-101')
})
