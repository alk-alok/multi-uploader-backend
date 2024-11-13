import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
configDotenv();
import "./utils/conection.js"
import router from "./routes/index.route.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api", router);


app.listen(8001, () => {
  console.log("App is listening on port 8001");
});
