"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotConfig_1 = require("./config/dotConfig");
const userRouters_1 = __importDefault(require("./routers/userRouters"));
const authRouters_1 = __importDefault(require("./routers/authRouters"));
const taskRouters_1 = __importDefault(require("./routers/taskRouters"));
const taskAssignRouters_1 = __importDefault(require("./routers/taskAssignRouters"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/users", userRouters_1.default);
app.use("/login", authRouters_1.default);
app.use("/task", taskRouters_1.default);
app.use("taskAssigned", taskAssignRouters_1.default);
app.listen(dotConfig_1.PORT, () => {
    console.log(`Server is running on the port ${dotConfig_1.PORT}`);
});
exports.default = app;
