async function getConfig() {
  if (process.env.NODE_ENV === "production") {
    return (await import("./production")).default;
  } else {
    return (await import("./development")).default;
  }
}

export default getConfig;
