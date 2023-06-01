import { Request, Response } from "express";
import Movie from "../models/movies.models";
import Ticket from "../models/tickets.models";
import { sem } from "..";
import { I_TicketDocument } from "../models";
import * as moviesServices from "../services/movies.services";
import * as usersServices from "../services/users.services";

/**
 * Create a new movie in the database
 */
export async function createMovie(req: Request, res: Response) {
	try {
		const { title, capacity } = req.body;

		const movie = new Movie({ title, capacity });
		await movie.save();

		return res.status(201).json(movie);
	} catch (err: any) {
		console.log(err);
		return res.status(500).json({ message: err.message });
	}
}

/**
 * Get all movies in the database
 */
export async function getMovies(req: Request, res: Response) {
	try {
		// Get movies from database
		const movies = await moviesServices.getAllMovies();

		return res.json({ length: movies.length, movies: movies });
	} catch (err: any) {
		console.log(err);
		return res.status(500).json({ message: err.message });
	}
}

/**
 * Get a movie in the database
 */
export async function getMovieById(req: Request, res: Response) {
	try {
		const { id } = req.params;

		const movie = await moviesServices.getMovieById(id);

		return res.json(movie);
	} catch (err: any) {
		console.log(err);
		return res.status(500).json({ message: err.message });
	}
}

/**
 * Book seats to a movie
 */
export async function bookMovieSeats(req: Request, res: Response) {
	try {
		const { movieId } = req.query;
		const seats = Number(req.query.seats);
		const userId = req.body.id;

		// Get movie
		const movie = await moviesServices.getMovieById(movieId as string);
		if (!movie) return res.status(404).json({ message: "Movie not found" });

		// Get user
		const user = await usersServices.getUserById(userId);

		// Make sure there are enough available tickets for requested seats
		// and movie isn't sold out
		let availableTickets = movie.availableTickets;
		if (availableTickets <= 0)
			return res.status(406).json({ message: "Movie sold out" });
		if (seats > availableTickets && availableTickets > 0)
			return res.status(406).json({
				message: "Not enough seats available to meet requested seats",
			});

		sem.take(async () => {
			let tickets: Array<I_TicketDocument> = [];
			// create ticket for each seat
			for (let i = 0; i < seats; i++) {
				let ticket = new Ticket({
					number: movie.capacity - availableTickets + 1,
					movieId: movie?.id,
					userId: userId,
				});

				// update references to ticket
				await ticket.save();
				tickets.push(ticket);
				movie.availableTickets -= 1;
				movie.tickets.push(ticket._id);
				await movie?.save();
				user!.tickets.push(ticket._id);
				await user!.save();
				availableTickets = movie.availableTickets;
			}

			sem.leave();

			return res.status(201).json({
				message: `${seats} Ticket(s) for ${movie.title} created successfully`,
				tickets: tickets,
			});
		});
	} catch (err: any) {
		console.log(err);
		return res.status(500).json({ message: err.message });
	}
}
