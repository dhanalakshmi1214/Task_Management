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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.upateRoleByadmin = exports.getAllUser = exports.createUser = void 0;
const client_1 = require("@prisma/client");
const enum_1 = require("../enums/enum");
const argon2_1 = __importDefault(require("argon2"));
const prisma = new client_1.PrismaClient();
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password, role } = req.body;
    try {
        // const saltRounds = 10;
        const hashedPassword = yield argon2_1.default.hash(password);
        console.log(hashedPassword);
        const newUser = yield prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                role: role,
            },
        });
        console.log("New user has been created ", newUser);
        res.status(200).json({ Message: 'New user has been created ', newUser });
    }
    catch (error) {
        console.error("Error creating a user", error);
        res.status(500).json({ message: "Error creating a user", error });
    }
});
exports.createUser = createUser;
const getAllUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getUser = yield prisma.user.findMany();
        res.status(201).json({ Message: "All the users are listed", getUser });
        console.log("All the users are listed", getUser);
    }
    catch (error) {
        console.error("Error getting all user", error);
        res.status(500).json({ error: "Error getting a user" });
    }
});
exports.getAllUser = getAllUser;
// update the user role by admin
const upateRoleByadmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminId = parseInt(req.params.adminId);
    const { targetId, role } = req.body;
    try {
        const updateByAdmin = yield prisma.user.findUnique({
            where: { user_id: adminId },
        });
        if (!updateByAdmin || updateByAdmin.role !== enum_1.Role.ADMIN) {
            console.log("Only an Admin can update a Role for the user");
            return res
                .status(400)
                .json({
                Error: "Only an Admin can update a Role for the user",
                updateByAdmin,
            });
        }
        const updateRole = yield prisma.user.update({
            where: { user_id: parseInt(targetId) },
            data: {
                role: role,
            },
        });
        console.log("Updated Role by Admin", updateRole);
        return res
            .status(200)
            .json({ Message: "Updated Role by Admin", updateRole });
    }
    catch (error) {
        console.error("Error updating a Role by admin", error);
        res.status(500).json({ Error: "Error updating a Role by admin", error });
    }
});
exports.upateRoleByadmin = upateRoleByadmin;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { username, email, password } = req.body;
    try {
        const updateUser = yield prisma.user.update({
            where: { user_id: parseInt(userId) },
            data: { username, email, password },
        });
        console.log("Updated the user with the details", updateUser);
        res
            .status(200)
            .json({
            Message: "Updated the user with the details ", updateUser,
        });
    }
    catch (error) {
        console.error("Error updating a bug", error);
        res.status(500).json({ Error: "Error updating a bug", error });
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminId = parseInt(req.params.adminId);
    const { targetUserId } = req.body;
    console.log(`Deleting the user with userId ${adminId}`);
    try {
        const deleteByAdmin = yield prisma.user.findUnique({
            where: { user_id: adminId },
        });
        if (!deleteByAdmin || deleteByAdmin.role !== enum_1.Role.ADMIN) {
            console.log("Only an Admin can delete the user", deleteByAdmin);
            return res
                .status(400)
                .json({ Error: "Only an Admin can delete the user", deleteByAdmin });
        }
        if (!targetUserId) {
            return res
                .status(400)
                .json({ Error: "No target user ID provided for deletion" });
        }
        const targetUser = yield prisma.user.findUnique({
            where: { user_id: targetUserId },
        });
        if (!targetUser) {
            return res.status(404).json({ Error: "User to be deleted not found" });
        }
        const deleteUser = yield prisma.user.delete({
            where: { user_id: parseInt(targetUserId) },
        });
        console.log("Deleted user", deleteUser);
        res.status(200).json({ Message: "Deleted user ", deleteUser });
    }
    catch (error) {
        const errorMessage = error.message;
        console.error("Error deleting the user", errorMessage);
        res.status(500).json({ error: "Error deleting the user" });
    }
});
exports.deleteUser = deleteUser;
