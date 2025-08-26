const express = require("express");
const { Client } = require("pg");
require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(express.json());

// connect to database
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

client.connect();

//server test
app.get("/", (req, res) => {
  res.send(" server is ready ");
});

//database test by getting current time
app.get("/test-db", async (req, res) => {
  const result = await client.query("SELECT NOW()");
  res.json({ time: result.rows[0] });
});

// get all posts
app.get("/posts", async (req, res) => {
  const result = await client.query("SELECT * FROM posts ORDER BY date DESC");
  res.json(result.rows);
});

// get one post by id
app.get("/posts/:id", async (req, res) => {
  const result = await client.query("SELECT * FROM posts WHERE id=$1", [
    req.params.id,
  ]);
  res.json(result.rows[0]);
});

// create new post
app.post("/posts", async (req, res) => {
  const { author, title, content, cover } = req.body;
  const result = await client.query(
    "INSERT INTO posts (author, title, content, cover) VALUES ($1,$2,$3,$4) RETURNING *",
    [author, title, content, cover]
  );
  res.json(result.rows[0]);
});

// update post
app.put("/posts/:id", async (req, res) => {
  const { title, content, cover } = req.body;
  const result = await client.query(
    "UPDATE posts SET title=$1, content=$2, cover=$3 WHERE id=$4 RETURNING *",
    [title, content, cover, req.params.id]
  );
  res.json(result.rows[0]);
});

// delete post
app.delete("/posts/:id", async (req, res) => {
  const result = await client.query(
    "DELETE FROM posts WHERE id=$1 RETURNING *",
    [req.params.id]
  );
  res.json(result.rows[0]);
});

//run server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
