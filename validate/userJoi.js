import Joi from 'joi';

const userSchema = Joi.object({
    name: Joi.string().min(6).required().messages({
        'string.min': 'Name must be at least 6 characters long',
        'string.empty': 'Name is required',
        'any.required': 'Name is required'
    }),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required().messages({
        'string.email': "Email  must be followed by '.' domain suffix. For example adrian@gmail.com",
      }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Password must be at least 6 characters long',
        'any.required': 'Password is required'
    }),
});
export const validateUser = (user) => {
    return userSchema.validate(user)
}