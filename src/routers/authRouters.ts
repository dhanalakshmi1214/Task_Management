import {Router} from 'express';
import { userLogin } from '../controllers/authController';


const router = Router();

router.post("/",userLogin )


export default router;