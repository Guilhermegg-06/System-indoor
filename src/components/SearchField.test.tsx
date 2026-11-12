// @vitest-environment happy-dom

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import SearchField from './SearchField'

afterEach(cleanup)

describe('SearchField', () => {
  it('renders a labeled, controlled search field', () => {
    render(<SearchField label="Pesquisar local" value="Biblioteca" onChange={vi.fn()} />)

    expect(screen.getByRole('searchbox', { name: 'Pesquisar local' })).toHaveProperty('value', 'Biblioteca')
  })

  it('reports text changes through its callback', () => {
    const onChange = vi.fn()
    render(<SearchField label="Pesquisar local" value="" onChange={onChange} />)

    fireEvent.change(screen.getByRole('searchbox', { name: 'Pesquisar local' }), {
      target: { value: 'Sala 101' },
    })

    expect(onChange).toHaveBeenCalledWith('Sala 101')
  })

  it('requests clearing the text through its callback', () => {
    const onChange = vi.fn()
    render(<SearchField label="Pesquisar local" value="Sala 101" onChange={onChange} />)

    fireEvent.click(screen.getByRole('button', { name: 'Limpar pesquisar local' }))

    expect(onChange).toHaveBeenCalledWith('')
  })
})
