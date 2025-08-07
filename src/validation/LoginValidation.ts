import Joi from 'joi'

export const loginSchema = Joi.object({
    email: Joi.string()
        .max(50)
        .required()
        .messages({
            'string.base': 'email must be a string',
            'string.empty': 'email is required',
            'string.max': 'email cannot exceed 50 characters',
            'any.required': 'email is required',
        }),
    password: Joi.string()
        .min(4)
        .required()
        .messages({
            'string.base': 'Password must be a string',
            'string.empty': 'Password is required',
            'string.min': 'Password should be at least 4 characters long',
            'any.required': 'Password is required',
        }),
});


export const signupSchema = Joi.object({
    firstName: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .pattern(/^[a-zA-Z\s]+$/)
        .required()
        .messages({
            'string.empty': 'First name is required',
            'string.min': 'First name must be at least 2 characters long',
            'string.max': 'First name cannot exceed 50 characters',
            'string.pattern.base': 'First name can only contain letters and spaces'
        }),

    lastName: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .pattern(/^[a-zA-Z\s]+$/)
        .required()
        .messages({
            'string.empty': 'Last name is required',
            'string.min': 'Last name must be at least 2 characters long',
            'string.max': 'Last name cannot exceed 50 characters',
            'string.pattern.base': 'Last name can only contain letters and spaces'
        }),

    email: Joi.string()
        .trim()
        .email({ tlds: { allow: false } })
        .max(255)
        .required()
        .messages({
            'string.empty': 'Email is required',
            'string.email': 'Please provide a valid email address',
            'string.max': 'Email cannot exceed 255 characters'
        }),

    password: Joi.string()
        .min(8)
        .max(128)
        .required()
        .messages({
            'string.empty': 'Password is required',
            'string.min': 'Password must be at least 8 characters long'
        }),
       confirmPassword: Joi.string()
        .min(8)
        .max(128)
        .required()
        .messages({
            'string.empty': 'Password is required',
            'string.min': 'Password must be at least 8 characters long'
        })
});
