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
id INTEGER PRIMARY KEY GENERATE ALWAYS AS IDENTITY,
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
title TEXT NOT NULL,
text TEXT NOT NULL,
user_id INTEGER REFERENCES users(id) NOT NULL ON DELETE CASCADE
);

`
