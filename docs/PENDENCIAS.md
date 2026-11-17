# Pendências

- Receber o modelo real do Minishopping/Bloco A e validar a planta, coordenadas, materiais e escala; Bloco B fora do MVP (#32).
- Homologar o GLB/glTF, câmera, rota espacial e desempenho em celulares físicos (#27/#31). O esquema não confirma posições reais.
- Caminhada e colisões continuam pendentes (#25/#26); nenhum cenário 3D foi modelado nesta entrega (#24).
- Revisar a PR de visualização e autorizar a configuração/publicação na Vercel. Nenhum deploy ou merge automático.
- Acompanhar GHSA-fc5q-39xc-vjpf em `picomatch`, dependência transitiva das ferramentas de desenvolvimento. Auditoria atual: 6 avisos altos na cadeia de desenvolvimento e zero nas dependências de produção. Não aplicada a sugestão automática de downgrade de Vite/Vitest; versão mais recente consultada de picomatch (4.0.7) ainda consta como afetada. Build estático não inclui essas ferramentas.
- CI e viewport mobile não substituem homologação de usabilidade, acessibilidade, aparelho físico e campus.
