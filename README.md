# Navegação Indoor Afya

Projeto acadêmico de navegação pelo celular para a UNIMA Afya Maceió.

## Escopo desta entrega

Esta branch entrega somente **#28 DATA-01** (contrato e catálogo fictício de locais) e **#19 UI-01** (layout principal). A `main` estava sem arquivos na inspeção inicial; por isso, esta PR inclui uma base mínima React + TypeScript + Vite + Vitest, com Oxlint e CI.

O layout contém pesquisa, origem, destino, botão de rota, espaço para mapa/3D e resumo. **Os controles estão desativados intencionalmente.** Não há pesquisa, seleção funcional, algoritmo de rota, cena 3D, backend ou localização automática nesta entrega.

O MVP planejado abrange Minishopping e parte do primeiro bloco, incluindo exploração 3D. O restante do MVP será implementado em outras issues.

## Executar

Use Node.js 22.12 ou superior na linha 22 e npm.

```sh
npm ci
npm run dev
```

Abra o endereço informado pelo terminal. Para encerrar, use Ctrl+C.

## Verificar

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

`npm run test:watch` acompanha alterações. `npm run preview` visualiza o build localmente, sem publicar um site. O GitHub Actions executa as quatro verificações em PRs para `main` e pushes na `main`, no job `quality`.

## Organização

- `src/modules/locations/location.types.ts`: tipos `Location`, `LocationType` e `Position3D`.
- `src/data/locations.mock.ts`: seis locais fictícios; independente de React.
- `src/components/LocationField.tsx`: apresentação de origem/destino usando o contrato de locais.
- `src/App.tsx`: estrutura principal, regiões e estados indisponíveis.
- `src/index.css`: layout responsivo, com coluna única no celular.
- `src/tests`: contratos dos dados e testes do layout.
- `docs/VALIDACAO_19_28.md`: ciclo RED/GREEN, verificação e limitações.

## Contrato dos locais

`id`, `name`, `type`, `block`, `floor` e `nodeId` são obrigatórios. `code` e `position` são opcionais. `id` identifica o registro do catálogo; `nodeId` permite a ligação futura com um nó do grafo. Eles não precisam ter o mesmo valor.

Os tipos previstos são entrada, corredor, sala, laboratório, serviço, loja, banheiro, escada, elevador e outros, representados pela união `LocationType`. O andar é numérico. Os dados e suas propriedades são somente leitura no contrato TypeScript.

Os mocks usam E0, C1, C2, S101, S102 e L01, compatíveis com os IDs dos cenários fictícios planejados. Nenhum grafo ou motor foi incluído. Nomes, setores e andares são exemplos; não constituem levantamento da faculdade. Os registros não incluem coordenadas. Caso `position` seja usada nesta fase, deverá conter apenas coordenadas mock, sem unidade física validada.

## Próximas etapas

Pesquisa (#20), seleção funcional (#21), resultado da rota (#22) e integrações (#29–#31) continuam fora desta PR. Mapeamento real e 3D também ficam pendentes. A UI usa somente `Location` e mocks, sem lógica de navegação.

A PR #34 mantém uma fundação alternativa ainda em revisão. Esta entrega parte diretamente da `main` e não depende dela. Como ambas incluem arquivos de configuração, será necessário conciliar a base antes de integrar as duas; não trazer automaticamente o motor para o escopo de #19/#28.
