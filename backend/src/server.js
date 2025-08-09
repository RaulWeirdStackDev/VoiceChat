import express from 'express';
import cors from 'cors';
import {chatRoutes} from './routes/chatRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/chat", chatRoutes)

app.listen(3000, () => console.log('Servidor en http://localhost:3000'));
