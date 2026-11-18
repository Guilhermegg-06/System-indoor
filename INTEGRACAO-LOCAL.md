# System-indoor · Integração local do campus UNIMA Afya

## Executar no computador

Extraia o ZIP em uma pasta nova. Dentro de `System-indoor`, abra o terminal. O projeto usa Node.js 22.x. A primeira instalação pode precisar de internet para baixar as dependências do projeto.

```bash
npm ci
npm run dev -- --host 127.0.0.1
```

Abra o endereço local mostrado pelo Vite, normalmente `http://127.0.0.1:5173`. Para encerrar, pressione Ctrl+C. Para testar a versão compilada, execute na mesma pasta

```bash
npm run build
npm run preview -- --host 127.0.0.1
```

Abra `http://127.0.0.1:4173` ou a porta indicada pelo terminal. O modelo, as texturas e as colisões acompanham o pacote.

## Explorar

1. Escolha **Minishopping**, **Percurso externo** ou **Bloco A** em **Área do mapa**. Para o bloco, selecione **Térreo** ou **Primeiro andar**. A vista geral também está disponível.
2. Clique em **Visualização 3D**. Na câmera orbital, arraste para girar e use a roda ou a pinça para aproximar. **Reenquadrar modelo** volta ao enquadramento da área.
3. Clique em **Explorar em primeira pessoa**. W avança, S recua e A/D deslocam a câmera para os lados. Mova o mouse para olhar. Esc libera o ponteiro. Clique de novo na cena para capturá-lo. No toque, segure uma seta para andar e arraste a cena para olhar.
4. Use **Voltar à câmera orbital** ou **Planta 2D**. Para outro ponto inicial, escolha outra área ou andar.

## Origem e geometria

A base foi o ZIP identificado pelo commit `f44c2958b882c35401d9b4c2e9a6b9e33c3fe397`. Seus 132 arquivos foram conferidos byte a byte antes da entrega. O ZIP só documenta a versão compartilhada no GitHub. A cópia independente usa o registro inicial local `3a08d0ec003d55f7660bfdd62178e501115229a2` na branch `local/integracao-blender-3d`, sem remoto configurado.

O backup fica em `../backup/Campus_Amelia_Uchoa.blend`. O Blender 4.3.2 exportou o arquivo usado pela aplicação em `public/models/Campus_Amelia_Uchoa.glb`. A geometria inclui o acesso externo, o Minishopping, os corredores, as fachadas de salas e as escadas A e B.

| Propriedade | Resultado |
|---|---|
| Escala e origem | 1 unidade = 1 m no modelo, origem da cena (0, 0, 0) |
| Orientação | Blender Z para cima. Three.js Y para cima. Um ponto (x, y, z) do Blender vira (x, z, −y) no GLB. |
| Extensão total do recorte | 90,00 × 64,40 × 14,07 m, na ordem X, Y, Z do Blender |
| Conferência após exportação | Os limites do conjunto e as posições dos 39 pontos de interesse coincidem com os originais |
| Conteúdo do GLB | 15.821.284 bytes, 147 malhas, 346.132 triângulos, 87 materiais e 31 texturas incorporadas de até 710 px |
| Referências físicas | As medidas de 34 m e 2,56 m são preliminares. Uma galeria no arquivo indica 2,48 m. A escala original foi preservada. |

O modelo documenta principalmente o **lado externo das salas**. A caminhada alcança as portas fotografadas e os vãos abertos. As salas representadas por volumes fechados e o elevador de fachada terminam na soleira. A numeração no térreo tem lacunas e duas identificações de sala 06. A correspondência de cada foto com o campus real ainda requer revisão da equipe.

## Colisões e rotas

A grade em `public/models/campus-walk.bin` ocupa cerca de 726 KiB. Ela guarda alturas transitáveis em duas camadas com células de 12,5 cm. O cálculo considera paredes, pilares, guarda-corpos, mobiliário e uma folga lateral aproximada de 20,5 cm. A câmera fica a 1,60 m do piso. Obstáculos diagonais ou muito finos podem ter uma margem conservadora. O movimento acompanha os degraus e desliza ao longo das paredes.

O motor e o adaptador espacial existentes continuam responsáveis por calcular e projetar rotas. Os nós do grafo ainda precisam ser relacionados a pontos medidos do GLB. Para habilitar a linha no chão, a equipe precisa validar também cada segmento, inclusive portas e trocas de pavimento. Até lá, o sistema apresenta o trajeto no 2D e indica a pendência no 3D quando há uma rota da vista selecionada.

## Validação

| Verificação | Resultado |
|---|---|
| Instalação, lint, tipos e build | Passaram na base e na cópia integrada. Execução final com Node 22.23.5. |
| Testes originais | 164 de 164 antes e depois. Os arquivos de teste foram preservados. |
| Pesquisa, salas e rotas 2D | As opções de origem e as 16 salas coincidiram. As rotas Minishopping → Bloco A e sala 09 → sala 16 reproduziram a sequência original. A linha SVG da segunda rota manteve os mesmos pontos. |
| Navegação no navegador | Chromium abriu o GLB nas áreas e nos dois andares. Foram exercitados WASD, rotação com mouse, Esc, órbita, reenquadramento, retorno à planta e botões de toque em tela emulada. |
| Colisões | No navegador, a câmera parou diante da parede mesmo mantendo a tecla pressionada e atravessou o acesso aberto do Bloco A. Na grade usada pelo navegador, 43 verificações cobriram corredores, duas escadas, fachadas, mesas e acessos. |
| Recursos indisponíveis | Resposta 404 do GLB exibiu uma mensagem e permitiu usar busca e rotas 2D. Com apenas a grade ausente, a órbita continuou disponível e a caminhada ficou desativada. |
| Desempenho | Em Chromium com renderização por software SwiftShader, a amostra de 40 quadros no Minishopping a 1200 × 850 teve cerca de 20 FPS medianos, p95 de 83 ms por quadro e 44 MiB de heap JavaScript. O valor de memória exclui recursos da GPU. |
| Carregamento | Na sessão de teste do percurso externo, da abertura do modo até a primeira pessoa, 1,26 s em desenvolvimento e 1,02 s no preview local com perfil novo. |
| Console e build | Nenhum erro de aplicação no uso normal testado. O Vite mantém o aviso de tamanho do pacote 3D carregado sob demanda, cerca de 264 kB em gzip. O aviso já ocorria na base. |

Os testes foram executados em um desktop Linux da sessão. Permanecem pendentes a medição no Windows e na GPU do responsável, o teste em celular físico, a confirmação de medidas e a calibração das rotas no modelo.

As capturas reais, os resultados de navegador, a auditoria de exportação, a comparação com a base e os registros dos comandos ficam em `../evidencias/`. Para repetir a suíte do projeto, execute

```bash
npm run lint
npm run typecheck
npm test
npm run build
```
