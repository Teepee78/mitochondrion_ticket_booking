import Movie from "../models/movies.models";

/**
 * Get all movies from the database
 * @returns A list of all movies
 */
export async function getAllMovies() {
	return await Movie.find();
}

/**
 * Get movie from database
 * @param {string} id id of the movie
 * @returns Movie
 */
export async function getMovieById(id: string) {
	return await Movie.findById(id).populate("tickets");
}
