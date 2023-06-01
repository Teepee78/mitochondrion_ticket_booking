"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookMovieSeats = exports.getMovieById = exports.getMovies = exports.createMovie = void 0;
const movies_models_1 = __importDefault(require("../models/movies.models"));
const tickets_models_1 = __importDefault(require("../models/tickets.models"));
const __1 = require("..");
const moviesServices = __importStar(require("../services/movies.services"));
const usersServices = __importStar(require("../services/users.services"));
/**
 * Create a new movie in the database
 */
async function createMovie(req, res) {
    try {
        const { title, capacity } = req.body;
        const movie = new movies_models_1.default({ title, capacity });
        await movie.save();
        return res.status(201).json(movie);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
}
exports.createMovie = createMovie;
/**
 * Get all movies in the database
 */
async function getMovies(req, res) {
    try {
        // Get movies from database
        const movies = await moviesServices.getAllMovies();
        return res.json({ length: movies.length, movies: movies });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
}
exports.getMovies = getMovies;
/**
 * Get a movie in the database
 */
async function getMovieById(req, res) {
    try {
        const { id } = req.params;
        try {
            const movie = await moviesServices.getMovieById(id);
            return res.json(movie);
        }
        catch (err) {
            return res
                .status(404)
                .json({ message: "Movie not found, try a different id" });
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
}
exports.getMovieById = getMovieById;
/**
 * Book seats to a movie
 */
async function bookMovieSeats(req, res) {
    try {
        const { movieId } = req.query;
        const seats = Number(req.query.seats);
        const userId = req.body.id;
        // Get movie
        const movie = await moviesServices.getMovieById(movieId);
        if (!movie)
            return res.status(404).json({ message: "Movie not found" });
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
        __1.sem.take(async () => {
            let tickets = [];
            // create ticket for each seat
            for (let i = 0; i < seats; i++) {
                let ticket = new tickets_models_1.default({
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
                user.tickets.push(ticket._id);
                await user.save();
                availableTickets = movie.availableTickets;
            }
            __1.sem.leave();
            return res.status(201).json({
                message: `${seats} Ticket(s) for ${movie.title} created successfully`,
                tickets: tickets,
            });
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
}
exports.bookMovieSeats = bookMovieSeats;
