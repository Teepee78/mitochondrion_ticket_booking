"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByEmail = exports.getUserById = void 0;
const users_models_1 = __importDefault(require("../models/users.models"));
/**
 * Get user by id from the database
 * @param {string} id User's id
 * @returns User
 */
async function getUserById(id) {
    return await users_models_1.default.findById(id);
}
exports.getUserById = getUserById;
/**
 * Get user by email from the database
 * @param email User's email
 * @returns User
 */
async function getUserByEmail(email) {
    return await users_models_1.default.findOne({ email });
}
exports.getUserByEmail = getUserByEmail;
