import { expect, it } from 'vitest'
import { resolveModelUrl } from './modelUrl'

it('aceita arquivos locais e URLs HTTPS sem depender de variáveis de ambiente', () => {
  expect(resolveModelUrl('/models/bloco-a.glb', 'https://campus.example/')).toBe('https://campus.example/models/bloco-a.glb')
  expect(resolveModelUrl('models/campus.gltf', 'https://campus.example/')).toBe('https://campus.example/models/campus.gltf')
  expect(resolveModelUrl('https://assets.example/campus.glb?v=2', 'https://campus.example/')).toBe('https://assets.example/campus.glb?v=2')
  expect(resolveModelUrl('/models/campus.glb', 'http://localhost:4173/')).toBe('http://localhost:4173/models/campus.glb')
})
it.each(['http://assets.example/campus.glb', 'javascript:alert(1)', '/models/readme.html', 'https://user:secret@assets.example/campus.glb', ''])('rejeita configuração inadequada: %s', path => {
  expect(() => resolveModelUrl(path, 'https://campus.example/')).toThrow()
})
