const storage = require("./firebase");
const {
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} = require("firebase/storage");

const delFiles = async (audioList) => {
  console.log("Deletando arquivos temporarios");

  const audioFolder = ref(storage, "temp");

  audioList.forEach(async (audioFile) => {
    await deleteObject(ref(audioFolder, audioFile)).then((res) => console.log('Arquivo deletado'));
  });

  return;
};

const uploadFile = async (savedFileName, buffer) => {
  const audioFolder = ref(storage, "temp");
  const audioFile = ref(audioFolder, savedFileName);

  const uploadInfo = await uploadBytes(audioFile, buffer)
    .then((snapshot) => {
      console.log("upload realizado");
      return snapshot;
    })
    .catch((err) => {
      console.error(err);
      return err;
    });

  const downloadUrl = await getDownloadURL(audioFile)
    .then((fileDownloadUrl) => {
      return fileDownloadUrl;
    })
    .catch((err) => {
      console.error(err);
      return err;
    });

  const data = {
    uploadInfo,
    downloadUrl,
  };

  return data;
};

module.exports = {
  delFiles,
  uploadFile,
};
