"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const taskAssignController_1 = require("../controllers/taskAssignController");
const router = (0, express_1.Router)();
router.post("/", taskAssignController_1.createTaskAssignment);
router.get("/", taskAssignController_1.getTaskAssigned);
router.get("/:", taskAssignController_1.getSpecificTask);
router.patch("/:taskId/:userId", taskAssignController_1.updateStatusByUser);
router.put("/:taskId/:userId", taskAssignController_1.updateTaskAssignment);
router.delete("/:taskId/:userId", taskAssignController_1.deleteBugAssignment);
exports.default = router;
