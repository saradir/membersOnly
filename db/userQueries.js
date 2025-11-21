import { ExpressValidator } from 'express-validator';
import { pool } from './pool.js';

export async function createUser(firstName, lastName, email, pass){
    try{
        const result = await pool.query(
            `INSERT INTO users (first_name, last_name, email, hashed_password)
            VALUES ($1, $2, $3, $4)
            RETURNING *;`,
            [firstName, lastName, email, pass]
        );

        return result.rows[0];
        
    } catch (err){
        if (err.code === "23505") {
        // Postgres unique violation
        throw new Error("EMAIL_TAKEN");
    }
        console.error("Error creating user:", err);
        throw err;
    }
}

export async function getUserById(id){
    try{
        const { rows } = await pool.query(
            `SELECT * FROM users
             WHERE id = $1;`,
             [id]
        );

        return rows[0];        
    } catch (err){
        console.error("Error fetching user:", err);
        throw err;
    }
}