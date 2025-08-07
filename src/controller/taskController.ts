import { Request, Response, NextFunction } from 'express';
import {
    createTaskSchema,
    getTaskSchema,
    getAllTaskSchema,
    updateTaskSchema,
    deleteTaskSchema,
} from '../validation/taskValidation';
import {
    createTaskService,
    getTaskByIdService,
    getAllTaskService,
    updateTaskService,
    deleteTaskService,
} from '../service/taskService';

export const createTaskController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("req.body",req.body);
        const { error, value } = createTaskSchema.validate(req.body);
        if (error) {
            res.status(400).json({ error: error.details[0].message });
            return;
        }

        const newId = await createTaskService(value);
        res
            .status(201)
            .json({ message: 'Task created successfully', data: { id: newId } })
            ;
        return;
    } catch (err: any) {
        res.status(500).json({ error: err.message });
        return;
    }
};

export const getAllTaskController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("you are hitting the GetAll Route");
        // Validate query params: limit, offset, search
        const { error, value } = getAllTaskSchema.validate(req.query);
        if (error) {
            res.status(400).json({ error: error.details[0].message });
            return;
        }
        const user_id = Number(value.user_id)
        const limit = Number(value.limit);
        const offset = Number(value.offset);
        const search = typeof value.search === 'string' ? value.search : undefined;

        const result = await getAllTaskService(user_id,limit, offset, search);
        res.status(200).json({ message: 'Task fetched successfully', data: result });
        return;
    } catch (err: any) {
        res.status(500).json({ error: err.message });
        return;
    }
};


export const getTaskByIdController = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { error } = getTaskSchema.validate({ id });
        if (error) {
            res.status(400).json({ error: error.details[0].message });
            return;
        }

        const Task = await getTaskByIdService(id);
        if (!Task) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }
        res.status(200).json({ message: 'Task fetched successfully', data: Task });
        return;
    } catch (err: any) {
        res.status(500).json({ error: err.message });
        return;
    }
};

export const updateTaskController = async (req: Request, res: Response): Promise<any> => {
    try {

        const id = Number(req.params.id);
        const { error} = updateTaskSchema.validate({
            params: { id },
            body: req.body,
        });
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        // If updating password, hash it first (e.g. using bcrypt). Example omitted for brevity.
        const updatedTaskId = await updateTaskService(id, req.body);
        res.status(200).json({ message: 'Task updated successfully', data: { id: updatedTaskId } });
        return;
    } catch (err: any) {
        res.status(500).json({ error: err.message });
        return;
    }
};

export const deleteTaskController = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { error } = deleteTaskSchema.validate({ id });
        if (error) {
            res.status(400).json({ error: error.details[0].message });
            return;
        }

        const deleted = await deleteTaskService(id);
        if (!deleted) {
            res.status(404).json({ error: 'Task not found or already deleted' });
            return;
        }
        res.status(200).json({ message: 'Task deleted successfully' });
        return;
    } catch (err: any) {
        res.status(500).json({ error: err.message });
        return;
    }
};
        