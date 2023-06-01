"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.createUser = void 0;
const users_models_1 = __importDefault(require("../models/users.models"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const lodash_1 = __importDefault(require("lodash"));
const usersServices = __importStar(require("../services/users.services"));
dotenv_1.default.config();
const SECRET_KEY = process.env.MITOCHONDRION_JWT_SECRET;
/**
 * Create a new user in the database
 */
async function createUser(req, res) {
    try {
        const { name, email, password } = req.body;
        // Confirm user does not exist
        const existingUser = await usersServices.getUserByEmail(email);
        if (existingUser)
            return res
                .status(401)
                .json({ message: `User with email: ${email} already exists` });
        const user = new users_models_1.default({
            name,
            email,
            password,
        });
        await user.save();
        const token = jsonwebtoken_1.default.sign({ _id: user._id?.toString(), email: user.email }, SECRET_KEY, {
            expiresIn: "2 days",
        });
        res.cookie("Authorization", token);
        res.setHeader("Authorization", token);
        return res.status(201).json(lodash_1.default.omit(user.toObject(), ["password"]));
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
}
exports.createUser = createUser;
/**
 * Login a user
 */
async function login(req, res) {
    try {
        const { email, password } = req.body;
        const user = await usersServices.getUserByEmail(email);
        if (!user)
            return res.status(404).json({ message: "User not found" });
        // Confirm password
        const isMatch = bcryptjs_1.default.compareSync(password, user.password);
        if (isMatch) {
            const token = jsonwebtoken_1.default.sign({ _id: user._id?.toString(), email: user.email }, SECRET_KEY, {
                expiresIn: "2 days",
            });
            res.cookie("Authorization", token);
            res.setHeader("Authorization", token);
            return res.json(lodash_1.default.omit(user.toObject(), ["password"]));
        }
        else {
            return res.status(403).json({ message: "Invalid password" });
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
}
exports.login = login;
