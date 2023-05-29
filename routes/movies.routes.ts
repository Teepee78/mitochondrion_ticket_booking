import {
	createMovie,
	getMovies,
	getMovieById,
	bookMovieSeats,
} from "../controllers/movies.controllers";
import { Router } from "express";
import { auth } from "../middlewares/auth.middlewares";

const router = Router();

router.post("", createMovie);
router.get("", getMovies);
router.get("/:id", getMovieById);
router.post("/book", auth, bookMovieSeats);

export default router;
