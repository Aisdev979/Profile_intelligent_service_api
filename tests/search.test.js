import request from "supertest";
import app from "../src/app.js";
import { connectDB, closeDB } from "./setup.js";

//jest.setTimeout(30000);

beforeAll(async () => {
  await connectDB();
});

test("parse young males", async () => {
  const res = await request(app)
    .get("/api/profiles/search?q=young males");

  expect(res.statusCode).toBe(200);

  res.body.data.forEach(p => {
    expect(p.gender).toBe("male");
    expect(p.age).toBeGreaterThanOrEqual(16);
    expect(p.age).toBeLessThanOrEqual(24);
  });
});

test("parse females above 30", async () => {
  const res = await request(app)
    .get("/api/profiles/search?q=females above 30");

  res.body.data.forEach(p => {
    expect(p.gender).toBe("female");
    expect(p.age).toBeGreaterThanOrEqual(30);
  });
});

test("invalid NLP query", async () => {
  const res = await request(app)
    .get("/api/profiles/search?q=random nonsense");

  expect(res.statusCode).toBe(422);
  expect(res.body.message).toBe("Unable to interpret query");
});


afterAll(async () => {
  await closeDB();
});