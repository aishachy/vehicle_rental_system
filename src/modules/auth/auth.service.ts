import { pool } from "../../config/db"
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import config from "../../config";

const signInUser = async (email: string, password: string) => {
    console.log({ email });
    const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
        email,
    ]);

    console.log({ result });
    if (result.rows.length === 0) {
        return null;
    }
    const user = result.rows[0]

    const match = await bcrypt.compare(password, user.password);

    console.log({ match, user });

    if (!match) {
        return false;
    }

    delete user.password;

    const token = jwt.sign({ id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role }, config.jwtSecret as string, {
        expiresIn: "7d",
    })

    console.log({ token });

    return { token, user }
}

const signUpUser = async (name: string, email: string, password: string, phone: string, role?: string) => {
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email])

    if (result.rows.length > 0) {
        return null;
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const userRole = role || "user";


    const createUser = await pool.query(`INSERT INTO users(name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, phone, role, created_at`, [name, email, hashedPassword, phone, userRole])

    const user = createUser.rows[0];
    const token = jwt.sign({ id: user.id, name: user.name, email: user.email, role: user.role }, config.jwtSecret as string, {
        expiresIn: "7d",
    })

    return { token, user }
}

export const authServices = {
    signInUser,
    signUpUser
}