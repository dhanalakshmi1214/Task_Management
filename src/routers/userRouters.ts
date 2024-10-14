import {Router} from 'express';
import { createUser, getAllUser ,upateRoleByadmin,  updateUser, deleteUser} from '../controllers/userController';


const router = Router();

router.post("/",createUser )
router.get("/", getAllUser )
router.put("/:userId", updateUser)
router.patch("/upadte/:adminId", upateRoleByadmin)
router.delete("/delete/:adminId", deleteUser)

export default router;