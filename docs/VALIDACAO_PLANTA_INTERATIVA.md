# Missão 01 — Planta interativa do Bloco A

Branch: `feat/planta-interativa-bloco-a`. Base: `main` em `9b8845211e1266cce8c02cec0359f05ede38820b`, conferida no GitHub em 17/11/2026, após a integração da PR #42. A cópia antiga do Desktop não foi alterada. Nenhum `AGENTS.md` adicional foi encontrado na árvore do repositório; foram seguidas as instruções fornecidas na sessão, o README e `REFERENCIAS_CAMPUS.md`.

## Resultado

A abertura do modo Campus mostra uma planta SVG do primeiro andar, com oito salas selecionáveis (09–16), paredes, portas com abertura, corredores em anel, sanitários e pátio. A sala 09 fica na parte inferior direita; a sequência segue à esquerda, sobe, atravessa a parte superior e chega à sala 16 na lateral direita. O desenho e as posições intermediárias são aproximados para apresentação.

O clique ou Enter/Espaço nas salas preenche os campos existentes; após definir a origem, a seleção na planta avança para destino. Pesquisa, selects, inversão, limpeza da rota anterior e resultado textual continuam integrados ao mesmo estado. Zoom de 100% a 300%, rolagem, arraste com mouse quando ampliado e ajuste da planta não alteram o trajeto.

`findRoute`, contratos de resultados, grafos G1/G2/G3, catálogo da demonstração original e carregador 3D não foram alterados. As salas foram adicionadas ao catálogo e ao grafo Campus existentes, com ramais de custo unitário. O desenho consome `buildMapView`, respeita bloqueios e só desenha rotas completas com coordenadas. Pontos intermediários de desenho direcionam os ramais pela circulação até as portas; não há segundo motor de navegação.

## Verificações automatizadas

- Antes da alteração: **121 testes aprovados**, em 15 arquivos.
- Depois da alteração: **134 testes**, em 16 arquivos, incluindo os 121 anteriores e 13 novos testes de planta.
- Ambiente de validação final: Node **22.23.5**, npm **10.9.9**, mesmos arquivos de dependências da base. Nenhuma dependência nova.
- Comandos: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`.
- Integração: clique, teclado, pesquisa de sala, seleção, inversão, mudança de destino, limpeza/recalculo, zoom/ajuste e troca de andar.
- Geometria: todos os **56 pares distintos** de salas são calculados pelo motor existente; os pontos inicial e final coincidem com as portas. Os segmentos são ortogonais e suas amostras não entram em salas, pátio ou sanitários.
- Casos de falha: mesma origem/destino, sanitário sem acesso cadastrado, pisos sem ligação, passagem bloqueada, rota antiga sobre passagem bloqueada e coordenadas ausentes.
- Regressão: os percursos existentes entre circulações, a pesquisa, o exemplo externo, a galeria de fotografias e a demonstração original permanecem cobertos pelos testes anteriores.

## Roteiro para a apresentação

1. Executar `npm ci` e `npm run dev`, com Node 22. A planta do primeiro andar aparece inicialmente.
2. Clicar em **Definir origem**, **Sala 09**, **Sala 16** e **Calcular rota**. Conferir `A1-S09 → A1-C1 → A1-S16`, junto ao canto inferior direito.
3. Pesquisar **sala 14**, escolher o resultado e calcular novamente; conferir o destaque da sala e a rota pelo corredor direito/superior.
4. Inverter origem e destino; confirmar que a rota é removida até um novo cálculo.
5. Testar ampliação, arraste/rolagem e **Ajustar mapa**. O percurso deve permanecer igual.
6. Alternar para térreo: a planta do primeiro andar desaparece, enquanto o resultado textual é preservado. Voltar ao primeiro andar restaura o desenho da rota.
7. Selecionar térreo como origem e uma sala do primeiro andar como destino: **sem caminho**, pois não há ligação vertical cadastrada.
8. Alternar **Dados da navegação** para **Demonstração original** e calcular Entrada → Sala 101.

## Limitações

- A quantidade, divisão e dimensões das salas intermediárias, portas e acessos são estimativas do MVP. A sequência foi orientada pelo usuário, mas não substitui vistoria ou planta institucional.
- Os números 34 m, 2,56 m e demais referências continuam preliminares; não foram usados como escala nem como pesos das arestas. O custo do motor permanece sem unidade física e não garante a menor distância real.
- Sanitários continuam isolados no grafo. Fotografias são referências gerais do pavimento; não há marcador que afirme a posição exata de captura.
- Térreo, ligações verticais, escadas, Bloco B, modelo 3D real, GPS indoor e caminhada não foram acrescentados.
- A conferência no navegador local foi impedida pelo ambiente: o endereço local não ficou acessível ao navegador automatizado e a janela nativa disponível estava minimizada, sem ativação funcional. Os testes de integração usam happy-dom; isso não substitui conferir arraste, toque e legibilidade em navegador desktop/celular real. A lista acima é o roteiro para essa homologação.
- Nenhum merge ou deploy de produção faz parte desta entrega. A revisão da PR e o CI continuam obrigatórios antes da integração.
