const express = require("express");
const credoRoute = require("./routes/credoRoute");
const notFound = require("./middleware/notFound");
const errorHandlerMiddleware = require("./middleware/error-handler");
const PORT = process.env.PORT || 3000;
const app = express();
const mongoose = require('mongoose')

const MONGODB_URI =
  "mongodb+srv://akanmu:johnson123@nodeexpressprojects.dcrga9n.mongodb.net/CredTest?retryWrites=true&w=majority";

app.use(express.json());
app.use("/api/credo", credoRoute);
app.use(notFound);
app.use(errorHandlerMiddleware);

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
