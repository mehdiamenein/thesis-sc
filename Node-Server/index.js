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

app.get("/", (req, res) => {
  return res.sendFile(__dirname + "/index.html");
});

app.post("/low-confidence", upload.single("file"), (req, res) => {
  console.log(req.file.path);
  io.emit("chat message", req.file.filename);
  return res.send("Your Image is being evaluated");
});

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
  socket.on("result message", async (msg) => {
    console.log(msg);
    socket.broadcast.emit("delete message", msg.image);
    await unlinkAsync("uploads/" + msg.image);
    var w = await axios.post("http://localhost:5000/result/get/result", {
      result: msg.result,
    });
    console.log(w.data);
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
