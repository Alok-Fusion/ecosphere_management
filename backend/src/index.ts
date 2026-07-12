import express, { type Express, type Request, type Response } from 'express';
import cors from "cors";
import cookieParser from 'cookie-parser';
import adminRouter from './routers/adminRouter';


const app: Express = express();



app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
}));
app.use(express.json());

app.use(cookieParser());


app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});


app.use("/api/admin", adminRouter)

app.listen(3000, () => console.log("Server running on 3000"));