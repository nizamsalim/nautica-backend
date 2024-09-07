import express, { Request, Response } from "express";
import cors from "cors";
import { config } from "dotenv";
import predictionRouter from "./routers/predictionRouter";

const _healthCheck = (req: Request, res: Response) => {
  return res.json({
    success: true,
    statusCode: 200,
    message: "OK: Server Running",
  });
};

const app = express();
const PORT = 5000;

config();

app.use(cors());
app.use(express.json());
app.get("/", _healthCheck);

app.use("/api", predictionRouter);

app.listen(PORT, () => {
  console.log(`server on ${PORT}`);
});
