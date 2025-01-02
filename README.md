# Springboard - Node-PG Relationships

## Table of contents

- [Springboard - Broken App](#springboard---broken-app)
  - [Table of contents](#table-of-contents)
  - [Overview](#overview)
    - [The challenge](#the-challenge)
    - [Links](#links)
  - [My process](#my-process)
    - [Built with](#built-with)
    - [What I learned](#what-i-learned)
    - [Acknowledgments](#acknowledgments)
  - [Time estimate](#time-estimate)

**Note: Delete this note and update the table of contents based on what sections you keep.**

## Overview

In this exercise, we will build a REST-ful backend API server for a simple company/invoice tracker.

### The challenge

- How to return a nested JSON object?

  I had to make separate queries, then construct a nested object.

- **`jest --coverage`**

  In order to generate the coverage report, I had to update `package.json` to enable ESM support in Jest, use `jest.config.cjs` for Jest configuration (**SPECIFILLY `cjs`**, otherwise it doesn't work). Then, running Jest with Node's experimental ESM support: `NODE_OPTIONS="--experimental-vm-modules" npx jest --coverage`

- Add a Many-to-Many

### Links

## My process

### Set up

- Directory Structure

  express-biztime-node-pg/
  |--- routes
  | |
  | |--- companies.js
  | |--- invoices.js
  |
  |--- app.js # Database connection setup
  |--- data.sql
  |--- db.js
  |--- expressError.js
  |--- package-lock.json
  |--- package.json
  |--- README.md
  |--- server.js

- Initialize project:

  - `npm init -y`

  - Enable ESM in `package.json`

    ```json
    {
      "type": "module"
    }
    ```

  - Install Dependencies:

    - `npm install express`
    - `npm install pg`

- Add Database

- Add Company Routes

- Add Invoices Routes

- Add Test

  - `npm install supertest`
  - `npm install jest`
  - `npm test`

### Built with

### What I learned

For ease of readability, we’ve awaited two database queries sequentially in the above code example. We could have just as easily run these queries in parallel by wrapping them in a `Promise.all`, since the message query doesn’t depend on the result of the user query.

Why we don’t use a join, and simply make one request to the database. What would be some advantages to using this approach? What might some disadvantages be?

### Acknowledgments

## Time estimate

Springboard Estimation: 3 - 5 Hours

"test": "node --experimental-vm-modules ./node_modules/jest/bin/jest.js",
"test": "jest --coverage",
