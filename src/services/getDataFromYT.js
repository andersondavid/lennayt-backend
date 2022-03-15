const ytdl = require('ytdl-core')

// Busca o conteudo sobre o video enviado (informacao e buffer)
module.exports = async yturl => {
  const info = await ytdl.getInfo(yturl)
  const stream = ytdl.downloadFromInfo(info, {
    quality: 'highestaudio',
    //filter: 'audioonly',
  });
  console.log('Dados e buffer carregados')
  return {
    stream,
    info
  }
}