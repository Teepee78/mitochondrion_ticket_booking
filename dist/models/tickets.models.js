"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const TicketSchema = new mongoose_1.default.Schema({
    number: {
        type: Number,
        required: true,
    },
    movieId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Movie",
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
}, { timestamps: true, versionKey: false });
exports.default = mongoose_1.default.model("Ticket", TicketSchema);
