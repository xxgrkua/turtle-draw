import bodyParser from "body-parser";
import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import ViteExpress from "vite-express";

import development_config from "../../config/development.js";
import production_config from "../../config/production.js";
import User from "../../schema/user.js";

let config;

function isAuthenticated(request, response, next) {
  if (request.session.user_id && request.session.username) {
    next();
  } else {
    response.status(401).json({ res: "error", msg: "Unauthorized user" });
  }
}

const app = express();

app.use("/robots.txt", function (request, response) {
  response.type("text/plain");
  response.send(
    "User-agent: *\nUser-agent: Adsbot-Google\nUser-agent: Adsbot-Google-Mobile\nUser-agent: Mediapartners-Google\nDisallow: /",
  );
});

app.use(bodyParser.json());

app.use(
  session({
    secret: "secret key for app",
    resave: false,
    saveUninitialized: false,
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
    const user = await User.findOne({
      login_name: request.body.login_name,
    }).exec();
    if (user) {
      if (request.body.password !== user.password) {
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

if (app.settings.env == "production") {
  config = production_config;
} else {
  config = development_config;
}

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
