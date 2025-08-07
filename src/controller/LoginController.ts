
import {loginSchema,signupSchema} from '../validation/LoginValidation'
import {loginService,signupService} from '../service/loginService'
import { Request, NextFunction, Response} from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const loginController = async (req: Request, res: Response,next:NextFunction) => {
    try {
        const { error, value } = loginSchema.validate(req.body);
        if (error) {
            res.status(400).json({ error: error.details[0].message });
            return;
        }

        const data = await loginService(value.email, value.password);

        if (data.error) {
            res.status(401).json({ error: data.error });
            return;
        }

        const token = jwt.sign(
            { id: data.id},
            process.env.JWT_SECRET as string,
            { expiresIn: '24h' }
        );

        // ✅ Fixed: Return user_name (combining first + last name) for frontend compatibility
        res.status(200).json({
            id: data.id,
            email: data.email,
            user_name: `${data.first_name} ${data.last_name}`, // ✅ Added user_name
            token,
            message: 'Login successful',
        });
    } catch (err: any) {
        console.error('Error in loginController:', err);
        res.status(500).json({ error: err.message });
    }
};


export const signupController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Validate input data
        const { error, value } = signupSchema.validate(req.body);
        if (error) {
            res.status(400).json({ error: error.details[0].message });
            return;
        }

        // Create user via service
        const data = await signupService(
            value.firstName,
            value.lastName,
            value.email,
            value.password
        );

        // Check for error returned by signupService
        if (data.error) {
            res.status(400).json({ error: data.error });
            return;
        }

        // Generate JWT token for immediate login after signup
        const token = jwt.sign(
            { id: data.id },
            process.env.JWT_SECRET as string,
            { expiresIn: '24h' }
        );

        // ✅ Fixed: Use correct field names that actually exist in data
        res.status(201).json({
            id: data.id,
            email: data.email, // ✅ Now service returns email
            firstName: data.first_name,
            lastName: data.last_name,
            user_name: `${data.first_name} ${data.last_name}`, // ✅ Added for consistency
            token,
            message: 'Signup successful',
            success: true
        });
    } catch (err: any) {
        console.error('Error in signupController:', err);
        res.status(500).json({ error: err.message });
    }
}