const ffmpeg = require('fluent-ffmpeg')
const tempStorage = require('../libs/tempStorage');
const pathToFfmpeg = require('ffmpeg-static');

if (process.env.NODE_ENV == "development"){
  ffmpeg.setFfmpegPath(pathToFfmpeg)  
}

const renameFile = (str) => {
  str = str.substring(0, 30)
  str = str.replace(/,(?!\d)/g, "_")
  str = `${str}_${Date.now()}.mp3`
  return str
}

// Converte o buffer para mp3
module.exports = async({ stream, info }, socket) => {
  //let audioFileName = 'audio_' + Date.now() + '.mp3';
  let audioFileName = renameFile(info.videoDetails.title.substring(0, 30))
    // Conversor
  let command = ffmpeg(stream)
    //.save(pathAudioFile + audioFileName)
    .audioBitrate(192)
    .format('mp3')
    .on('start', () => {
      console.log('Conversão iniciada!');
      socket.emit('convert', {
        status: 'start'
      })
    })
    .on('end', () => {
      console.log('Conversão do audio concluido!');
      socket.emit('convert', {
        status: 'end'
      })
    })
    .on('error', (err) => {
      console.error('erro aqui na conversao', err);
      socket.emit('convert', {
        status: 'error',
        err
      })
    })

  let ffstream = command.pipe();

  let buffers = [];
  ffstream.on('data', function(buf) {
    buffers.push(buf);
  });

  ffstream.on('end', async function() {

    let outputBuffer = Buffer.concat(buffers);

    // Faz upload para o Firebase
    let uploadProcess = await tempStorage.uploadFile(audioFileName, outputBuffer)
      // Se o upload tiver sido um sucesso, sera retornado um link de download
    if (uploadProcess.downloadUrl) {
      console.log('Enviando link de download');
      socket.emit('convert', {
        status: 'complete',
        videoTitle: info.videoDetails.title,
        storageURL: uploadProcess.downloadUrl
      })
    } else if (uploadProcess.err) {
      socket.emit('convert', {
        status: 'error',
        err: uploadProcess.err
      })
    } else {
      socket.emit('convert', {
        status: 'error',
        err: 'link not found'
      })
    }
  });

  return audioFileName
}