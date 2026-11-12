# Guia da equipe para o GitHub

Navegação Indoor Afya — UNIMA Afya Maceió  
Guilherme Araujo, Jose Felipe e Kaue A  
Situação conferida em 12 de novembro de 2026

## 1 Comece por aqui

Este guia explica o que está no repositório, como o trabalho foi organizado e como cada integrante pode participar. Ele serve para estudar o projeto e consultar durante o desenvolvimento. Os passos de trabalho são orientações para a equipe; o quadro de situação abaixo registra o que existe nesta data.

**O projeto já tem uma base de aplicação e um motor de rotas testado com dados fictícios. Ainda não é um aplicativo de navegação pronto para usar na faculdade.** O código está na branch `feature/fundacao-navegacao-tdd`, em revisão na PR #34. A `main` ainda contém apenas o início do histórico.

### Onde acessar

- [Repositório System indoor](https://github.com/Guilhermegg-06/System-indoor).
- [Código da etapa atual](https://github.com/Guilhermegg-06/System-indoor/tree/feature/fundacao-navegacao-tdd).
- [Quadro Kanban](https://github.com/users/Guilhermegg-06/projects/4).
- [PR #34 com a fundação do projeto](https://github.com/Guilhermegg-06/System-indoor/pull/34).

O repositório é público e o Project é privado. Conseguir abrir o código não garante acesso ao quadro. Se o Kanban não abrir, confira a conta conectada e peça ao proprietário do Project que verifique seu acesso. Não é necessário compartilhar senha ou código de autenticação.

### O que já existe e o que falta

| Situação | Conteúdo |
| --- | --- |
| Implementado na branch | Base React e TypeScript, motor de rotas, grafos fictícios, 18 testes e verificação automática. |
| Em revisão | Fundação e navegação, tarefas #11 a #18. A PR está em rascunho e ainda não foi integrada à main. |
| Próximas tarefas preparadas | #19 layout principal e #28 estrutura de dados de locais, ambas em Ready. |
| Ainda a desenvolver | Pesquisa, seleção de locais e apresentação da rota integradas à interface, exploração 3D e integração entre módulos. |
| Depende de levantamento | Fotos, medidas, texturas, mapa e modelo fiel dos ambientes. |

O MVP planejado contempla Minishopping e parte do primeiro bloco, pesquisa, origem manual, rota e exploração 3D. O 3D está previsto no MVP, mas sua implementação vem depois da fundação atual. Faculdade inteira, localização automática, QR Code e realidade aumentada ficam para avaliação futura. O protótipo no Figma simula a experiência; ele não comprova que essas funções já foram programadas.

<!-- pagebreak -->

## 2 Entenda as áreas do GitHub

| Área | Para que serve neste projeto |
| --- | --- |
| Code | Consultar arquivos e histórico. Use o seletor de branch para abrir a etapa atual enquanto ela não estiver na main. |
| Issues | Registrar trabalho, problema ou pesquisa. Cada issue tem número, descrição, critérios de aceite e classificações. |
| Projects | Ver as tarefas no Kanban e acompanhar a etapa de cada uma. O quadro reúne as mesmas issues, não cópias independentes. |
| Pull requests | Comparar mudanças com a main, discutir a solução e pedir revisão antes da integração. |
| Actions | Consultar as verificações automáticas e descobrir qual etapa falhou. |
| Settings | Administrar acesso e regras. Não altere proteções para conseguir integrar uma mudança. |

### Como ler uma tarefa

Em `DATA-01 Definir estrutura de dados de locais`, o código DATA-01 identifica a tarefa no planejamento. O número `#28` é o identificador do GitHub. São referências diferentes para a mesma issue. `EPIC` identifica uma frente maior de trabalho, com tarefas menores vinculadas como sub-issues.

Abra a issue e leia o objetivo, a relação com o épico e os critérios de aceite antes de começar. **Assignee** é o responsável, **Labels** classificam o trabalho e **Status**, no Project, mostra o andamento. Uma tarefa não ganha responsável só porque foi arrastada no Kanban.

### Labels sem complicação

As labels respondem a três perguntas: em qual área mexer, que tipo de trabalho fazer e qual prioridade considerar. Elas não executam código, não mudam o Status e não atribuem uma pessoa automaticamente.

| Família | Valores existentes e significado |
| --- | --- |
| Área | `area:frontend` interface; `area:navigation` cálculo de rotas; `area:3d` cena e exploração; `area:location` posicionamento indoor futuro; `area:data` locais, grafos e levantamento; `area:infra` configuração e automação. |
| Tipo | `type:feature` funcionalidade; `type:bug` correção de defeito; `type:chore` manutenção ou configuração; `type:research` investigação; `type:test` testes e cenários de validação. |
| Prioridade | `priority:p0` prioridade mais alta; `priority:p1` sequência importante de trabalho; `priority:p2` prioridade menor na organização atual. O número menor indica maior prioridade. |

Exemplo real: #28 usa `area:data`, `type:feature` e `priority:p1`. Isso significa uma funcionalidade ligada aos dados, com prioridade P1. Sua coluna Ready informa separadamente que ela está preparada para começar. P2 não significa automaticamente “fora do MVP”: o 3D está em P2 e faz parte do escopo planejado. Já o posicionamento automático está explicitamente fora do MVP na descrição de #7.

Para encontrar trabalho na aba Issues, use, por exemplo, `is:issue is:open label:"area:data"` ou `is:issue is:open assignee:@me`. Labels padrão do GitHub também podem aparecer; mantenha os nomes já adotados para não criar classificações duplicadas.

<!-- pagebreak -->

## 3 Use o Kanban para mostrar o andamento

O Project possui seis colunas. A interpretação abaixo é o fluxo recomendado para a equipe; mover um cartão não substitui testes, revisão ou integração de código.

| Coluna | Quando usar |
| --- | --- |
| Backlog | Trabalho identificado, ainda não preparado ou priorizado para execução. |
| Ready | Objetivo entendido, dependências verificadas e tarefa pronta para alguém assumir. |
| In Progress | Um integrante está trabalhando nela. Indique o responsável na issue. |
| Review | Mudança disponível em uma PR e aguardando avaliação. Uma PR em rascunho pode estar aqui, mas ainda exige preparação antes da aprovação final. |
| Test | Validação do comportamento da entrega, além da leitura do código. Se houver problema, volte para In Progress e registre o motivo. |
| Done | Critérios atendidos, validação registrada e, quando houver código, PR integrada à main. |

Na situação atual, #11 a #18 estão em Review; #19 e #28 estão em Ready. As demais estão em Backlog. Os épicos continuam em Backlog, mesmo com tarefas filhas em outras colunas. Não interprete a coluna do épico como resumo automático de todas as tarefas.

### Passo a passo para assumir uma tarefa

1. Abra o quadro e escolha uma tarefa em Ready conforme o combinado da equipe.
2. Leia a issue inteira e veja se depende de outra entrega. A fundação precisa estar disponível antes de criar uma interface sobre ela.
3. Defina um responsável em Assignees e mova para In Progress. Combine a divisão caso duas pessoas precisem mexer nos mesmos arquivos.
4. Trabalhe em uma branch própria, faça alterações pequenas e registre commits com descrição clara.
5. Execute as verificações e abra uma PR ligada à issue. Mova o cartão para Review.
6. Após a revisão, confira o comportamento esperado e registre a validação. Use Test enquanto essa conferência estiver em andamento.
7. Integre somente depois das condições da main serem atendidas. Confira o fechamento da issue e atualize o cartão para Done.

### Exemplo com a tarefa de layout

Na #19, primeiro combine quais partes da tela inicial serão entregues e como conferir o resultado no celular. A branch pode se chamar `feature/ui-01-layout-principal`. A PR deve mostrar o que mudou, uma evidência visual quando aplicável e quais verificações passaram. Isso é uma orientação para a próxima entrega; o layout completo ainda não foi implementado.

Se a tarefa travar, escreva na própria issue o impedimento, o que já foi tentado e o que falta. Não existe coluna Blocked no quadro atual. Evite marcar Done apenas porque o código funciona no computador de quem o escreveu. As movimentações devem ser conferidas pela equipe; não há uma automação de todo esse fluxo validada neste projeto.

<!-- pagebreak -->

## 4 Conheça o trabalho cadastrado

Há 32 issues: 10 épicos e 22 tarefas. Os números abaixo permitem localizar cada item pela busca ou substituindo o número no endereço `https://github.com/Guilhermegg-06/System-indoor/issues/28`.

| Épico | Tarefas vinculadas |
| --- | --- |
| #1 Fundação | #11 DEV-01 estrutura React e TypeScript; #12 DEV-02 lint, build e testes; #13 DEV-03 GitHub Actions; #14 DEV-04 proteção da main. |
| #2 Mapeamento físico | #32 MAP-01 fotos, medidas, texturas e modelo real. Aguardando levantamento físico da instituição. |
| #3 Ambiente 3D | #23 3D-01 preparar Three.js; #24 3D-02 cenário fictício; #25 3D-03 movimentação; #26 3D-04 colisões. |
| #4 Grafo Indoor | #15 NAV-01 nós e arestas; #16 NAV-02 grafos G1/G2/G3; #28 DATA-01 dados de locais. |
| #5 Navigation Engine | #17 NAV-03 cálculo de rota com TDD; #18 NAV-04 bloqueios e alternativas; #30 INT-02 interface ligada ao motor. |
| #6 Interface | #19 UI-01 layout; #20 UI-02 pesquisa; #21 UI-03 origem e destino; #22 UI-04 resultado da rota; #29 INT-01 pesquisa ligada a dados fictícios. |
| #7 Indoor Positioning | Pesquisa futura sobre posicionamento automático. Sem tarefas filhas cadastradas; fora do MVP atual. |
| #8 Integração 3D | #27 3D-05 rota dentro do 3D; #31 INT-03 integração do motor com a visualização 3D. |
| #9 Performance | Frente de avaliação de desempenho. Sem tarefas filhas cadastradas nesta data. |
| #10 Release MVP | Frente de preparação da entrega do MVP. Sem tarefas filhas cadastradas nesta data. |

### Como escolher a próxima entrega

Comecem pela revisão da fundação na PR #34. Depois da integração, #19 e #28 são os pontos já preparados no quadro. Pesquisa, seleção e apresentação da rota precisam conversar com o cadastro de locais e com o motor. A cena fictícia permite testar a integração 3D antes de existir o modelo real da faculdade.

Essa sequência é uma orientação baseada nas dependências, não um prazo ou uma divisão de pessoas já acordada. Não há aqui uma atribuição automática de frontend a um integrante e 3D a outro. A equipe deve combinar responsáveis conforme disponibilidade e conhecimento.

### Antes de começar a programar

Algumas issues têm critérios gerais, como registrar validação e manter as verificações passando. Detalhem os critérios específicos da tarefa antes de executá-la. Por exemplo: quais informações um local precisa ter, qual comportamento a pesquisa deve apresentar e como a tela vai informar que não existe rota. O título de uma issue, sozinho, não define toda a entrega.

<!-- pagebreak -->

## 5 Entenda o código e o motor de rotas

React organiza a interface; TypeScript descreve os tipos dos dados; Vite executa o ambiente de desenvolvimento e prepara a versão de distribuição. Vitest executa testes, Oxlint verifica problemas de código e GitHub Actions repete as verificações no servidor. Three.js e React Three Fiber ainda não foram integrados.

| Arquivo ou pasta | O que consultar |
| --- | --- |
| `README.md` | Visão geral, escopo, execução e situação da entrega. |
| `src/App.tsx` e `src/index.css` | Página inicial simples e estilo. Ainda sem pesquisa ou rota integrada. |
| `src/main.tsx` | Entrada que carrega a aplicação React. |
| `src/modules/navigation/types.ts` | Formato de nó, passagem, grafo e resultado da rota. |
| `src/modules/navigation/findRoute.ts` | Validação do grafo e cálculo do caminho de menor custo. |
| `src/data/graphs/fixtures.ts` | Grafos fictícios G1, G2 e G3 usados nos testes. |
| `src/tests/navigation.test.ts` | Cenários que verificam o motor. |
| `src/modules/search`, `locations`, `scene` e `src/components` | Pastas reservadas com orientação em README; não representam módulos já implementados. |
| `docs/TDD.md` e `docs/PENDENCIAS.md` | Evidências do processo de testes e trabalho que falta. |
| `package.json` e `package-lock.json` | Comandos, dependências e versões resolvidas para instalação reproduzível. |
| `.github/workflows/ci.yml` | Etapas executadas automaticamente. |

Um **grafo** é um conjunto de pontos e conexões. Um nó representa um ponto; uma aresta representa uma passagem. O peso é o custo dessa passagem. Atualmente as passagens são bidirecionais e os pesos são fictícios: não representam metros ou minutos.

O motor recebe grafo, origem e destino, valida os dados e usa **Dijkstra** para encontrar o menor custo somado. É equivalente a A* com heurística zero. Passagens bloqueadas ficam fora da busca. O motor não depende da interface nem de uma cena 3D, por isso pode ser testado antes dessas partes.

No G1, ir de E0 a S101 produz `E0 → C1 → C2 → S101`, custo 3. No G2, C1–C2 está bloqueado e há desvio por C3, custo 4. No G3, o bloqueio não tem desvio e o resultado é `no-path`. Esses nomes são fictícios, não salas confirmadas do campus.

Os resultados distinguem `ok` (rota), `same-location` (sem deslocamento), `no-path` (sem caminho), `invalid-location` (local inexistente) e `invalid-graph` (dados inconsistentes). Coordenadas x/y/z são opcionais; sua presença não significa que já exista uma cena 3D.

<!-- pagebreak -->

## 6 Abra o projeto e confira os testes

Instale Git, um editor de código e Node.js da linha 22, versão 22.12 ou superior nessa linha. O npm acompanha o Node. Use o terminal na pasta do projeto. Uma cópia baixada como ZIP permite consultar arquivos, mas não substitui o clone para trabalhar com branches e histórico.

### Primeira execução enquanto a fundação está em revisão

```sh
git clone https://github.com/Guilhermegg-06/System-indoor.git
cd System-indoor
git switch feature/fundacao-navegacao-tdd
npm ci
npm run dev
```

Abra no navegador o endereço mostrado pelo terminal. A tela atual é apenas a identificação inicial do projeto. Para parar o servidor, use Ctrl+C. Se a branch já tiver sido integrada e removida no futuro, use a main atualizada. Quem já possui uma cópia deve salvar seu trabalho, executar `git fetch origin --prune` e selecionar a branch atual; não precisa clonar tudo novamente.

### O que cada verificação faz

| Comando | Finalidade |
| --- | --- |
| `npm ci` | Instalar exatamente as dependências registradas no arquivo de versões. |
| `npm run lint` | Executar Oxlint e reprovar problemas ou avisos configurados. |
| `npm run typecheck` | Conferir os tipos TypeScript, com modo estrito habilitado. |
| `npm test` | Executar os testes uma vez e mostrar o resultado. |
| `npm run test:watch` | Reexecutar testes durante alterações locais. |
| `npm run build` | Conferir a compilação e gerar a pasta dist. |
| `npm run preview` | Visualizar localmente a versão gerada após o build. Não publica um site. |

### Por que existem 18 testes

O desenvolvimento do motor seguiu TDD: primeiro os testes foram executados contra uma função ainda não implementada e os 18 falharam; depois da implementação, os mesmos 18 passaram. O ciclo é escrever um teste que revele o comportamento ausente, implementar e melhorar a organização mantendo os testes passando.

Os casos incluem rota normal e inversa, destino alternativo, bloqueio com desvio, bloqueio sem saída, local isolado, origem igual ao destino, identificadores inválidos, pesos inválidos, menor custo e preservação dos dados de entrada. Parte deles é ligada aos códigos CTF da especificação; os códigos NAV adicionais são testes locais, como explica `docs/TDD.md`.

**Testes verdes validam esses cenários do motor.** Ainda não comprovam a precisão do mapa real, a qualidade do 3D, a acessibilidade ou o desempenho no celular. Depois de cada alteração relevante, execute lint, typecheck, testes e build antes de solicitar revisão.

<!-- pagebreak -->

## 7 Entregue mudanças por uma PR

Uma branch separa uma linha de trabalho. Um commit registra uma alteração nela. Push envia os commits ao GitHub. A Pull Request, ou PR, propõe integrar essa branch à principal. Merge é a integração após a revisão.

### Exemplo de trabalho depois da integração da fundação

Os comandos abaixo são um modelo para a tarefa #19. Só use a main como base da implementação quando a fundação já estiver integrada. Antes disso, priorize revisar a PR #34; uma branch dependente exige combinação específica da equipe.

```sh
git switch main
git pull --ff-only
git switch -c feature/ui-01-layout-principal
```

Faça a alteração, rode as quatro verificações da página anterior e confira `git status` e `git diff`. Adicione apenas arquivos da tarefa com `git add caminho/do/arquivo`, substituindo o caminho de exemplo pelo arquivo real. Registre um commit descritivo, como `feat: criar layout inicial mobile`, e envie com `git push -u origin feature/ui-01-layout-principal`.

No GitHub, abra a PR com base `main` e a sua branch como origem. Descreva problema, solução, validação e limitações. Use `Closes #19` somente quando a mudança realmente concluir a issue #19; para citar trabalho ainda parcial, use `Refs #19`. Uma PR em Draft é um rascunho; marque como pronta para revisão quando a entrega estiver preparada.

### Regras que estão ativas na main

- Uma aprovação de outro colaborador é obrigatória. O autor não aprova a própria PR.
- A verificação `quality` precisa passar, e a branch deve estar atualizada com a base.
- Conversas de revisão precisam estar resolvidas. Novos commits invalidam aprovações anteriores conforme a proteção configurada.
- As regras também se aplicam ao administrador. Force push e exclusão da main estão bloqueados.

Quem revisa deve ler o objetivo, olhar os arquivos alterados, executar ou conferir as validações pertinentes e verificar os critérios de aceite. Aprovar não é apenas autorizar um botão. Na entrega inicial, Felipe ou Kaue podem revisar a PR de Guilherme, conforme o acesso de colaborador.

### Como ler o resultado em Actions

Abra a execução CI e o trabalho `quality`. Ele instala dependências, roda lint, confere tipos, executa testes e faz build. Verde indica sucesso; vermelho exige abrir a etapa que falhou e ler a mensagem. Essas verificações rodam em PRs para a main e em pushes na main. Não há publicação automática do sistema configurada.

Após o merge, confirme se as issues realmente foram fechadas e atualize o Kanban. A PR atual reúne #11 a #18; elas permanecem em Review até a conclusão desse processo.

<!-- pagebreak -->

## 8 Resolva dúvidas e prepare a explicação

### Problemas comuns durante o trabalho

| Situação | O que conferir primeiro |
| --- | --- |
| Não encontro os arquivos na aba Code | A branch selecionada. Enquanto a fundação estiver em revisão, abra feature/fundacao-navegacao-tdd. |
| O quadro não abre | Conta conectada e acesso ao Project privado. Peça ao proprietário para verificar a permissão. |
| Não consigo editar ou enviar alterações | Convite de colaborador aceito e conta correta. Ver código público não concede escrita. |
| npm ou Git não é reconhecido | Instalação da ferramenta; feche e reabra o terminal. Confira a versão do Node. |
| npm ci falhou | Mensagem de erro e versão do Node. Não apague o arquivo de versões apenas para esconder o problema. |
| A PR está verde, mas não integra | Draft, aprovação de outro integrante, branch atualizada, conversas pendentes ou conflitos. |
| Surgiu conflito entre alterações | Identifique os arquivos envolvidos e combine com quem os alterou. Preserve as duas intenções e repita as verificações. |
| Mexi no código, mas nada mudou no GitHub | Salvar não envia. Confira branch, commit e push; não publique arquivos fora da tarefa. |

### Perguntas que todos devem saber responder

**O que já funciona?** O cálculo de rotas em grafos fictícios, incluindo bloqueios e tratamento de entradas inválidas, com 18 testes. A interface é inicial e os recursos de navegação ainda não estão integrados nela.

**Por que usar dados fictícios?** Para desenvolver e testar a lógica sem depender do levantamento físico. Eles não devem ser apresentados como um mapa fiel da instituição.

**O sistema sabe onde a pessoa está?** Não. A origem será escolhida manualmente no MVP. O épico de posicionamento automático é pesquisa futura.

**Como o sistema escolhe a rota?** Soma os pesos das passagens e usa Dijkstra para buscar o menor custo, desconsiderando os trechos bloqueados. Os pesos atuais não medem tempo nem distância real.

**Por que usar GitHub, Kanban e PR?** O repositório guarda código e histórico; as issues descrevem o trabalho; o Kanban mostra andamento; a PR permite revisar antes de integrar; Actions verifica automaticamente a qualidade configurada.

**Qual é o próximo passo?** Revisar e integrar a fundação. Depois, avançar no layout mobile e nos dados de locais, preparando pesquisa, rota e exploração 3D. O levantamento físico continua pendente.

### Conferência rápida de cada integrante

Antes de assumir trabalho, consiga abrir uma issue, explicar suas labels e seu Status, localizar os arquivos principais, executar os testes e descrever como abrir uma PR. Para estudar o motor, acompanhe o trajeto E0–S101 nos três grafos. Para estudar o processo, acompanhe a tarefa #28 da descrição até o resultado esperado. Esta leitura complementa a prática: todos devem conseguir reproduzir as ações com a própria conta.

As referências específicas deste guia são os arquivos da branch atual, as 32 issues, a PR #34, o Project e as regras da main. Atualizem o guia quando essas condições mudarem.
