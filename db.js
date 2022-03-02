const express = require("express");
const app = express();
const { Pool } = require("pg");

require("dotenv").config();

const pool = new Pool({
  user: "tfbayhjo",
  password: process.env.PGPASSWORD,
  database: "tfbayhjo",
  host: "tyke.db.elephantsql.com",
  port: 5432,
});

// get all users
app.get("/users", (req, res) => {
  pool
    .query("SELECT * FROM users;")
    .then((data) => res.json(data.rows))
    .catch((e) => res.sendStatus(500));
});

// get user by id
app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  pool
    .query("SELECT * FROM users WHERE users.id = $1", [id])
    .then((data) => res.json(data.rows[0]))
    .catch((e) => res.sendStatus(500));
});

app.listen("3055", () => console.log("connected"));
