import { Router } from "express";
import ExpressError from "../expressError.js";
import db from "../db.js";

const invRouter = Router();

// Get a list of invoices
invRouter.get("/", async (req, res, next) => {
  try {
    const results = await db.query("SELECT * FROM invoices");
    return res.json({ invoices: results.rows });
  } catch (error) {
    return next(error);
  }
});

// Get an object on given invoice
invRouter.get("/:id", async (req, res, next) => {
  try {
    const invId = req.params.id;
    const invResults = await db.query("SELECT * FROM invoices WHERE id=$1", [
      invId,
    ]);
    if (invResults.rows.length === 0) {
      throw new ExpressError(`Invoices not found with id of ${id}`, 404);
    }

    const companyResults = await db.query(
      "SELECT * FROM companies WHERE code=$1",
      [invResults.rows[0].comp_code]
    );

    const invoice = {
      id: invResults.rows[0].id,
      amt: invResults.rows[0].amt,
      paid: invResults.rows[0].paid,
      add_date: invResults.rows[0].add_date,
      paid_date: invResults.rows[0].paid_date,
      company: companyResults.rows[0],
    };
    return res.json({ invoice });
  } catch (error) {
    next(error);
  }
});

// Adds an invoice
invRouter.post("/", async (req, res, next) => {
  try {
    const { comp_code, amt } = req.body;
    const results = await db.query(
      "INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING *",
      [comp_code, amt]
    );
    return res.status(201).json({ invoice: results.rows[0] });
  } catch (error) {
    next(error);
  }
});

// Updates an invoice
invRouter.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amt } = req.body;
    const results = await db.query(
      "UPDATE invoices SET amt=$1 WHERE id=$2 RETURNING *",
      [amt, id]
    );
    if (results.rows.length === 0) {
      throw new ExpressError(`Can't update invoice with id of ${id}`, 404);
    }
    return res.json({ invoice: results.rows[0] });
  } catch (error) {
    next(error);
  }
});

// Delete an invoice
invRouter.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const results = await db.query(
      `DELETE FROM invoices WHERE id = $1 RETURNING *`,
      [id]
    );
    if (results.rows.length === 0) {
      throw new ExpressError(`Company not found with id of ${id}`, 404);
    }
    return res.json({ stauts: "deleted" });
  } catch (error) {
    return next(error);
  }
});

export default invRouter;
