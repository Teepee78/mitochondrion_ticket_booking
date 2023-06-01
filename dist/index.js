"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.sem = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const semaphore_1 = __importDefault(require("semaphore"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
// Import routes
const movies_routes_1 = __importDefault(require("./routes/movies.routes"));
const users_routes_1 = __importDefault(require("./routes/users.routes"));
// Load environment variables
dotenv_1.default.config();
// Setup semaphore
exports.sem = (0, semaphore_1.default)(10);
// Get port
const PORT = (process.env.MITOCHONDRION_PORT || 3000);
let app = (0, express_1.default)();
// Connect to database
let database_url = process.env.MITOCHONDRION_DATABASE;
mongoose_1.default
    .connect(database_url)
    .then(() => {
    console.log("Connected to database successfully");
})
    .catch((err) => {
    console.log(`Error: ${err.message}`);
});
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// routes
app.use("/movies", movies_routes_1.default);
app.use("/users", users_routes_1.default);
app.get("/", (req, res) => {
    return res.json({ status: "OK" });
});
const server = app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});
exports.server = server;
exports.default = app;
