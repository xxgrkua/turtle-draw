import MongoStore from "connect-mongo";
import Config from "./config";

export default {
  database_url: process.env.DATABASE_URL as string,
  database_name: process.env.DATABASE_NAME as string,
  port: Number(process.env.PORT) || 5000,
  store: new MongoStore({
    mongoUrl: process.env.DATABASE_URL as string,
    dbName: process.env.DATABASE_NAME as string,
    autoRemove: "interval",
    autoRemoveInterval: 10,
    stringify: false,
  }),
  cookie_secret: process.env.COOKIE_SECRET as string,
} as Config;
