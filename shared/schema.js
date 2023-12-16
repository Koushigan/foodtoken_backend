const Joi = require("joi");

module.exports = {
    async validate(schema, data) {
        try {
            await schema.validateAsync(data);
            return false;
        } catch ({ details: [error] }) {
            return error.message;
        }
    },

    signUpSchema: Joi.object({
        firstname: Joi.string().min(2).required(),
        lastname: Joi.string().required(),
        email: Joi.string().email().required(),
        mobile: Joi.number().positive().min(10).required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
        cpassword: Joi.ref("password"),
    }),

    signInSchema: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    }),

    postSchema: Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        ingredients: Joi.array().items(
            Joi.string().required(),
        ),
        spicy: Joi.boolean().required(),
        vegetarian: Joi.boolean().required(),
        price: Joi.number().required(),
        image: Joi.string().required(),
    }),
};
