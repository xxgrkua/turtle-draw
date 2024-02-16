import session from "express-session";

type Config = {
  database_url: string;
  database_name: string;
  port: number;
  store: session.Store;
  cookie_secret: string;
};

export default Config;
