"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const MovieSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    capacity: {
        type: Number,
        required: true,
    },
    availableTickets: {
        type: Number,
        required: true,
        default: 0,
    },
    tickets: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Ticket" }],
}, { timestamps: true, versionKey: false });
// mongoose middleware to set tickets to capacity before saving
MovieSchema.pre("save", async function (next) {
    const movie = this;
    if (movie.isModified("capacity")) {
        movie.availableTickets = movie.capacity - movie.tickets.length;
    }
    next();
});
exports.default = mongoose_1.default.model("Movie", MovieSchema);
