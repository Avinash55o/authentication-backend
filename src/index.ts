import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import passport from "./passport-config";
import cors from "cors";
import router from "./allROUTES";

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

const SESSION_SECRET = "146624hjgjfhgdhkjashf";
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(router);

mongoose
  .connect("mongodb://localhost:27017")
  .then(() => console.log("You are connected to the database"))
  .then(() => {
    app.listen(1234, () => console.log("Server is running on port 1234"));
  });
