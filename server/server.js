import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const portno = 5000; // Port number to use

mongoose.set("strictQuery", false);
// mongoose.connect("mongodb://127.0.0.1/turtle-draw", {
//   useUnifiedTopology: true,
// });

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
      secret: "secret key for app",
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(bodyParser.json());
  // app.use(express.static("dist"));

  // app.get("/", function (request, response) {
  //   response.send("");
  //   // response.send("Simple web server of files from " + __dirname);
  // });

  // get other user
  app.get("/user/:userId", async function (request, response) {});

  // get user self
  app.get("/user", isAuthenticated, async function (request, response) {});

  // register user
  app.post("/user", async function (request, response) {
    console.log(request.body);
  });

  // edit user
  app.put("/user", isAuthenticated, async function (request, response) {});

  // delete user
  app.delete("/user", isAuthenticated, async function (request, response) {});

  // user login
  app.post("/user/login", async function (request, response) {});

  // user logout
  app.post(
    "/user/logout",
    isAuthenticated,
    async function (request, response) {},
  );

  // get specific file
  app.get("/file/:fileId", async function (request, response) {});

  // create file
  app.post("/file", isAuthenticated, async function (request, response) {});

  // edit file
  app.put("/file", isAuthenticated, async function (request, response) {});

  // delete file
  app.delete("/file", isAuthenticated, async function (request, response) {});

  // get workspace
  app.get("/workspace", isAuthenticated, async function (request, response) {});

  // create workspace
  app.post(
    "/workspace",
    isAuthenticated,
    async function (request, response) {},
  );

  // delete workspace
  app.delete(
    "/workspace",
    isAuthenticated,
    async function (request, response) {},
  );

  return app;
}

async function run() {
  const app = await main();
  const server = app.listen(portno, function () {
    const port = server.address().port;
    // console.log(
    //   "Listening at http://localhost:" +
    //     port +
    //     " exporting the directory " +
    //     __dirname,
    // );
  });
  return { app, server };
}

export default run;
