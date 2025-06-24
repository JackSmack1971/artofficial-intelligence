import request from "supertest";
import express from "express";
import { createSecurityMiddleware } from "../server/security";

describe("createSecurityMiddleware", () => {
  it("applies CSP headers", async () => {
    const app = express();
    app.use(createSecurityMiddleware());
    app.get("/", (_req, res) => res.send("ok"));

    const res = await request(app).get("/");
    expect(res.headers["content-security-policy"]).toContain(
      "default-src 'self'",
    );
  });
});
