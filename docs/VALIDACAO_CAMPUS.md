# Validação da integração do campus — 17/11/2026

Base: `main` em `df28ac3`, com PRs #40 e #41 incorporadas. Branch: `feat/mapa-real-campus-deploy`.

## Verificações locais

- `npm ci`: concluído com Node 22.20.0. Nenhuma dependência nova nesta integração.
- Base antes das alterações: 107 testes aprovados. Resultado final: **121 testes em 15 arquivos**, todos aprovados.
- `npm run lint`, `npm run typecheck`, `npm test` e `npm run build`: aprovados.
- TDD nas regras/integrações: testes antes da implementação. Entre os ciclos RED → GREEN, foram observadas falhas para a mensagem de rota fora do andar exibido e para a reutilização da fonte existente de medições; ambas corrigidas.
- Testes antigos de navegação preservados. Os testes do catálogo original selecionam explicitamente o modo de demonstração; nenhum caso foi removido.

## Navegador sobre o build de produção

Microsoft Edge via Playwright, em 1440×1000, 390×844 e 320×740. O último viewport também foi executado em HTTPS local com certificado de teste; não corresponde a um deploy Vercel nem a aparelho físico.

- Pesquisa por código, seleção do resultado, validação de campos e cálculo por teclado.
- Minishopping → Bloco A térreo: sequência **MS-REF → EXT-REF → A0-REF**, com aviso demonstrativo, marcadores e percurso SVG.
- Primeiro andar: **A1-C1 → A1-C2 → A1-C3**; inversão, substituição e limpeza do percurso; origem igual ao destino.
- Térreo/primeiro andar separados. Rota entre pisos retorna sem caminho. Troca de vista preserva o texto, oculta o traçado incompatível e orienta a selecionar o andar correspondente.
- Duas imagens WebP reais decodificadas no navegador, legendas e ausência de imagem verificadas. Teste automatizado adicional cobre falha de carregamento da foto.
- Zoom, ajuste, ausência de rolagem horizontal na página e rótulos visíveis sem corte, com tamanho renderizado mínimo de 12 px na vista do primeiro andar. Imagens de ambas as vistas e da galeria inspecionadas visualmente.
- Catálogo original: **E0 → C1 → C2 → S101** continua funcionando.
- Sem erros de página/console no fluxo normal, sem conteúdo HTTP no teste HTTPS e sem download do visualizador/arquivo 3D na navegação padrão.
- URL de GLB inexistente injetada somente na resposta servida ao navegador para testar o carregador real do primeiro andar: erro tratado, retorno ao mapa e cálculo preservados. Nenhum modelo foi criado ou adicionado ao build.

## Limites

O build conserva o aviso do chunk 3D de aproximadamente 989 KB (261 KB gzip), carregado sob demanda. Há avisos herdados nas dependências de desenvolvimento, descritos em [PENDENCIAS.md](PENDENCIAS.md). A CI do GitHub deve ser conferida no commit da PR.

Configuração estática Vite/`dist`, Node 22 e caminhos dos assets verificados localmente. Nenhum deploy ou merge executado. Não foi validada caminhada 3D, precisão espacial, circulação real, ligação vertical ou desempenho em dispositivo físico. Fontes e levantamento pendente: [REFERENCIAS_CAMPUS.md](REFERENCIAS_CAMPUS.md).
