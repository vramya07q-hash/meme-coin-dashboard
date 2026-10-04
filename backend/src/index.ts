import express from "express";
import userRouter from "./routers/user.router.js";
import coinsRouter from "./routers/coins.router.js";
import cors from "cors";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: "http://localhost:3001"
}));

app.use(express.json());

app.use("/api", userRouter);
app.use("/api/coins", coinsRouter);

app.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
});