import development_config from "./development";
import production_config from "./production";

const CONFIG =
  process.env.NODE_ENV === "production"
    ? production_config
    : development_config;

export default CONFIG;
