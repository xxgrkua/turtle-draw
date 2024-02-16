import session from "express-session";
import Config from "./config";

export default {
  database_url: "mongodb://127.0.0.1/turtle-draw",
  database_name: "turtle-draw",
  port: 5000,
  store: new session.MemoryStore(),
  cookie_secret: "secret",
} as Config;
