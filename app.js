const path = require("path");
const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const multer = require("multer");
const upload = multer({ dest: path.join(__dirname, "uploads") });

app.use(function (req, res, next) {
  console.log("HTTP request", req.method, req.url, req.body);
  next();
});

let imgs = {};

app.post("/api/imgs/", upload.single("picture"), function (req, res, next) {
  if (req.body.imageId in imgs){
    res.status(409).end("Image Id " + imageId + " already exists");
  }else{
    imgs[req.body.imageId] = req.file;
  }
  console.log(req.file);
  res.redirect("/");
});

app.get("/api/imgs/", function (req, res, next) {
  res.json(Object.keys(imgs));
});

app.get("/api/imgs/:imageId/profile/picture/", function (req, res, next) {
  if (!(req.params.imageId in imgs))
    res.status(404).end("Id: " + imageId + " does not exist");
  else {
    let profile = imgs[req.params.imageId];
    res.setHeader("Content-Type", profile.mimetype);
    res.sendFile(profile.path);
  }
});

app.use(express.static("static"));

const http = require("http");
const PORT = 3000;

http.createServer(app).listen(PORT, function (err) {
  if (err) console.log(err);
  else console.log("HTTP server on http://localhost:%s", PORT);
});
