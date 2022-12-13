import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import {db} from './config/mysql.js';
import bcript from 'bcrypt';
import jwt from 'jsonwebtoken';
const saltRounds = 8;

dotenv.config({ path: './.env'});

const PORT = process.env.PORT || 4000;

const connection = await db();

await connection.execute(
    `CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255)   NOT NULL,
        payment_verified TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
    );

const app = express();

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => res. json({ message: 'Hello Vachna' }) );

app.post('/signup', async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    const hash_password = await bcript.hash(password, saltRounds);
    
    try {
        const [rows, fields] = await connection.execute(
            `SELECT * FROM users WHERE email = ?`,
            [email]
        );
        if (rows.length > 0) {
            res.status(401).json({ message: 'Email already exists' });
        } else {
            const [rows, fields] = await connection.execute(
                `INSERT INTO users (email, password, first_name, last_name) VALUES (?, ?, ?, ?)`,
                [email, hash_password, firstName, lastName]
            );
            res.status(200).json({ message: 'User created' });
        }
    } catch (error) {
        console.log(error);
        res.json({ message: 'Error creating user' });
    }



});

app.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    //console.log(email);
    try {
        const [rows, fields] = await connection.execute(
            `SELECT * FROM users WHERE email = ?`,
            [email]
        );
        if (rows.length > 0) {
            const validPassword = await bcript.compare(password, rows[0].password);
            if (validPassword) {
                const token = jwt.sign({ id: rows[0].id }, process.env.JWT_SECRET, {
                    expiresIn: 60*60,
                });

                res.status(200).json({ token: token, message: 'User logged in' });
            } else {
                res.status(401).json({ message: 'Invalid password' });
            }
        } else {
            res.status(401).json({ message: 'Invalid email' });
        }
    } catch (error) {
        console.log(error);
        res.json({ message: 'Error logging in' });
    }
});

app.put('/update', async (req, res) => {
    const { email, firstName, lastName } = req.body;
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(!decoded) return res.status(401).json({ message: 'Invalid token' }
    );

    const id = decoded.id;
    try {
        const [rows, fields] = await connection.execute(
            `UPDATE users SET email = ?, first_name = ?, last_name = ? WHERE id = ?`,
            [email, firstName, lastName, id]
        );
        res.status(200).json({ message: 'User updated' });
    } catch (error) {
        console.log(error);
        res.json({ message: 'Error updating user' });
    }
});
app.get('/user', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(!decoded) return res.status(401).json({ message: 'Invalid token' }
    );

    const id = decoded.id;
    try {
        const [rows, fields] = await connection.execute(
            `SELECT * FROM users WHERE id = ?`,
            [id]
        );
        if(rows.length === 0) return res.status(404).json({ message:'User not found' });
        const userData = {
            email: rows[0].email,
            firstName: rows[0].first_name,
            lastName: rows[0].last_name,
            payment_verified: rows[0].payment_verified
        }
        res.status(200).json({ user: userData });
    } catch (error) {
        console.log(error);
        res.json({ message: 'Error getting user' });
    }
});

app.post('/payment', async (req, res) => {
    const { amount } = req.body;
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(!decoded) return res.status(401).json({ message: 'Invalid token' }
    );

    const id = decoded.id;
    try {
        const [rows, fields] = await connection.execute(
            `UPDATE users SET payment_verified = 1 WHERE id = ?`,
            [id]
        );
        res.status(200).json({ message: 'Payment verified' });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'Error verifying payment' });
    }
});




app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));