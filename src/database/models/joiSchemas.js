import Joi from "joi";

export const signInSchema = Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().min(1).required()
});

export const signUpSchema = Joi.object({
    name: Joi.string().min(1).trim().required(),
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().min(1).required(),
    repeat_password: Joi.ref('password')
});

export const dataSchema = Joi.object({
    id: Joi.string().length(24).required(),
    artist: Joi.string().min(1).trim().required(),
    album: Joi.string().min(1).trim().required(),
    price: Joi.number().precision(2).required(),
    quantity: Joi.number().precision(0).sign('positive').required(),
    image: Joi.string().min(1).required(),
    date: Joi.string().min(1).required(),
    index: Joi.number().required()
})

export const cartSchema = Joi.object({
    address: Joi.string().min(1).trim().required(),
    cardNumber: Joi.string().pattern(/[0-9]{16}/).trim().required(),
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    data: Joi.array().required()
})