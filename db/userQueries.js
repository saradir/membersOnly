import { pool } from './pool.js';
import bcrypt from "bcrypt";

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