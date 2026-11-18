# Visualizador de modelo externo

O ponto de entrada configura o GLB e sua grade de colisão em `public/models/`. O seletor do campus fornece a área e o andar ao mesmo `SceneContainer` usado pela aplicação. O visualizador e o modelo só carregam ao abrir a vista 3D. Configurações que fornecem apenas um GLB mantêm a câmera orbital.

Na caminhada, `WalkControls` consulta duas camadas de alturas e folgas, geradas para este modelo. A altura mais próxima dentro do limite de um degrau permite passar das escadas para as galerias. As coordenadas XZ correspondem ao plano horizontal do glTF. Uma nova geometria exige nova grade e conferência das entradas.

O adaptador existente consome o resultado do motor e o contrato `spatialPositions`. O campus mantém esse contrato vazio até que a equipe meça e confira os nós e os segmentos no piso correto. As coordenadas do desenho 2D e os pesos do grafo têm referenciais próprios.

O GLTFLoader lê o arquivo autocontido com texturas incorporadas. O Canvas usa renderização sob demanda. A densidade máxima é 1,25 e pode cair para 0,65 durante a caminhada. A resolução volta ao valor de repouso ao parar.

[Instruções de uso, testes e limites da integração local](../../../INTEGRACAO-LOCAL.md)
