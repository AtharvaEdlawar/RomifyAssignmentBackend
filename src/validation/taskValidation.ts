import Joi from "joi";

export const createTaskSchema = Joi.object({
    name: Joi.string().required(),
    status: Joi.string().required(),
    user_id:Joi.number().required()
});

export const updateTaskSchema = Joi.object({
    params: Joi.object({
        id: Joi.number().required(),
    }),
    body: Joi.object({
        id:Joi.number(),
        name: Joi.string(),
        status: Joi.string()
    }),
});


export const getTaskSchema = Joi.object({
    id: Joi.number().required(),
})

export const deleteTaskSchema = Joi.object({
    id: Joi.number().required(),
})

export const getAllTaskSchema = Joi.object({
    limit: Joi.number().required(),
    offset: Joi.number().required(),
    search: Joi.string().optional().allow(null, ""),
    user_id: Joi.number().required()
})
