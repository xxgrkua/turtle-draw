import MongoStore from "connect-mongo";
import Config from "./config";

const DATABASE_URL = "mongodb://127.0.0.1/tutle-draw";
const DATABASE_NAME = "turtle-draw";

export default {
  database_url: DATABASE_URL,
  database_name: DATABASE_NAME,
  port: 5000,
  store: new MongoStore({
    mongoUrl: DATABASE_URL,
    dbName: DATABASE_NAME,
    stringify: false,
  }),
  cookie_secret: "secret",
} as Config;
