import Router from "express";
import ExpressError from "../expressError.js";
import db from "../db.js";
import slugify from "slugify";

const coRouter = Router();

// Get a list of companies
coRouter.get("/", async (req, res, next) => {
  try {
    const results = await db.query("SELECT * FROM companies");
    return res.json({ companies: results.rows });
  } catch (error) {
    return next(error);
  }
});

// Get a company
coRouter.get("/:code", async (req, res, next) => {
  try {
    const { code } = req.params;
    const companyResults = await db.query(
      "SELECT * FROM companies WHERE code=$1",
      [code]
    );
    // Handle nonexistent company
    if (companyResults.rows.length === 0) {
      throw new ExpressError(`Can't find company with code of ${code}`, 404);
    }

    const invoiceResults = await db.query(
      "SELECT * FROM invoices WHERE comp_code = $1",
      [code]
    );
    const industriesResults = await db.query(
      "SELECT i.industry FROM company_industry ci JOIN industries i ON ci.ind_code = i.code WHERE ci.comp_code = $1",
      [code]
    );

    const company = companyResults.rows[0];
    company.invoices = invoiceResults.rows;
    company.industries = industriesResults.rows.map((i) => {
      return i.industry;
    });

    return res.json({
      company,
    });
  } catch (error) {
    return next(error);
  }
});

// Adds a company
coRouter.post("/", async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const code = slugify(name, {
      lower: true, // convert to lowercase
      strict: true, // remove special characters and spaces
    });
    const results = await db.query(
      "INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING *",
      [code, name, description]
    );
    return res.status(201).json({ company: results.rows[0] });
  } catch (error) {
    return next(error);
  }
});

// Edit a company
coRouter.patch("/:code", async (req, res, next) => {
  try {
    const { code } = req.params;
    const { name, description } = req.body;

    const results = await db.query(
      "UPDATE companies SET name=$1, description=$2 WHERE code=$3 RETURNING *",
      [name, description, code]
    );

    // Handle nonexistent company
    if (results.rows.length === 0) {
      throw new ExpressError(`Can't update company with code of ${code}`, 404);
    }
    return res.json({ company: results.rows[0] });
  } catch (error) {
    return next(error);
  }
});

// Delete a company
coRouter.delete("/:code", async (req, res, next) => {
  try {
    const { code } = req.params;
    const results = await db.query(
      `DELETE FROM companies WHERE code = $1 RETURNING *`,
      [code]
    );
    if (results.rows.length === 0) {
      throw new ExpressError(`Company not found with code of ${code}`, 404);
    }
    return res.json({ status: "deleted" });
  } catch (error) {
    return next(error);
  }
});

export default coRouter;
