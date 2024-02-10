import compression from "compression";
import ConnectMongoDBSession from "connect-mongodb-session";
import express from "express";
import session from "express-session";
import helmet from "helmet";
import mongoose from "mongoose";
import ViteExpress from "vite-express";

import development_config from "../../config/development.js";
import production_config from "../../config/production.js";
import User from "./model/user.ts";

let config;
let store: session.Store;

const MongoDBStore = ConnectMongoDBSession(session);

function isAuthenticated(request, response, next) {
  if (request.session.user_id && request.session.username) {
    next();
  } else {
    response.status(401).json({ res: "error", msg: "Unauthorized user" });
  }
}

const app = express();

if (app.settings.env == "production") {
  config = production_config;
  store = new MongoDBStore({
    uri: config.DATABASE_URL,
    databaseName: config.DATABASE_NAME,
    collection: "sessions",
  });
} else {
  config = development_config;
  store = new session.MemoryStore();
}

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

app.use("/robots.txt", function (request, response) {
  response.type("text/plain");
  response.send(
    "User-agent: *\nUser-agent: Adsbot-Google\nUser-agent: Adsbot-Google-Mobile\nUser-agent: Mediapartners-Google\nDisallow: /",
  );
});

app.use(express.json());

app.use(
  session({
    secret: "secret key for app",
    resave: false,
    saveUninitialized: false,
    store: store,
  }),
);

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
app.post("/user/login", async function (request, response, next) {
  try {
    const { login_name, password } = request.body;
    const user = await User.findOne({
      login_name,
    }).exec();
    if (user) {
      // wrong password
      if (password !== user.password_digest) {
        throw Error(request.body.password);
      }
      request.session.regenerate(function (error) {
        if (error) {
          next(error);
        }

        request.session.user_id = user._id;
        request.session.username = user.first_name;

        request.session.save(function (err) {
          if (err) {
            next(err);
          }

          response.json({
            res: "success",
            _id: user._id,
            username: user.first_name,
          });
        });
      });
    } else {
      throw Error(request.body.login_name);
    }
  } catch (error) {
    response.status(400).json({
      res: "error",
      msg: `${request.body.login_name} doesn't exist or password is wrong`,
    });
  }
});

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

mongoose.set("strictQuery", false);
mongoose
  .connect(config.DATABASE_URL)
  .then(() => {
    ViteExpress.listen(app, config.PORT, () => {
      console.log(`Server is listening on port ${config.PORT}...`);
    });
  })
  .catch(() => {
    console.log("error to connect to database");
  });
