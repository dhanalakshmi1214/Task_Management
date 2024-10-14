"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBugAssignment = exports.updateTaskAssignment = exports.updateStatusByUser = exports.getSpecificTask = exports.getTaskAssigned = exports.createTaskAssignment = void 0;
const client_1 = require("@prisma/client");
const enum_1 = require("../enums/enum");
const prisma = new client_1.PrismaClient();
const createTaskAssignment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { createdById, assignedToId, status, taskId } = req.body;
    try {
        const assignedByManager = yield prisma.user.findUnique({
            where: { user_id: createdById },
        });
        if (!assignedByManager ||
            assignedByManager.role !== enum_1.Role.MANAGER) {
            console.error("Only an Manager can assign bugs", assignedByManager);
            return res
                .status(400)
                .json({ Error: "Only an Manager can assign bugs", assignedByManager });
        }
        const newTaskAssignment = yield prisma.taskAssigned.create({
            data: {
                taskId: taskId,
                createdById: createdById,
                assignedToId: assignedToId,
                status: status,
            },
        });
        console.log("New Bug Assignment created", newTaskAssignment);
        res
            .status(200)
            .json({
            Message: "New Bug Assignment created to the user",
            newTaskAssignment,
        });
    }
    catch (error) {
        console.error("Error creating a bug assignment", error);
        res.status(500).json({ Error: "Error creating a bug assignment", error });
    }
});
exports.createTaskAssignment = createTaskAssignment;
const getTaskAssigned = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getAllAsign = yield prisma.taskAssigned.findMany();
        console.log("All the bugAssignment are assigned", getAllAsign);
        res.status(200).json({ Message: "All the bugAssignment are assigned", getAllAsign });
    }
    catch (error) {
        console.error("Error getting a BugAssignment", error);
        res.status(500).json({ Error: "Error getting a BugAssignment", error });
    }
});
exports.getTaskAssigned = getTaskAssigned;
const getSpecificTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.params.userId);
    try {
        const findUser = yield prisma.user.findUnique({
            where: { user_id: userId },
        });
        if (!findUser || findUser.role !== enum_1.Role.DEVELOPER) {
            console.log(`Only developer can have access to view their tasks`);
            return res.status(400).json({ Error: `Only developer can have access to view their tasks` });
        }
        const getUserTask = yield prisma.taskAssigned.findMany({
            where: { assignedToId: userId },
        });
        console.log("All your task has been listed ", getUserTask);
        res.status(200).json({ Message: "All your task has been listed ", getUserTask });
    }
    catch (error) {
        console.error("Error getting a specific task assigned", error);
        res.status(500).json({ Error: "Error getting a task assigned", error });
    }
});
exports.getSpecificTask = getSpecificTask;
// user can update their status
const updateStatusByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.params.userId);
    const taskId = parseInt(req.params.taskId);
    const { status } = req.body;
    try {
        const updateByDeveloper = yield prisma.user.findUnique({
            where: { user_id: userId },
        });
        if (!updateByDeveloper || updateByDeveloper.role !== enum_1.Role.DEVELOPER) {
            console.log("Only an Admin can update a Role for the user");
            return res
                .status(400)
                .json({
                Error: "Only an Admin can update a Role for the user",
                updateByDeveloper,
            });
        }
        const updateRole = yield prisma.taskAssigned.update({
            where: { taskAssigned_id: taskId },
            data: {
                status: status,
            },
        });
        console.log("Updated Status by Developer", updateByDeveloper);
        return res
            .status(200)
            .json({ Message: "Updated Status by Developer", updateByDeveloper });
    }
    catch (error) {
        console.error("Error updating a status", error);
        res.status(500).json({ Error: "Error updating a status", error });
    }
});
exports.updateStatusByUser = updateStatusByUser;
const updateTaskAssignment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.params.userId);
    const taskId = parseInt(req.params.taskId);
    const { assignedToId, createdById, status } = req.body;
    try {
        const assignedByManager = yield prisma.user.findUnique({
            where: { user_id: userId },
        });
        if (!assignedByManager ||
            assignedByManager.role !== enum_1.Role.MANAGER) {
            console.log("Only an MAnager  can update a Task Assignment");
            return res
                .status(400)
                .json({
                Error: "Only an MAnager can update a Task Assignment",
                assignedByManager,
            });
        }
        const updatedBugAssignment = yield prisma.taskAssigned.update({
            where: { taskAssigned_id: taskId },
            data: {
                createdById: createdById,
                assignedToId: assignedToId,
                status: status,
            },
        });
        console.log("Updated Bug Assignment", updatedBugAssignment);
        return res
            .status(200)
            .json({ Message: "Updated Bug Assignment", updatedBugAssignment });
    }
    catch (error) {
        console.error("Error updating a bug assignment", error);
        res.status(500).json({ Error: "Error updating a bug assignment", error });
    }
});
exports.updateTaskAssignment = updateTaskAssignment;
const deleteBugAssignment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.params.userId);
    const taskId = parseInt(req.params.taskId);
    try {
        const assignedByManager = yield prisma.user.findUnique({
            where: { user_id: userId },
        });
        if (!assignedByManager ||
            assignedByManager.role !== enum_1.Role.MANAGER) {
            console.log("Only an MAnager  can delete a Task Assignment");
            return res
                .status(400)
                .json({
                Error: "Only an MAnager can delete a Task Assignment",
                assignedByManager,
            });
        }
        const deletedBugAssignment = yield prisma.taskAssigned.delete({
            where: { taskAssigned_id: taskId },
        });
        console.log("Deleted Bug Assignment", deletedBugAssignment);
        return res
            .status(200)
            .json({ Message: "Deleted Bug Assignment", deletedBugAssignment });
    }
    catch (error) {
        console.error("Error deleting a bug assignment", error);
        res.status(500).json({ Error: "Error deleting a bug assignment", error });
    }
});
exports.deleteBugAssignment = deleteBugAssignment;
