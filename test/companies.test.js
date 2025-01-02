process.env.NODE_ENV = "test";

import request from "supertest";
import app from "../app.js";
import db from "../db.js";
import slugify from "slugify";

// Set up and clean up
beforeEach(async () => {
  await db.query("DELETE FROM companies");
  await db.query(`
        INSERT INTO companies (code, name, description)
        VALUES ('tech', 'techCorp', 'Innovative tech solutions')`);
});

afterEach(async () => {
  await db.query("DELETE FROM companies");
});

// Close database connections
afterAll(async () => {
  await db.end();
});

describe("GET /companies", () => {
  test("It should respond with a list of companies", async () => {
    await db.query(`
      INSERT INTO companies (code, name, description)
      VALUES ('apple', 'Apple Computer', 'Maker of OSX.'), 
      ('ibm', 'IBM', 'Big blue.');`);
    const response = await request(app).get("/companies");
    expect(response.statusCode).toBe(200);
    expect(response.body.companies.length).toBe(3);
  });
});

describe("GET /companies/:code", () => {
  test("It should respond with a company object", async () => {
    const response = await request(app).get("/companies/tech");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      company: {
        code: "tech",
        name: "techCorp",
        description: "Innovative tech solutions",
        invoices: [],
      },
    });
  });

  test("It should respond with a 404 if the company does not exist", async () => {
    const response = await request(app).get("/companies/nonexistent");
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      error: {
        message: `Can't find company with code of nonexistent`,
        status: 404,
      },
      message: `Can't find company with code of nonexistent`,
    });
  });
});

describe("POST /companies", () => {
  test("It should respond with a new company object", async () => {
    const name = "Innovatech";
    const description = "Innovative technological advancements";
    const response = await request(app).post("/companies").send({
      name,
      description,
    });
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      company: {
        code: slugify(name, {
          lower: true,
          strict: true,
        }),
        name: "Innovatech",
        description: "Innovative technological advancements",
      },
    });
  });
});

describe("PATCH /companies/:code", () => {
  test("It should respond with an updated company object", async () => {
    const response = await request(app).patch("/companies/tech").send({
      code: "tech",
      name: "techLLC",
      description: "Innovative tech solutions",
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      company: {
        code: "tech",
        name: "techLLC",
        description: "Innovative tech solutions",
      },
    });
  });

  test("It should return 404 with invalid input", async () => {
    const response = await request(app).patch("/companies/invalidInput").send({
      code: "tech",
      name: "techLLC",
      description: "Innovative tech solutions",
    });
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      error: {
        message: `Can't update company with code of invalidInput`,
        status: 404,
      },
      message: `Can't update company with code of invalidInput`,
    });
  });
});

describe("DELETE /companies/:code", () => {
  test("It should delete a company and respond with a deleted message", async () => {
    const res = await request(app).delete(`/companies/tech`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: "deleted" });
  });
});
