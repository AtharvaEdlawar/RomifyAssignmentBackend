import pool from '../config/dbConfig'

 interface ITask {
    id?:number,
    status:string,
    name:string,
    created_at?:string,
    updated_at?:string,
    user_id?:number
}
export const createTaskService = async (values: ITask) => {
    try {
        const { name, status, user_id } = values;
        console.log(values);
        const query = `
            INSERT INTO public.tasks (name, status, user_id)
            VALUES ($1, $2, $3)
            RETURNING id, name, status, created_at, user_id
        `;
        
        const result = await pool.query(query, [name, status, user_id]);
        return result.rows[0];
    } catch (error: any) {
        console.error('Error creating task:', error);
        throw error;
    }
};



export const getTaskByIdService = async (taskId: number): Promise<ITask | null> => {
    try {
        const query = `
            SELECT 
                id,
                name,
                status
            FROM public.tasks
            WHERE id = $1
        `;
        
        const result = await pool.query(query, [taskId]);
        return result.rows[0] || null;
        
    } catch (error) {
        console.error(`Error fetching task ${taskId}:`, error);
        throw new Error('Failed to retrieve task');
    }
};

export const getAllTaskService = async (
    user_id: number,
    limit: number = 10,
    offset: number = 0,
    search: string | null = null,
) => {
    // Base query with user_id filter
    let query = `
        SELECT 
            t.id,
            t.name,
            t.status,
            t.created_at,
            t.user_id,
            u.first_name,
            u.last_name
        FROM 
            public.tasks t
        JOIN 
            public.users u ON t.user_id = u.id
        WHERE t.user_id = $1  -- Always filter by user_id first
    `;

    // Count query with same user_id filter
    let countQuery = `
        SELECT COUNT(*) as total_count
        FROM public.tasks
        WHERE user_id = $1
    `;

    // Initialize params with correct types
    const params: (number | string | string[])[] = [user_id];
    const countParams: (number | string | string[])[] = [user_id];

    // Track parameter positions separately
    let paramPosition = 2;
    let countParamPosition = 2;

    // Add search filter if provided
    if (search) {
        const searchTerm = `%${search}%`;
        params.push(searchTerm);
        countParams.push(searchTerm);
        query += ` AND t.name ILIKE $${paramPosition}`;
        countQuery += ` AND name ILIKE $${countParamPosition}`;
        paramPosition++;
        countParamPosition++;
    }
    // Add pagination to main query
    query += `
        ORDER BY t.created_at DESC
        LIMIT ${limit}
        OFFSET ${offset}
    `;
    // Execute both queries in parallel
    const [result, countResult] = await Promise.all([
        pool.query(query, params),
        pool.query(countQuery, countParams)
    ]);

    return {
        data: result.rows,
        pagination: {
            total: Number(countResult.rows[0].total_count),
            limit,
            offset
        }
    };
};

export const updateTaskService = async (
    taskId: number,
    updateData: Partial<ITask>,
): Promise<number> => {
    try {
        // Build dynamic SET clauses based on provided fields
        const setClauses: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        for (const [key, value] of Object.entries(updateData)) {
            if (value !== undefined) {
                setClauses.push(`${key} = $${paramIndex}`);
                values.push(value);
                paramIndex++;
            }
        }

        if (setClauses.length === 0) {
            throw new Error('No valid fields provided for update');
        }

        // Add taskId as the last parameter
        values.push(taskId);

        const query = `
            UPDATE public.tasks
            SET ${setClauses.join(', ')}
            WHERE id = $${paramIndex}
            RETURNING id
        `;

        const result = await pool.query(query, values);
        
        if (result.rowCount === 0) {
            throw new Error('Task not found');
        }

        return result.rows[0].id;
    } catch (error: any) {
        console.error('Error updating task:', error);
        
        // Handle specific PostgreSQL errors
        if (error.code === '23505') { // Unique violation
            throw new Error('Task with this name already exists');
        } else if (error.code === '23503') { // Foreign key violation
            throw new Error('Invalid user_id provided');
        }
        
        throw error;
    }
};

export const deleteTaskService = async (
    taskId: number
): Promise<boolean> => {
    try {
        const query = `
            DELETE FROM public.tasks
            WHERE id = $1
            RETURNING id
        `;
        
        const result = await pool.query(query, [taskId]);
        
        if (result.rowCount === 1) {
            return true; // Successfully deleted
        }
        return false; // No task found with this ID
        
    } catch (error: any) {
        console.error(`Error deleting task ${taskId}:`, error);
        
        // Handle specific PostgreSQL errors if needed
        if (error.code === '23503') { // Foreign key violation
            throw new Error('Cannot delete task - it is referenced by other records');
        }
        
        throw error; // Re-throw other errors
    }
}

export const TaskDropdownService = async (domainName: string): Promise<any> => {
    try {
        const sql = `SELECT * FROM "${domainName}".get_Task_dropdown();`;
        const result = await pool.query(sql);
        return result.rows;
    } catch (err: any) {
        console.error('Error in TaskDropdownService:', err);
        throw err;
    }
};