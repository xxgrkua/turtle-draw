const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const portno = 5000; // Port number to use

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1/turtle-draw", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

function isAuthenticated(request, response, next) {
  if (request.session.user_id && request.session.username) {
    next();
  } else {
    response.status(401).json({ res: "error", msg: "Unauthorized user" });
  }
}

async function main() {
  const app = express();

  app.use(
    session({
      secret: "secret key for photo app",
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(bodyParser.json());
  app.use(express.static("build"));

  app.get("/", function (request, response) {
    response.send("Simple web server of files from " + __dirname);
  });

  app.get("/user/info", isAuthenticated, async function (request, response) {});

  app.post("/user/login", async function (request, response) {});

  app.post("/user/logout", async function (request, response) {});

  app.post("/user/register", async function (request, response) {});

  app.get("/gallery/list", async function (request, response) {});

  app.post(
    "/user/draw",
    isAuthenticated,
    async function (request, response) {},
  );

  return app;
}

main().then((app) => {
  const server = app.listen(portno, function () {
    const port = server.address().port;
    console.log(
      "Listening at http://localhost:" +
        port +
        " exporting the directory " +
        __dirname,
    );
  });
});
