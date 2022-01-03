const express = require("express");
const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 3000;
const multer = require("multer");
const fs = require("fs");
const { promisify } = require("util");
const axios = require("axios").default;
const unlinkAsync = promisify(fs.unlink);
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + ".jpg"); //Appending .jpg
  },
});

const upload = multer({ dest: "uploads/", storage: storage });

app.use(express.static("uploads"));
app.use(jsonParser)
app.get("/", (req, res) => {
  return res.sendFile(__dirname + "/index.html");
});
/*
app.post("/low-confidence", upload.single("file"), (req, res) => {
  console.log(req.file.path);
  io.emit("chat message", req.file.filename);
  return res.send("Your Image is being evaluated");
});
*/
app.post("/low-confidence", (req, res) => {
  console.log(req.body);
  var config = {
    method: "get",
    url: "http://localhost:1337/api/samples/"+req.body.entry.id+"?fields=cxy,publishedAt&populate=file",
    headers: {
      Authorization:
        "Bearer f47d873fd74e78bbbc0f925f5c7e5f29a4a27583b5a5ed95feb3f168624eca08a2a1dba824315944ceb13f6333b1fb8ac07691eca1fb51444728798cf38557d803b7234bd153d81ea4dec5287f3c4454b26b66cb636fea32aa0c656328dece19de6622959d06959c6911ff51e70aa183060da7892a2a0a8150f390682e9b1e76",
    },
  };

  axios(config)
    .then(function (response) {
      io.emit("chat message", response.data.data.attributes);
    })
    .catch(function (error) {
      console.log(error);
    });

  return res.send("Your Image is being evaluated");
});
io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
  socket.on("result message", async (msg) => {
    console.log(msg);
    socket.broadcast.emit("delete message", msg.image);
    // await unlinkAsync("uploads/" + msg.image);
    var w = await axios.post("http://localhost:5000/result/get/result", {
      result: msg.result,
    });
    console.log(w.data);
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
