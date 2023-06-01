import { Request, Response } from "express";
import User from "../models/users.models";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import _ from "lodash";
import * as usersServices from "../services/users.services";

dotenv.config();

const SECRET_KEY = process.env.MITOCHONDRION_JWT_SECRET as string;

/**
 * Create a new user in the database
 */
export async function createUser(req: Request, res: Response) {
	try {
		const { name, email, password } = req.body;

		// Confirm user does not exist
		const existingUser = await usersServices.getUserByEmail(email);
		if (existingUser)
			return res
				.status(401)
				.json({ message: `User with email: ${email} already exists` });

		const user = new User({
			name,
			email,
			password,
		});
		await user.save();

		const token = jwt.sign(
			{ _id: user._id?.toString(), email: user.email },
			SECRET_KEY,
			{
				expiresIn: "2 days",
			}
		);

		res.cookie("Authorization", token);
		res.setHeader("Authorization", token);

		return res.status(201).json(_.omit(user.toObject(), ["password"]));
	} catch (err: any) {
		console.log(err);
		return res.status(500).json({ message: err.message });
	}
}

/**
 * Login a user
 */
export async function login(req: Request, res: Response) {
	try {
		const { email, password } = req.body;

		const user = await usersServices.getUserByEmail(email);
		if (!user) return res.status(404).json({ message: "User not found" });

		// Confirm password
		const isMatch = bcrypt.compareSync(password, user.password);

		if (isMatch) {
			const token = jwt.sign(
				{ _id: user._id?.toString(), email: user.email },
				SECRET_KEY,
				{
					expiresIn: "2 days",
				}
			);

			res.cookie("Authorization", token);
			res.setHeader("Authorization", token);

			return res.json(_.omit(user.toObject(), ["password"]));
		} else {
			return res.status(403).json({ message: "Invalid password" });
		}
	} catch (err: any) {
		console.log(err);
		return res.status(500).json({ message: err.message });
	}
}
