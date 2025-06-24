import request from "supertest";
import express, { Express } from "express";
import { createSecurityMiddleware } from "../server/security";

describe("createSecurityMiddleware", () => {
  it("applies CSP headers", async () => {
    const server: Express = express();
    server.use(createSecurityMiddleware());
    server.get("/", (_req, res) => {
      res.send("ok");
    });

    const res = await request(server).get("/");
    expect(res.headers["content-security-policy"]).toContain(
      "default-src 'self'",
    );
  });
});
