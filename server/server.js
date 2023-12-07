const express = require("express");

const portno = 5000; // Port number to use

const app = express();

app.use(express.static("build"));

app.get("/", function (request, response) {
  response.send("Simple web server of files from " + __dirname);
});

const server = app.listen(portno, function () {
  const port = server.address().port;
  console.log(
    "Listening at http://localhost:" +
      port +
      " exporting the directory " +
      __dirname,
  );
});
