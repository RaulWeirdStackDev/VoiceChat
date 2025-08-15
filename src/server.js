import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import {chatRoutes} from './routes/chatRoutes.js';
import {authRoutes} from './routes/authRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectado a MongoDB Atlas"))
  .catch(err => console.error("❌ Error conectando a MongoDB:", err));

app.use("/api/chat", chatRoutes)
app.use("/api/auth", authRoutes)


app.listen(3000, () => console.log('Servidor en http://localhost:3000'));
