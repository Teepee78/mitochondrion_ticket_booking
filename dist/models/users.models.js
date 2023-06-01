"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const UserSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    tickets: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Ticket" }],
}, { timestamps: true, versionKey: false });
// bcrypt salt rounds
const saltRounds = 8;
// mongoose middleware to alter password before saving
UserSchema.pre("save", async function (next) {
    const user = this;
    if (user.isModified("password")) {
        user.password = await bcryptjs_1.default.hash(user.password, saltRounds);
    }
    next();
});
exports.default = mongoose_1.default.model("User", UserSchema);
