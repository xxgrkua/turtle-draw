import session from "express-session";

type Config = {
  database_url: string;
  database_name: string;
  port: number;
  store: session.Store;
};

export default Config;
