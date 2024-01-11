import ViteExpress from "vite-express";
import run from "./server/server.js";

run().then(({ app, server }) => {
  ViteExpress.bind(app, server);
});
