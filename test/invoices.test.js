process.env.NODE_ENV = "test";

import request from "supertest";
import app from "../app.js";
import db from "../db.js";

// Set up and clean up
beforeEach(async () => {
  await db.query("DELETE FROM invoices");
  await db.query("DELETE FROM companies");

  // Reset the auto-increment sequence for invoices
  await db.query("ALTER SEQUENCE invoices_id_seq RESTART WITH 1");

  // Insert sample data
  await db.query(`
    INSERT INTO companies 
    VALUES ('intel', 'Intel Computer', 'Maker of computer.'), ('dell', 'DELL', 'Hardware solution.')`);
  await db.query(`
    INSERT INTO invoices (comp_Code, amt, paid, paid_date)
    VALUES ('intel', 1000, false, null),
            ('intel', 2000, false, null),
            ('intel', 3000, true, '2018-01-01'),
            ('dell', 4000, false, null)`);
});

afterEach(async () => {
  await db.query("DELETE FROM invoices");
  await db.query("DELETE FROM companies");
});

// Close database connections
afterAll(async () => {
  await db.end();
});

describe("/GET /invoices", () => {
  test("It should respond with a list of invoces.", async () => {
    const response = await request(app).get("/invoices");
    expect(response.statusCode).toBe(200);
    expect(response.body.invoices.length).toBe(4);
  });
});

describe("/GET /invoices/:id", () => {
  it("should respond with an invoice and its company", async () => {
    const response = await request(app).get("/invoices/1");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      id: expect.any(Number),
      amt: 1000,
      paid: false,
      add_date: expect.any(String),
      paid_date: null,
      company: {
        code: "intel",
        name: "Intel Computer",
        description: "Maker of computer.",
      },
    });
  });

  it("should respond with 404 for a nonexistent invoice", async () => {
    const response = await request(app).get("/invoices/99999");
    expect(response.statusCode).toBe(404);
  });
});

describe("/POST /invoices", () => {
  it("should add a new invoice", async () => {
    const response = await request(app).post("/invoices").send({
      comp_code: "intel",
      amt: 400,
    });
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      invoice: {
        id: expect.any(Number),
        comp_code: "intel",
        amt: 400,
        paid: false,
        add_date: expect.any(String),
        paid_date: null,
      },
    });
  });
});

describe("/PATCH /invoices/:id", () => {
  it("should update an invoice", async () => {
    const response = await request(app).patch("/invoices/1").send({
      amt: 600,
      paid: true,
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      invoice: {
        id: 1,
        comp_code: "intel",
        amt: 600,
        paid: true,
        add_date: expect.any(String),
        paid_date: expect.any(String),
      },
    });
  });

  it("should return 404 if the invoice does not exist", async () => {
    const response = await request(app).patch("/invoices/99999").send({
      amt: 600,
      paid: true,
    });
    expect(response.statusCode).toBe(404);
  });
});

describe("/DELETE /invoices/:id", () => {
  it("should delete an invoice", async () => {
    const response = await request(app).delete("/invoices/1");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ stauts: "deleted" });
  });

  it("should return 404 for a nonexistent invoice", async () => {
    const response = await request(app).delete("/invoices/999");
    expect(response.statusCode).toBe(404);
  });
});
