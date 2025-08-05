import express from 'express';
import { expressMiddleware } from "./trpc/trpc.js";
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));

app.use(
  '/trpc',
  expressMiddleware,
);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

