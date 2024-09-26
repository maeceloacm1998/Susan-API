import express, { Application } from "express";
import { invoke } from "./src/routes";
import { env } from "./src/helpers/env";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";

const app: Application = express();
const port = env.PORT || 3000;

function middlewares() {
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(express.json());
}

function connectMongDb() {
  mongoose
    .connect(env.MONGODB_URI as string, {
      dbName: env.DB_NAME,
      user: env.DB_USER,
      pass: env.DB_PASS,
    })
    .then(() => {
      console.log("Mongodb connected....");
    })
    .catch((err) => console.log(err.message));

  mongoose.connection.on("connected", () => {
    console.log("Mongoose connected to db...");
  });

  mongoose.connection.on("error", (err) => {
    console.log(err.message);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("Mongoose connection is disconnected...");
  });
}

middlewares();
connectMongDb();
app.use(invoke());

app.listen(port, () => {
  console.log(`server init on this port: ${port}`);
});