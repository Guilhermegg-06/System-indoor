# Pesquisa
Consulta ao catálogo de locais fictícios. A camada de busca fica independente da cena 3D e conversa com o grafo do motor, sem depender do mapa real da faculdade.

## Integração atual
- `catalog.ts` expõe os locais do grafo fictício G1.
- `filterLocations` aplica a busca textual por nome, descrição e código.
- `App.tsx` usa o catálogo para popular o componente de busca e mostrar o item selecionado.

