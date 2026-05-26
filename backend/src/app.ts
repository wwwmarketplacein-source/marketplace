import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";

import authRoutes from "./routes/auth.routes";
import kybRoutes from "./routes/kyb.routes";
import kycRoutes from "./routes/kyc.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import projectRoutes from "./routes/project.routes";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  ...(process.env.FRONTEND_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/", (req, res) => {
  res.send("Vantor Marketplace API Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/kyb", kybRoutes);
app.use("/api/kyc", kycRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/projects", projectRoutes);

export default app;
