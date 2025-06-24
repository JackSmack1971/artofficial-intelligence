import express, { Request, Response } from "express";
import { createSecurityMiddleware } from "./security";

const app: express.Express = express();
app.use(createSecurityMiddleware());
app.use(express.json());

app.get("/health", (_: Request, res: Response): void => {
  res.json({ status: "ok" });
});

export function startServer(port: number): void {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

export { app };
