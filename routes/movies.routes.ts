import {
	createMovie,
	getMovies,
	getMovieById,
} from "../controllers/movies.controllers";
import { Router } from "express";
import { auth } from "../middlewares/auth.middlewares";

const router = Router();

router.post("", createMovie);
router.get("", auth, getMovies);
router.get("/:id", getMovieById);

export default router;
