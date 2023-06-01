import User from "../models/users.models";

/**
 * Get user by id from the database
 * @param {string} id User's id
 * @returns User
 */
export async function getUserById(id: string) {
	return await User.findById(id);
}

/**
 * Get user by email from the database
 * @param email User's email
 * @returns User
 */
export async function getUserByEmail(email: string) {
	return await User.findOne({ email });
}
