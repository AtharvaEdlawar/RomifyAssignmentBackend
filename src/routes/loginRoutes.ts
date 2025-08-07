import express from 'express'
import { loginController, signupController} from '../controller/LoginController';

const router = express.Router();

router.post('/signup',signupController)
router.post('/',loginController)

export default router;