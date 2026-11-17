# Pesquisa
`searchLocations(locations, query)` filtra o catálogo recebido por nome ou código, ignorando maiúsculas, acentos e espaços nas pontas. Consulta vazia retorna lista vazia. Não duplica nem altera os registros. O App reutiliza `SearchField` e usa o resultado escolhido como destino (INT-01).

