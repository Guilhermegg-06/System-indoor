# Visualizador de modelo externo

`SceneContainer` mantém `graph` e `route` e acrescenta `modelUrl` e `spatialPositions` opcionais. Não calcula rotas, não importa fixtures e não altera os dados. Ausência de grafo/modelo, carregamento e falha têm mensagens acessíveis. Erros de arquivo ou WebGL ficam isolados; o usuário pode voltar ao mapa.

## Entrega do modelo pela equipe

1. Coloque o arquivo real em `public/models/`. Exemplo de caminho futuro: `public/models/campus.glb`; nenhum arquivo de exemplo foi criado.
2. Em `src/config/visualization.ts`, troque `modelUrl: null` pelo caminho `/models/campus.glb`. Para glTF, mantenha também buffers e texturas referenciados. URLs externas precisam usar HTTPS e permitir CORS.
3. Abra **Visualização 3D**. A câmera enquadra o arquivo; arraste para girar, use roda/pinça para zoom e dois dedos para deslocar. **Reenquadrar modelo** restaura a câmera. Isso não implementa caminhada ou colisões.
4. Após validar a planta e a transformação do modelo, preencha `spatialPositions` por `nodeId`, no mesmo sistema x/y/z do arquivo. Todos os nós do percurso precisam de coordenadas finitas. O adaptador devolve uma sequência completa ou nenhuma linha; não converte posições 2D nem pesos em metros.

O GLTFLoader padrão atende GLB/glTF sem decodificadores externos. Exportações com Draco, Meshopt ou texturas KTX2 exigem configuração adicional e não foram homologadas. Prefira exportação inicial sem essas compressões.

## Separação dos dados

- `schematicPositions`: coordenadas de desenho, sem escala física.
- `spatialPositions`: vazio até a validação das posições no modelo.
- `preliminaryMeasurements`: 34 m e largura típica 2,56 m do Bloco A; referências 24,14 m, 12,43 m, 2,96 m e 2,48 m sem trecho associado. Todas preliminares, sem associação ao grafo.
- Escopo físico: Minishopping e Bloco A. Bloco B excluído. O catálogo original permanece fictício.

Three.js/Fiber ficam em importação dinâmica, fora do carregamento inicial do mapa. O Canvas renderiza sob demanda e limita a densidade de pixels a 1,5. Controles são liberados ao desmontar; o modelo usa o cache do `useLoader`.

## Limites verificados

Testes de estados do contêiner usam um visualizador simulado, sem WebGL. O smoke de produção testa o mapa sem modelo e o carregador real com arquivo ausente. **Não existe modelo navegável entregue nem validação visual de um modelo real.** Enquadramento, materiais, rota espacial e desempenho precisam ser conferidos quando a equipe entregar o arquivo.

Referências: [Canvas/Fiber](https://r3f.docs.pmnd.rs/api/canvas), [GLTFLoader](https://threejs.org/docs/pages/GLTFLoader.html), [OrbitControls](https://threejs.org/docs/pages/OrbitControls.html).
