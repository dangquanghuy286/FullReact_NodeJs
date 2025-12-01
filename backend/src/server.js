import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./libs/db.js";
import routes from "./routes/index.route.js";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(express.json());
app.use(cookieParser());
// Routes
app.use("/api", routes);

// Connect Database
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
