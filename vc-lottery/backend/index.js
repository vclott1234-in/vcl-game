import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import routes from "./routes/index.route.js";

dotenv.config();

const server = express();

// middleware
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(cors());

// routes
server.use("/api", routes);

// db init
mongoose
  .connect(`${process.env.MONGO_URI}`)
  .then(() => console.log("Connected to DB successfully!"))
  .catch((err) => console.log("DB ERROR:", err));

// server start
server.listen(8080, () => {
  console.log("Server running at http://127.0.0.1:8080");
});
