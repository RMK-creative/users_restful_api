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

// ******* USER ROUTES  ******* //

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
    const { first_name, date, user_id } = req.body;
    const newOrder = await pool.query(
      "INSERT INTO users(first_name, date, user_id) VALUES($1, $2, $3) RETURNING *",
      [first_name, date, user_id]
    );

    res.json(`New order added`);
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

// ******* ORDER ROUTES  ******* //

// get all orders
app.get("/orders", async (req, res) => {
  try {
    const allOrders = await pool.query("SELECT * FROM orders;");
    res.json(allOrders.rows);
  } catch (error) {
    console.log("Error", error.message);
  }
});

// get order by id
app.get("/orders/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const order = await pool.query("SELECT * FROM orders WHERE id = $1", [id]);
    res.json(order.rows[0]);
  } catch (error) {
    console.log("Error", error.message);
  }
});

// create new order
app.post("/orders", async (req, res) => {
  try {
    const { price, date, user_id } = req.body;
    const newUser = await pool.query(
      "INSERT INTO users(price, date, user_id) VALUES($1, $2, $3) RETURNING *",
      [price, date, user_id]
    );
    res.json(`New order added`);
  } catch (error) {
    console.log("Error", error.message);
  }
});

// update order
app.put("/orders/:id", async (req, res) => {
  try {
    const { id } = req.params; // WHERE
    const { price, date, user_id } = req.body; // SET

    const updateOrder = await pool.query(
      "UPDATE orders SET price = $1,  date = $2, user_id= $3 WHERE id = $4",
      [price, date, user_id, id]
    );
    res.json(`Order ${id} updated`);
  } catch (error) {
    console.log("Error", error.message);
  }
});

// delete order
app.delete("/orders/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteOrder = await pool.query("DELETE FROM orders WHERE id = $1", [
      id,
    ]);
    res.json(`Order ${id} deleted`);
  } catch (error) {
    console.log("Error", error.message);
  }
});

app.listen("3055", () => console.log("connected"));
