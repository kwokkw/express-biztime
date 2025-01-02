/** BizTime express application. */

import express, { json } from "express";
import ExpressError from "./expressError.js";
import invRouter from "./routes/invoices.js";
import coRouter from "./routes/companies.js";
import indRouter from "./routes/industries.js";

const app = express();

app.use(json());
app.use("/invoices", invRouter);
app.use("/companies", coRouter);
app.use("/industries", indRouter);

/** 404 handler */

app.use(function (req, res, next) {
  const err = new ExpressError("Not Found", 404);
  return next(err);
});

/** general error handler */

app.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.json({
    error: err,
    message: err.message,
  });
});

export default app;
