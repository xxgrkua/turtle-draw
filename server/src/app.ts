import compression from "compression";
import express from "express";
import rateLimit, {
  type Options as rateLimitOptions,
} from "express-rate-limit";
import session, { type SessionOptions } from "express-session";
import helmet from "helmet";
import mongoose from "mongoose";
import ViteExpress from "vite-express";

import CONFIG from "../../config";
import errorHandler from "./controllers/error";
import { restrictHttpMethod } from "./controllers/httpmethod";
import notFound from "./controllers/notfound";
import HttpError from "./http_error";
import apiRouter from "./routes/api";

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

app.use(restrictHttpMethod);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
    options: rateLimitOptions,
  ) => {
    next(
      new HttpError({ status: options.statusCode, message: options.message }),
    );
  },
});

app.use(limiter);

app.use("/robots.txt", function (request, response) {
  response.type("text/plain");
  response.send(
    "User-agent: *\nUser-agent: Adsbot-Google\nUser-agent: Adsbot-Google-Mobile\nUser-agent: Mediapartners-Google\nDisallow: /",
  );
});

app.use(express.json());

const sess: SessionOptions = {
  secret: CONFIG.cookie_secret,
  resave: false,
  saveUninitialized: false,
  store: CONFIG.store,
  cookie: {
    secure: false,
    httpOnly: true,
    path: "/",
    sameSite: true,
    maxAge: 24 * 60 * 60 * 1000,
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
