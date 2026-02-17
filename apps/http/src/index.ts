
import express, { Request, Response } from 'express';
import cors from 'cors';
import { prisma } from './client';
import router from './routes/index';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api/v1", router);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Express!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
