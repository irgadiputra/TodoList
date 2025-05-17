import express, { Application, Request, Response, NextFunction } from "express";
import path from "path";
import cors from "cors";
import { PORT } from "./config";
import AuthRouter from "./routers/auth.router";
import TodoRouter from "./routers/todo.router";

const port = PORT || 8080;
const app: Application = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true, 
}));

app.use(express.json());

app.get(
  "/api",
  (req: Request, res: Response, next: NextFunction) => {
    console.log("test masuk");
    next();
  },
  (req: Request, res: Response) => {
    res.status(200).send("ini api");
  }
);

app.use("/auth", AuthRouter);
app.use("/todo", TodoRouter);

app.use("/avt", express.static(path.join(__dirname, "/public/avatar")));

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

export { app };
