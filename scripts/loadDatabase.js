import mongoose from "mongoose";
import User from "../schema/user";

const removePromises = [User.deleteMany({})];

mongoose.set("strictQuery", false);
mongoose
  .connect("mongodb://127.0.0.1/turtle-draw")
  .then(() => {
    Promise.all(removePromises)
      .then(() => {
        User.create({
          login_name: "ian",
          password: "weak",
          display_name: "ian",
        })
          .then(() => {})
          .catch(() => {});
      })
      .catch(() => {});
  })
  .catch(() => {});
