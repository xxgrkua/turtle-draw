import ConnectMongoDBSession from "connect-mongodb-session";
import session from "express-session";
import Config from "./config";

const MongoDBStore = ConnectMongoDBSession(session);

export default {
  database_url: process.env.DATABASE_URL as string,
  database_name: process.env.DATABASE_NAME as string,
  port: Number(process.env.PORT) || 5000,
  store: new MongoDBStore({
    uri: process.env.DATABASE_URL as string,
    databaseName: process.env.DATABASE_NAME as string,
    collection: "sessions",
  }),
  cookie_secret: process.env.COOKIE_SECRET as string,
} as Config;
