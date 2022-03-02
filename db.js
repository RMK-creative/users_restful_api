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
app.get("/users", async (req, res) => {
  try {
    const allUsers = await pool.query("SELECT * FROM users;");
    res.json(allUsers.rows);
  } catch (error) {
    console.log("Error", error.message);
  }
});

// get user by id
app.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await pool.query("SELECT * FROM users WHERE users.id = $1", [
      id,
    ]);
    res.json(user.rows[0]);
  } catch (error) {
    console.log("Error", error.message);
  }
});

// create new user
app.post("/users", async (req, res) => {
  try {
    const { first_name, last_name, age } = req.body;
    const newUser = await pool.query(
      "INSERT INTO users(first_name, last_name, age) VALUES($1, $2, $3) RETURNING *",
      [first_name, last_name, age]
    );

    res.json(`New user added`);
  } catch (error) {
    console.log("Error", error.message);
  }
});

// update user
app.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params; // WHERE
    const { first_name, last_name, age } = req.body; // SET

    const updateUser = await pool.query(
      "UPDATE users SET first_name = $1, last_name= $2, age= $3 WHERE id = $4",
      [first_name, last_name, age, id]
    );
    res.json(`User ${id} updated`);
  } catch (error) {
    console.log("Error", error.message);
  }
});

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
