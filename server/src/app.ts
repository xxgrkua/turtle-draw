import { randomBytes } from "node:crypto";

import compression from "compression";
import express from "express";
import session, { type SessionOptions } from "express-session";
import helmet from "helmet";
import mongoose from "mongoose";
import toobusy from "toobusy-js";
import ViteExpress from "vite-express";

import CONFIG from "../../config";
import errorHandler from "./controllers/error";
import notFound from "./controllers/notfound";
import HttpError from "./http_error";
import apiRouter from "./routes/api";

function isAuthenticated(
  request: express.Request,
  response: express.Response,
  next: express.NextFunction,
) {
  if (request.session.user_id && request.session.username) {
    next();
  } else {
    response.status(401).json({ res: "error", msg: "Unauthorized user" });
  }
}

const app = express();

app.use(compression());

// vite doesn't support INLINE_RUNTIME_CHUNK=false as create-react-app
// we need "wasm-unsafe-eval" to run wasm
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "script-src": ["'self'", "'unsafe-inline'", "'wasm-unsafe-eval'"],
      },
    },
  }),
);

app.use(function (request, response, next) {
  if (toobusy()) {
    next(new HttpError({ status: 503, message: "Server is too busy" }));
  } else {
    next();
  }
});

app.use("/robots.txt", function (request, response) {
  response.type("text/plain");
  response.send(
    "User-agent: *\nUser-agent: Adsbot-Google\nUser-agent: Adsbot-Google-Mobile\nUser-agent: Mediapartners-Google\nDisallow: /",
  );
});

app.use(express.json());

const sess: SessionOptions = {
  secret: randomBytes(256).toString("base64"),
  resave: false,
  saveUninitialized: false,
  store: CONFIG.store,
  cookie: {
    secure: false,
    httpOnly: true,
    path: "/",
    sameSite: true,
  },
};

if (process.env.NODE_ENV === "production") {
  // app.set("trust proxy", 1);
  if (sess.cookie) {
    sess.cookie.secure = true;
  }
}

app.use(session(sess));

app.use("/api", apiRouter);

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
app.post("/workspace", isAuthenticated, async function (request, response) {});

// delete workspace
app.delete(
  "/workspace",
  isAuthenticated,
  async function (request, response) {},
);

app.use(notFound);
app.use(errorHandler);

mongoose.set("strictQuery", false);

async function main() {
  await mongoose.connect(CONFIG.database_url);

  // Wait for model's indexes to finish.
  // Then attempts to save duplicates will correctly error.
  // ref: https://mongoosejs.com/docs/faq.html#unique-doesnt-work

  ViteExpress.listen(app, CONFIG.port, () => {
    console.log(`Server is listening on port ${CONFIG.port}...`);
  });
}

main().catch((error) => {
  console.log(error);
});
