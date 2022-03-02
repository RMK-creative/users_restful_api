const express = require("express");
const app = express();
const { Pool } = require("pg");

app.use(express.json()); // get access to req.body

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

// create new user
app.post("/users", (req, res) => {
  console.log(req.body);
  const { first_name, last_name, age } = req.body;
  pool
    .query(
      "INSERT INTO users(first_name, last_name, age) VALUES($1, $2, $3) RETURNING *",
      [first_name, last_name, age]
    )
    .then((data) => res.status(201).json(data))
    .catch((e) => res.sendStatus(404));
});

// update user
// app.put("/users/:id", (req, res) => {
//     const {id} = req.params;
//     const {  }
// })

// delete user
app.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // delete user_id from orders table
    const deleteUser_id = await pool.query(
      "DELETE FROM orders WHERE user_id = $1",
      [id]
    );
    // delete user from user table
    const deleteUser = await pool.query(
      "DELETE FROM users WHERE users.id = $1",
      [id]
    );
    res.json(`User ${id} deleted`);
  } catch (error) {
    console.log("Error", error.message);
  }
});

app.listen("3055", () => console.log("connected"));
