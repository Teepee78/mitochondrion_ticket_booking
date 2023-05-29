import {
	createMovie,
	getMovies,
	getMovieById,
} from "../controllers/movies.controllers";
import { Router } from "express";

const router = Router();

router.post("", createMovie);
router.get("", getMovies);
router.get("/:id", getMovieById);

export default router;
