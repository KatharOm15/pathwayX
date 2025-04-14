import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./config/mongoConn.js";

import careerpathRes from './routes/carrepathRes.js'
import roadMapRoute from './routes/roadMapRoute.js'

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/ai_generated_path",careerpathRes);
app.use("/api/roadmap",roadMapRoute)
app.use("/api/roadmaps",roadMapRoute)


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
