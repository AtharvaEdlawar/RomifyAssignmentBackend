import express from 'express'
import  {getAllTaskController,createTaskController,updateTaskController,deleteTaskController,getTaskByIdController} from '../controller/taskController'

const router = express.Router();
router.get('/',getAllTaskController)
router.get('/:id',getTaskByIdController)
router.put('/:id',updateTaskController)
router.delete('/:id',deleteTaskController)
router.post('/',createTaskController)

export default router;