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

### Built with

### What I learned

### Acknowledgments

## Time estimate

Springboard Estimation: 3 - 5 Hours
