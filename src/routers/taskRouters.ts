import { Router  } from "express";
import {createTask,getAllTask,updateTask, deleteTask} from '../controllers/taskController';

const router = Router();

router.post("/", createTask);
router.get("/", getAllTask);
router.put("/:taskId/:userId",updateTask )
router.delete("/:taskId/:userId",deleteTask )

export default router;

