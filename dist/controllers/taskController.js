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
exports.deleteTask = exports.updateTask = exports.getAllTask = exports.createTask = void 0;
const enum_1 = require("../enums/enum");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, due_date, managerId } = req.body;
    try {
        const createBuyByManager = yield prisma.user.findUnique({
            where: { user_id: managerId },
        });
        console.log(createBuyByManager);
        if (!createBuyByManager || createBuyByManager.role !== enum_1.Role.MANAGER) {
            console.error("Only a Tester can create a Bug", createBuyByManager);
            return res.status(400).json({ Error: "Only a Tester can create a Bug", createBuyByManager });
        }
        const newTask = yield prisma.task.create({
            data: { title, description, due_date,
                user: { connect: { user_id: managerId } },
            },
        });
        console.log("New Task created", newTask);
        res.status(200).json({ Message: "New Task created", newTask });
    }
    catch (error) {
        console.error("Error creating a Task", error);
        res.status(500).json({ Error: "Error creating a Task", error });
    }
});
exports.createTask = createTask;
const getAllTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getBugs = yield prisma.task.findMany();
        console.log("All the tasks are listed", getBugs);
        res.status(200).json({ Message: "All the tasks are listed", getBugs });
    }
    catch (error) {
        console.error("Error getting task", error);
        res.status(500).json({ Error: "Error getting task", error });
    }
});
exports.getAllTask = getAllTask;
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.params.userId);
    const taskId = parseInt(req.params.taskId);
    const { title, description, due_date } = req.body;
    try {
        const updateByUser = yield prisma.user.findUnique({
            where: { user_id: userId },
        });
        if (!updateByUser || (updateByUser.role !== enum_1.Role.MANAGER && updateByUser.role !== enum_1.Role.ADMIN)) {
            console.log("Only a Tester or Admin can update a Task");
            return res
                .status(400)
                .json({
                Error: "Only a Tester or Admin can update a Task",
                updateByUser,
            });
        }
        const updateTaskList = yield prisma.task.update({
            where: { task_id: taskId },
            data: { title, description, due_date },
        });
        console.log("Updated Task", updateTaskList);
        return res.status(200).json({ Message: "Updated Task", updateTaskList });
    }
    catch (error) {
        console.error("Error updating a Task", error);
        res.status(500).json({ Error: "Error updating a Task", error });
    }
});
exports.updateTask = updateTask;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.params.userId);
    const taskId = parseInt(req.params.taskId);
    try {
        const deleteByUser = yield prisma.user.findUnique({ where: { user_id: userId } });
        if (!deleteByUser || (deleteByUser.role !== enum_1.Role.MANAGER && deleteByUser.role !== enum_1.Role.ADMIN)) {
            console.log("Only a Tester or Admin can delete a Task");
            return res.status(400).json({ Error: "Only a Tester or Admin can delete a Task", deleteByUser });
        }
        const deletingBug = yield prisma.task.delete({
            where: { task_id: taskId },
        });
        console.log("Deleted the Task", deletingBug);
        return res.status(200).json({ Message: "Deleted the Task", deletingBug });
    }
    catch (error) {
        console.error("Error deleting a Task", error);
        res.status(500).json({ Error: "Error deleting a Task", error });
    }
});
exports.deleteTask = deleteTask;
