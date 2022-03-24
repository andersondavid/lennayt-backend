require("dotenv").config();
const app = require("express")();
const http = require("http").Server(app);
const cors = require("cors");
const serverSocket = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});
const getDataFromYT = require("./services/getDataFromYT");
const convertToMp3 = require("./services/convertMp3");
const tempStorage = require("./libs/tempStorage");
const PORT = process.env.PORT || 3001;

let socketOn = false;

app.use(cors());

app.get("/", function(req, res) {
	res.send('Rota inicial')
})

app.get("/start", function (req, res) {
  let io = serverSocket;

  if (!socketOn) {
    io.on("connection", (socket) => {
      console.log("Conectado a um frontend, client: ", socket.client.id);
      let audioList = [];

      socket.on("videourl", async (videourl) => {
        console.log("Video recebido");
       	const dataFromYT = await getDataFromYT(videourl.yturl);
       	const converterFfmpeg = await convertToMp3(dataFromYT, socket);
       	audioList.push(converterFfmpeg);
      });

      socket.on("disconnect", async () => {
        console.log("disconnect");
        if (audioList.length > 0) {
          const clearStorage = await tempStorage.delFiles(audioList);
        }
      });
    });
    socketOn = true;
  }

  res.end();
});

http.listen(PORT, function () {
  console.log(`Executando na porta ${PORT}`);
});
