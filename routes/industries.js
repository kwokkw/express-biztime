import Router from "express";
import ExpressError from "../expressError.js";
import db from "../db.js";

const indRouter = Router();

// Adds an industry
indRouter.post("/", async (req, res, next) => {
  try {
    const { code, industry } = req.body;
    const results = await db.query(
      "INSERT INTO industries (code, industry) VALUES ($1, $2) RETURNING *",
      [code, industry]
    );

    return res.status(201).json({ industries: results.rows[0] });
  } catch (error) {
    return next(error);
  }
});

// Get a list of industries
indRouter.get("/", async (req, res, next) => {
  try {
    const results = await db.query(`
        SELECT 
            i.industry AS industry_name,
            ARRAY_AGG(c.name) AS company_names
        FROM 
            industries i
        LEFT JOIN 
            company_industry ci ON i.code = ci.ind_code
        LEFT JOIN 
            companies c ON ci.comp_code = c.code
        GROUP BY 
            i.code, i.industry;
    `);
    console.log(results.rows);
    return res.json({ industries: results.rows });
  } catch (error) {
    next(error);
  }
});

// Associating an industry to a company
indRouter.post("/:indCode/:compCode/", async (req, res, next) => {
  try {
    const { indCode, compCode } = req.params;
    console.log(indCode);

    const indResults = await db.query(
      `
      SELECT code FROM industries WHERE code = $1`,
      [indCode]
    );
    const compResults = await db.query(
      `
      SELECT code FROM companies WHERE code = $1`,
      [compCode]
    );
    if (indResults.rows.length === 0) {
      throw new ExpressError(`Industry with code '${indCode}' not found.`, 404);
    }
    if (compResults.rows.length === 0) {
      throw new ExpressError(`Company with code '${compCode}' not found.`, 404);
    }

    const result = await db.query(
      "INSERT INTO company_industry (comp_code, ind_code) VALUES ($1, $2) RETURNING *",
      [compCode, indCode]
    );

    return res.json({ Association: req.params });
  } catch (error) {
    next(error);
  }
});

export default indRouter;
