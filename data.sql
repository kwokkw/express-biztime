-- DROP DATABASE IF EXISTS biztime_test;
-- CREATE DATABASE biztime_test;

\c biztime;

DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS companies;

CREATE TABLE companies (
    code text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text
);

CREATE TABLE invoices (
    id serial PRIMARY KEY,
    comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
    amt float NOT NULL,
    paid boolean DEFAULT false NOT NULL,
    add_date date DEFAULT CURRENT_DATE NOT NULL,
    paid_date date,
    CONSTRAINT invoices_amt_check CHECK ((amt > (0)::double precision))
);

INSERT INTO companies
  VALUES ('apple', 'Apple Computer', 'Maker of OSX.'),
         ('ibm', 'IBM', 'Big blue.');

INSERT INTO invoices (comp_code, amt, paid, paid_date)
  VALUES ('apple', 100, false, null),
         ('apple', 200, false, null),
         ('apple', 300, true, '2018-01-01'),
         ('ibm', 400, false, null);

SELECT 
  i.code AS industry_code,
  i.industry AS industry_name,
  ARRAY_AGG(c.code) AS company_codes,
  ARRAY_AGG(c.name) AS company_names
FROM 
  industries i
LEFT JOIN 
  company_industry ci ON i.code = ci.ind_code
LEFT JOIN 
  companies c ON ci.comp_code = c.code
GROUP BY 
  i.code, i.industry;
