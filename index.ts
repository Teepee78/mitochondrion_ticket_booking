import express from "express";
import dotenv from "dotenv";
import semaphore from "semaphore";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";

// Import routes
import moviesRouter from "./routes/movies.routes";
import usersRouter from "./routes/users.routes";

// Load environment variables
dotenv.config();
// Setup semaphore
export let sem = semaphore(10);
// Get port
const PORT = (process.env.MITOCHONDRION_PORT || 3000) as number;

let app = express();
// Connect to database
let database_url = process.env.MITOCHONDRION_DATABASE as string;
mongoose
	.connect(database_url)
	.then(() => {
		console.log("Connected to database successfully");
	})
	.catch((err) => {
		console.log(`Error: ${err.message}`);
	});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.use("/movies", moviesRouter);
app.use("/users", usersRouter);

app.get("/", (req, res) => {
	return res.json({ status: "OK" });
});

const server = app.listen(PORT, () => {
	console.log(`Listening on port: ${PORT}`);
});

export default app;
export { server };
