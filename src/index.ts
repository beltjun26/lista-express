import 'dotenv/config';
import express, { Application, Request, Response } from "express";
import { body, param, validationResult } from "express-validator";
import { botRouter } from "./routes/bot.routes";
import { AppDataSource } from "./data-source";
import { Bot } from "./entity/Bot";

const app: Application = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

AppDataSource.initialize()
  .then(() => {
    // here you can start to work with your database
  })
  .catch((error) => console.log(error))

  // Add routes
  app.use("/bots", botRouter);

try {
  app.listen(port, (): void => {
    console.log(`Connected successfully on port ${port}`);
  });
} catch (error: any) {
  console.error(`Error occurred: ${error.message}`);
}
