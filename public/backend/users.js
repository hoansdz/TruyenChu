import { use } from 'react';
import pool from './db.js';
import crypto from 'crypto';

const secret_key = '01xyUOnHHG88H^CX';

async function users () {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                name VARCHAR(50) NOT NULL,
                create_at TIMESTAMP DEFAULT now(),
                stories_uploaded JSONB DEFAULT '[]'::jsonb
            );
            CREATE TABLE IF NOT EXISTS authorize (
                id INT PRIMARY KEY,
                email VARCHAR(100) NOT NULL UNIQUE,
                password VARCHAR(64) NOT NULL,
                FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE 
            );
            CREATE TABLE IF NOT EXISTS cache (
                id INT PRIMARY KEY,
                token VARCHAR(64) NOT NULL UNIQUE,
                FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
            );
        `);
    }
    catch (err) {
        console.log(`Error ${err.message}`);
    }
}

users.register = async (name, email, password) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const hashPassword = crypto
            .createHash('sha256')
            .update(password)
            .digest('hex');
        const result = await client.query(`
            SELECT password 
            FROM authorize
            WHERE email = $1
        `, [email]);
        if (result.rowCount != 0) {
            throw { message: 'Email đã tồn tại' };
        }
        const token = crypto
            .createHash('sha256')
            .update(`${password}&${secret_key}`)
            .digest('hex');
        const userResult = await client.query(`
            INSERT INTO users (name) 
            VALUES ($1)
            RETURNING id
        `, [name]);
        const userId = userResult.rows[0].id;
        await client.query(`
            INSERT INTO authorize (id, email, password)
            VALUES ($1, $2, $3)
        `, [userId, email, hashPassword]);
        await client.query(`
            INSERT INTO cache (id, token)
            VALUES ($1, $2)
        `, [userId, token]);
        await client.query('COMMIT');
        return {
            state: 'success',
            cache: token
        };
    }
    catch (err) {
        await client.query('ROLLBACK');
        console.log(err.message);
        return {
            state: 'fail',
            err: err.message
        };
    }
    finally {
        client.release();
    }
}

users.login = async (email, password) => {
    const client = await pool.connect();
    try {
        const userResult = await client.query(`
            SELECT id, password
            FROM authorize
            WHERE email = $1
        `, [email]);
        if (userResult.rowCount == 0) {
            throw { message : 'Thông tin tài khoản hoặc mật khẩu không chính xác' };
        }
        const hashPassword = crypto
            .createHash('sha256')
            .update(password)
            .digest('hex');
        if (userResult.rows[0].password !== hashPassword) {
            throw { message : 'Thông tin tài khoản hoặc mật khẩu không chính xác' };
        }
        const token = await client.query(`
            SELECT token
            FROM cache
            WHERE id = $1
        `, [userResult.rows[0].id]);
        return {
            state: 'success',
            cache: token.rows[0].token
        };
    }
    catch (err) {
        console.log(err.message);
        return {
            state: 'fail',
            err: err.message
        };
    }
    finally {
        client.release();
    }
};

export default users;