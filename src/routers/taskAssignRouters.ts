import { Router  } from "express";
import {createTaskAssignment, getTaskAssigned, getSpecificTask, updateStatusByUser, updateTaskAssignment, deleteBugAssignment} from '../controllers/taskAssignController';

const router = Router();

router.post("/", createTaskAssignment);
router.get("/", getTaskAssigned);
router.get("/:userId", getSpecificTask);
router.patch("/:taskId/:userId",updateStatusByUser )
router.put("/:taskId/:userId",updateTaskAssignment)
router.delete("/:taskId/:userId", deleteBugAssignment)


export default router;

