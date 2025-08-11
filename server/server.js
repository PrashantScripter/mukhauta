// server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import UserRoutes from "./routes/UserRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000; // match frontend's 5000 or change frontend to match this

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", UserRoutes);



app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
