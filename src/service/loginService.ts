import pool from '../config/dbConfig'
import bcrypt from 'bcrypt'


// services/authService.ts
export const loginService = async (
    email: string,
    password: string
) => {
    try {
        // 1. Get user by email
        const query = `
      SELECT id, email, password, first_name, last_name 
      FROM public.users 
      WHERE email = $1
    `;
        const result = await pool.query(query, [email.toLowerCase().trim()]);

        if (result.rows.length === 0) {
            return { error: 'User not found' };
        }

        const user = result.rows[0];

        // 2. Debug log to see what we got from database
        console.log('User from DB:', user);

        // 3. Check if password exists
        if (!user.password) {
            console.error('No password field found in user object');
            return { error: 'Invalid user data' };
        }

        // 4. Verify password - use 'password' not 'password_hash'
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return { error: 'Invalid credentials' };
        }

        // 5. Return user data without password
        return {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name
        };

    } catch (err) {
        console.error('Login service error:', err);
        return { error: 'Internal server error' };
    }
};


export const signupService = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
) => {
    try {
        // 1. Check if user already exists
        const checkUserQuery = `
            SELECT id FROM public.users WHERE email = $1
        `;
        const existingUser = await pool.query(checkUserQuery, [email.toLowerCase().trim()]);

        if (existingUser.rows.length > 0) {
            return { error: 'User with this email already exists' };
        }

        // 2. Hash the password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 3. Insert new user into database
        const insertUserQuery = `
            INSERT INTO public.users (first_name, last_name, email, password)
            VALUES ($1, $2, $3, $4)
            RETURNING id, first_name, last_name, email, created_at
        `;

        const result = await pool.query(insertUserQuery, [
            firstName.trim(),
            lastName.trim(),
            email.toLowerCase().trim(),
            hashedPassword
        ]);

        if (result.rows.length === 0) {
            return { error: 'Failed to create user' };
        }

        // 4. Debug log to see what we got from database
        console.log('Created user:', result.rows[0]);

        // 5. Return user data explicitly (without password)
        const newUser = result.rows[0];
        return {
            id: newUser.id,
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            email: newUser.email,
            created_at: newUser.created_at
        };

    } catch (err: any) {
        console.error('Signup service error:', err);

        // Handle specific database errors
        if (err.code === '23505') { // Unique constraint violation
            return { error: 'User with this email already exists' };
        }

        return { error: 'Internal server error' };
    }
};

