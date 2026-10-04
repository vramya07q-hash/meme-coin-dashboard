import {Router} from 'express';
import SignUp from '../components/signUp/index.js';
import Login from '../components/signIn/index.js';

const router = Router();

router.post("/signup",SignUp);

router.post('/login',Login)

export default router;