"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMovieById = exports.getAllMovies = void 0;
const movies_models_1 = __importDefault(require("../models/movies.models"));
/**
 * Get all movies from the database
 * @returns A list of all movies
 */
async function getAllMovies() {
    return await movies_models_1.default.find();
}
exports.getAllMovies = getAllMovies;
/**
 * Get movie from database
 * @param {string} id id of the movie
 * @returns Movie
 */
async function getMovieById(id) {
    return await movies_models_1.default.findById(id).populate("tickets");
}
exports.getMovieById = getMovieById;
