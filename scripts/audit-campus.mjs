import { createServer } from 'vite'
import { mkdir, writeFile } from 'node:fs/promises'
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
try {
  const data = await server.ssrLoadModule('/src/data/campus.ts')
  const { auditNavigation } = await server.ssrLoadModule('/src/modules/campus/audit.ts')
  const report = auditNavigation(data.campusGraph, data.campusLocations, data.campusMetadata, data.campusDiagramPositions)
  const summary = { catalog: report.catalog.length, navigable: report.catalog.filter(place => !place.pending).length,
    pairs: report.pairs.length, demonstrative: report.pairs.filter(pair => pair.status === 'demonstrative').length,
    unavailable: report.pairs.filter(pair => pair.status === 'unavailable').length, errors: report.errors,
    simulatedTransitions: data.campusTransitions, isolatedNodes: report.isolatedNodes }
  await mkdir('docs/evidencias-mvp', { recursive: true })
  await writeFile('docs/evidencias-mvp/connectivity.json', JSON.stringify({ summary, ...report }, null, 2) + '\n')
  console.log(JSON.stringify(summary, null, 2))
  process.exitCode = report.errors.length ? 1 : 0
} finally { await server.close() }
