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
    const invResults = await db.query("SELECT * FROM invoices WHERE id=$1", [
      req.params.id,
    ]);

    // Handle nonexistent invoice
    if (invResults.rows.length === 0) {
      throw new ExpressError(
        `Invoices not found with id of ${req.params.id}`,
        404
      );
    }

    const companyResults = await db.query(
      "SELECT * FROM companies WHERE code=$1",
      [invResults.rows[0].comp_code]
    );

    const { id, amt, paid, add_date, paid_date } = invResults.rows[0];
    const company = companyResults.rows[0];

    return res.json({ id, amt, paid, add_date, paid_date, company });
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
    const { amt, paid } = req.body;

    // Check if invoice exists
    const results = await db.query(
      "SELECT paid_date, paid FROM invoices WHERE id=$1",
      [id]
    );

    // Return 404 if invoice not found
    if (results.rows.length === 0) {
      throw new ExpressError(`Can't update invoice with id of ${id}`, 404);
    }

    let { paid: currentPaid, paid_date: currentPaidDate } = results.rows[0];

    // • If paying unpaid invoice: sets paid_date to today
    if (paid && !currentPaid) {
      currentPaidDate = new Date();
    } else if (!paid && currentPaid) {
      // • If un-paying: sets paid_date to null
      currentPaidDate = null;
    }

    const updatedResults = await db.query(
      `
      UPDATE invoices SET amt = $1, paid = $2, paid_date = $3
      WHERE id = $4
      RETURNING id, comp_code, amt, paid, add_date, paid_date`,
      [amt, paid, currentPaidDate, id]
    );

    return res.json({ invoice: updatedResults.rows[0] });
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
