export function resolveModelUrl(path: string, base: string): string {
  const url = new URL(path, base)
  const localHttp = url.protocol === 'http:' && url.origin === new URL(base).origin
  if (!path.trim() || !/\.(glb|gltf)$/i.test(url.pathname) || url.username || url.password || (url.protocol !== 'https:' && !localHttp)) {
    throw new Error('Use um arquivo .glb/.gltf local ou uma URL HTTPS sem credenciais')
  }
  return url.href
}
