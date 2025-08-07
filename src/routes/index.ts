import express from 'express';
import login from './loginRoutes';
import Task from './taskRoutes';

const router = express.Router();

router.use('/login', login);
router.use('/task', Task);

export default router;