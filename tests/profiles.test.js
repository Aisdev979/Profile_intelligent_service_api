import request from "supertest";
import app from "../src/app.js";
import Profile from "../src/models/profile.models.js";
import { connectDB, closeDB } from "./setup.js";

//jest.setTimeout(30000);

beforeAll(async () => {
  await connectDB();

  await Profile.insertMany([
    {
      name: "emmanuel",
      gender: "male",
      gender_probability: 0.99,
      age: 34,
      age_group: "adult",
      country_id: "NG",
      country_name: "Nigeria",
      country_probability: 0.85,
    },
    {
      name: "sarah",
      gender: "female",
      gender_probability: 0.95,
      age: 22,
      age_group: "adult",
      country_id: "US",
      country_name: "United States",
      country_probability: 0.90,
    }
  ]);
});

test("filter by gender", async () => {
  const res = await request(app).get("/api/profiles?gender=male");

  expect(res.statusCode).toBe(200);
  expect(res.body.data.every(p => p.gender === "male")).toBe(true);
});

test("filter by gender and country", async () => {
  const res = await request(app)
    .get("/api/profiles?gender=male&country_id=NG");

  expect(res.body.data.length).toBeGreaterThan(0);
});

test("pagination works", async () => {
  const res = await request(app)
    .get("/api/profiles?page=1&limit=1");

  expect(res.body.data.length).toBe(1);
});

test("invalid query returns 422", async () => {
  const res = await request(app)
    .get("/api/profiles?min_age=abc");

  expect(res.statusCode).toBe(422);
});

afterAll(async () => {
  await closeDB();
});