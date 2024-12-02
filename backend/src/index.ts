import express from "express";
import dotenv from "dotenv";
import uploadRoutes from "./routes/uploads";
dotenv.config();
import cors from "cors";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.DEPLOYED_URL
        : process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.get("/", (req, res) => {
  res.send("hi");
});
app.use("/api", uploadRoutes);

app.listen(5000, () => {
  console.log("Port 5000 Activated");
});
export default app;
