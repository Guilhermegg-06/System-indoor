# Evidências de TDD
Antes da implementação, `findRoute` lançava “Navigation Engine ainda não implementado”.
A execução RED de `npm test` apresentou **18 testes falhando**. Após implementação mínima, os mesmos **18 testes passaram**.

Rastreabilidade da especificação:
- CTF019: mesma origem e destino, sem deslocamento.
- CTF022/023/024: rota normal, retorno e caminho até L01.
- CTF026: desvio no G2.
- CTF027: local isolado I01.
- CTF028: G3 sem caminho.
- NAV-05 e NAV-07 a NAV-11 são identificadores locais adicionais (não códigos inventados da planilha): arestas reais, locais inválidos, pesos, integridade do grafo e ausência de mutação.

G1/G2/G3 são recortes fictícios suficientes para os cenários desta etapa, não cadastro da faculdade. Não implementamos pesquisa, 3D ou testes completos da aplicação.
O resultado `same-location` evita deslocamento; `invalid-location`, `no-path` e `invalid-graph` distinguem causas sem depender de mensagens da interface.

