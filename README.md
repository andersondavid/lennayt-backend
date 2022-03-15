## LennaYT

Site para converter e baixar os videos do youtube em formato MP3

### - _Backend_

Este conversor possui uma rota que ai ser solicitada, iniciar um WebSocket o qual é conectador ao socket do ciente no frontend o atualizarar de acordo com o progresso.

O progresso do trabalho da api

- A conexão e envio da URL é feita pelo WebSocket
- Os dados e o buffer do video é feito pelo YTDL
- O buffer é processado pelo FFMPEG para conversão em mp3
- O mp3 é upado no Firebase
- Uma url de download é gerada e enviada ao usuario

### Tecnologias:

- FFMPEG
- YTDL
- Firebase
- Socket.IO
- NodeJS

### ToDo

- [x] Converter o video para MP3
- [x] Upar no Firebase
- [x] Diminuir o tempo de resposta
- [x] Configurar Socket.IO
- [x] Gerar download
- [x] Remover arquivos temporarios
- [ ] Configurar barra de renomear arquivo
- [ ] Manipular erros