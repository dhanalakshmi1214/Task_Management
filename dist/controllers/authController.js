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
exports.refreshToken = exports.userLogin = void 0;
const client_1 = require("@prisma/client");
const argon2_1 = __importDefault(require("argon2"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotConfig_1 = require("../config/dotConfig");
const prisma = new client_1.PrismaClient();
let refreshTokens = [];
const userLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    console.log(`Login is attempted by users email id is ${email}`);
    try {
        const user = yield prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            console.log("Incorrect email ID");
            return res.status(401).json({ message: "Incorrect Email Id" });
        }
        console.log("User Found :", user);
        const isMatch = yield argon2_1.default.verify(user.password, password);
        if (isMatch) {
            const accessToken = jsonwebtoken_1.default.sign({ id: user.user_id, email: user.email }, dotConfig_1.SECRET_KEY, { expiresIn: "5m" });
            const refreshMyToken = jsonwebtoken_1.default.sign({ id: user.user_id, email: user.email }, dotConfig_1.REFRESH_SECRET_KEY, { expiresIn: "7d" });
            refreshTokens.push(refreshMyToken);
            res.status(200).json({ message: "Successful Login", accessToken, refreshMyToken });
        }
        else {
            res.status(401).json({ error: "Incorrect password" });
        }
    }
    catch (error) {
        console.error("Error is on server side ", error);
        res.status(500).json({ Error: "`Error is on server side", error });
    }
});
exports.userLogin = userLogin;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    if (!token) {
        return res.status(403).json({ error: "No token provided" });
    }
    if (!refreshTokens.includes(token)) {
        return res.status(403).json({ error: "Invalid tokens" });
    }
    jsonwebtoken_1.default.verify(token, dotConfig_1.REFRESH_SECRET_KEY, (err, decoded) => {
        if (err || !decoded) {
            return res.status(403).json({ error: "Invalid refresh tokens" });
        }
        const user = decoded;
        const accessToken = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, dotConfig_1.SECRET_KEY, { expiresIn: "7d" });
        res.json({ accessToken });
    });
});
exports.refreshToken = refreshToken;
