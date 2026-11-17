# Validação — visualização e preparação para deploy

Base: `main` em `5e24815`, com a PR #40 incorporada. Branch: `feat/mvp-visualizacao-deploy`.

## Entrega

Mapa SVG com nomes/códigos, nós, conexões, origem/destino, rota, bloqueios, zoom e ajuste. A pesquisa e a seleção existentes alimentam o mesmo motor; trocar locais limpa o percurso até recalcular. `RouteResultView` mantém o resultado textual acessível.

Coordenadas esquemáticas ficam fora do grafo. `toSpatialRoute` prepara somente percursos completos com conexões válidas e posições x/y/z finitas. `SceneContainer` recebeu carregador GLB/glTF, Suspense, isolamento de erros, câmera orbital e reenquadramento. Sem modelo configurado, o modo 3D fica indisponível e o esquema funciona normalmente. Nenhum modelo foi criado.

## Evidência de TDD e comandos

- Baseline: 84 testes passaram antes das mudanças.
- RED: 7 falhas nos adaptadores/mapa; 6 na integração e estados do visualizador; 1 na resolução do caminho do modelo; 1 na identificação dos códigos dos pontos. Implementações feitas após observar as falhas.
- GREEN final: **107 testes em 12 arquivos**. Motor, catálogo, fixtures, componentes de pesquisa/seleção/resultado e CI preservados. Testes de placeholder foram atualizados para o comportamento entregue, mantendo os casos de ausência e imutabilidade.
- `npm ci`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`: passaram. A reinstalação foi feita com o preview parado, pois o Windows bloqueia a remoção de uma dependência nativa em uso.
- `npm run preview`: serviu o build de produção. Entrada → Sala 101 exibiu **E0 → C1 → C2 → S101**, custo fictício 3, sem unidade física.

## Smoke de produção

Playwright/Edge, desktop 1440×1000 e mobile 390×844/320×740: nós, arestas, pesquisa, seleção, cálculo pelo teclado, marcadores, rota visual/textual, zoom, inversão, troca de destino, limpeza e mesmo local. Sem transbordamento horizontal ou erros de console no fluxo normal. Legibilidade e enquadramento conferidos por capturas e verificações dos limites dos textos. Um corte inicial no desktop e letras pequenas no mobile foram detectados e corrigidos antes da execução final.

HTTPS local em 320×740: proxy sobre o preview com certificado de teste fora do repositório. Sem requisições HTTP misturadas à página HTTPS. Isso valida a aplicação local, não uma implantação remota ou certificado público da Vercel.

Foi injetado **somente no navegador de teste**, por interceptação do JavaScript servido, um caminho de modelo inexistente. O carregador real falhou, o contêiner apresentou erro e o usuário voltou ao mapa e calculou outra rota. Nenhum arquivo GLB falso nem configuração de teste entrou na aplicação. O fluxo normal não baixou o módulo 3D.

## Publicação e limites

- `vercel.json`: Vite, `npm ci`, `npm run build`, `dist`; Node 22 alinhado à CI. Uma página em `/`, sem necessidade de rewrite de SPA. Instruções de GitHub/Preview no README.
- Sem backend, autenticação, geolocalização ou variáveis secretas. Inspeção de nomes de arquivos e padrões comuns de credenciais sem achados; `.env*`, `.vercel`, chaves e certificados ignorados.
- Auditoria: zero alertas nas dependências de produção; 6 alertas altos herdados na cadeia de desenvolvimento por [GHSA-fc5q-39xc-vjpf](https://github.com/advisories/GHSA-fc5q-39xc-vjpf). Sem downgrade automático das ferramentas. Não são incluídas no site estático.
- Build avisa sobre o tamanho do módulo 3D (~989 kB, ~261 kB gzip), carregado sob demanda. O mapa inicial não depende desse download.
- Modelo real, materiais, enquadramento real, rota espacial, caminhada, colisões e desempenho em aparelhos físicos ainda não homologados. #24–#27/#31/#32 não são encerradas por esta entrega.
- Sem deploy e sem merge. Não há impedimento identificado para testar o esquema e preparar a publicação estática; o uso 3D real depende do arquivo e das coordenadas validadas.
