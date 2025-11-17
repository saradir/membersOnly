#! /usr/bin/env node
require("dotenv").config();
const { Client } = require("pg");

const SQL = `
DROP TABLE IF EXISTS messages, users;

CREATE TABLE IF NOT EXISTS users(
id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY ,
last_name TEXT NOT NULL,
first_name TEXT NOT NULL,
email TEXT UNIQUE NOT NULL,
is_member BOOLEAN DEFAULT false,
hashed_password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS messages(
id INTEGER  GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
title TEXT NOT NULL,
text TEXT NOT NULL,
user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

`;

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log("🌱 Seeding database...");
    await client.connect();
    await client.query(SQL);
    console.log("✅ Done!");
  } catch (err) {
    console.error("❌ Error seeding database:", err);
  } finally {
    await client.end();
  }
}

main();

