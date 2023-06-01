"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SECRET_KEY = process.env.MITOCHONDRION_JWT_SECRET;
/**
 * Authentication middleware to verify tokens and authorize users
 */
const auth = async (req, res, next) => {
    try {
        let token = req.header("Authorization");
        if (!token) {
            token = req.cookies["Authorization"];
            if (!token) {
                throw new Error("Token missing");
            }
        }
        const decoded = jsonwebtoken_1.default.verify(token, SECRET_KEY);
        req.body.id = decoded._id;
        next();
    }
    catch (err) {
        res.status(401).send("Unauthorized to perform request.");
    }
};
exports.auth = auth;
exports.default = exports.auth;
