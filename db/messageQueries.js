import { pool } from './pool.js';

export async function createMessage(title, text, userId){
    try{
        const {rows} = await pool.query(
            `INSERT INTO messages (title, text, user_id)
             VALUES ($1, $2, $3)
             RETURNING *;`,
             [title, text, userId]

        );
        return rows[0];
    } catch (err){
        console.error('Error creating new message:', err);
        throw err;
    }
}

export async function getAllMessages(){
    try{
        const { rows } = await pool.query(
        `SELECT m.*, u.first_name, u.last_name, u.id as user_id
        FROM messages m
        JOIN users u ON m.user_id = u.id
        ORDER BY m.created_at DESC;`
        );
        return rows;
    } catch (err){
        console.error('Error fetching messages:', err);
        throw err;
    }
}

export async function deleteMessage(id){
    try{
        const {rows} = await pool.query(
            `DELETE from messages
             WHERE id = $1
             RETURNING*;`,
             [id]
        );
        return rows[0];
    } catch (err){
        console.error('Error deleting message:', err);
        throw err;
    }
}