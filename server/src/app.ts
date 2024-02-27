import compression from "compression";
import express from "express";
import rateLimit, {
  type Options as rateLimitOptions,
} from "express-rate-limit";
import session, { type SessionOptions } from "express-session";
import helmet from "helmet";
import mongoose from "mongoose";
import ViteExpress from "vite-express";

import getConfig from "../../config";
import errorHandler from "./controllers/error";
import { restrictHttpMethod } from "./controllers/httpmethod";
import notFound from "./controllers/notfound";
import { ApiError, HttpError } from "./http_error";
import apiRouter from "./routes/api";

mongoose.set("strictQuery", false);

async function main() {
  const CONFIG = await getConfig();
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

  if (process.env.NODE_ENV === "production") {
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      standardHeaders: true,
      legacyHeaders: false,
      handler: (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
        options: rateLimitOptions,
      ) => {
        if (request.url.startsWith("/api/")) {
          next(
            new ApiError({
              status: options.statusCode,
              message: String(options.message),
            }),
          );
        } else {
          next(
            new HttpError({
              status: options.statusCode,
              message: String(options.message),
            }),
          );
        }
      },
    });

    app.use(limiter);
  }

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
    rolling: true,
    cookie: {
      secure: false,
      httpOnly: true,
      path: "/",
      sameSite: true,
      maxAge: 14 * 24 * 60 * 60 * 1000,
    },
  };

  if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
    if (sess.cookie) {
      sess.cookie.secure = true;
    }
  }

  app.use(session(sess));

  app.use("/api", apiRouter);

  app.use(notFound);
  app.use(errorHandler);

  await mongoose.connect(CONFIG.database_url, { dbName: CONFIG.database_name });

  ViteExpress.listen(app, CONFIG.port, () => {
    console.log(`Server is listening on port ${CONFIG.port}...`);
  });
}

main().catch((error) => {
  console.log(error);
});
