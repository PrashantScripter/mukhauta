import dotenv from "dotenv";
import express from "express";
import UserRoutes from "./routes/UserRoutes.js";

const app = express();

dotenv.config();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/user", UserRoutes);

app.listen(PORT, () => {
  console.log(`server is running at ${PORT}`);
});
