import request from "supertest";
import { app } from "../server";

describe("Express server", () => {
  it("responds with health status and CSP header", async () => {
    const res = await request(app).get("/health");
    expect(res.body.status).toBe("ok");
    expect(res.headers["content-security-policy"]).toContain(
      "default-src 'self'",
    );
  });
});
