import { Request, Response } from "express";
import Movie from "../models/movies.models";
import { I_MovieDocument } from "../models";

/**
 * Create a new movie in the database
 */
export async function createMovie(req: Request, res: Response) {
	try {
		const { title, tickets } = req.body;

		const movie = new Movie({ title, numberOfTickets: tickets });
		await movie.save();

		return res.status(201).json(movie);
	} catch (err) {
		console.log(err);
	}
}

/**
 * Get all movies in the database
 */
export async function getMovies(req: Request, res: Response) {
	try {
		// Get movies from database
		const movies = await Movie.find();

		return res.json({ length: movies.length, movies: movies });
	} catch (err) {
		console.log(err);
	}
}

/**
 * Get a movie in the database
 */
export async function getMovieById(req: Request, res: Response) {
	try {
		const { id } = req.params;

		const movie = await Movie.findById(id);

		return res.json(movie)
	} catch (err) {
		console.log(err);
	}
}
