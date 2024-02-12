import compression from "compression";
import express from "express";
import session from "express-session";
import helmet from "helmet";
import mongoose from "mongoose";
import ViteExpress from "vite-express";

import CONFIG from "../../config";
import errorHandler from "./controllers/error";
import notFound from "./controllers/notfound";
import { User } from "./models";
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
    store: CONFIG.store,
  }),
);

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
        request.session.login_name = user.login_name;

        request.session.save(function (err) {
          if (err) {
            next(err);
          }

          response.json({
            res: "success",
            _id: user._id,
            username: user.login_name,
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
