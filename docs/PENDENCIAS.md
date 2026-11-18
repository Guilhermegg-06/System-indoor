# Pendências

- Receber a planta institucional original do primeiro andar e a planta do térreo. A imagem redesenhada por IA não foi usada como fonte espacial. Validar salas, portas, escadas e percurso externo; nenhuma ligação entre pisos está cadastrada (#32).
- Localizar os trechos das duas fotos do primeiro andar na planta e receber fotos autorizadas do Minishopping, percurso externo e térreo. Hoje as fotos são referências gerais do pavimento.
- Receber os modelos reais do Minishopping/Bloco A e validar coordenadas, materiais, orientação e escala; Bloco B fora do MVP. Medidas auxiliares continuam sem posição atribuída; custos das rotas não são metros (#32).
- Homologar o GLB/glTF, câmera, rota espacial e desempenho em celulares físicos (#27/#31). O esquema não confirma posições reais.
- Caminhada e colisões continuam pendentes (#25/#26); nenhum cenário 3D foi modelado nesta entrega (#24).
- Revisar a integração do campus e autorizar a configuração/publicação na Vercel. Nenhum deploy ou merge automático.
- Acompanhar GHSA-fc5q-39xc-vjpf em `picomatch`, dependência transitiva das ferramentas de desenvolvimento. Auditoria atual: 6 avisos altos na cadeia de desenvolvimento e zero nas dependências de produção. Não aplicada a sugestão automática de downgrade de Vite/Vitest; versão mais recente consultada de picomatch (4.0.7) ainda consta como afetada. Build estático não inclui essas ferramentas.
- CI e viewport mobile não substituem homologação de usabilidade, acessibilidade, aparelho físico e campus.
