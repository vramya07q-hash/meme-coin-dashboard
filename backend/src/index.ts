import express from "express";
import userRouter from "./routers/user.router.js";
import coinsRouter from "./routers/coins.router.js";
import cors from "cors";

const app = express();

const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  "http://localhost:3001",
  "http://localhost:3002"
]
app.use(cors({
  origin: (origin,callback) => {
    if(!origin || allowedOrigins.includes(origin)) {
      callback(null,true)
    } else {
      callback(new Error("Not allowed by cors"));
    }
  }
}));

app.use(express.json());

app.use("/api", userRouter);
app.use("/api/coins", coinsRouter);

app.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
});