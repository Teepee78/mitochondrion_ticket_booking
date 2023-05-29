import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY: Secret = process.env.MITOCHONDRION_JWT_SECRET as string;

export interface CustomRequest extends Request {
	token: string | JwtPayload;
}

/**
 * Authentication middleware to verify tokens and authorize users
 */
export const auth = async (req: Request, res: Response, next: NextFunction) => {
	try {
		let token = req.header("Authorization");

		if (!token) {
			token = req.cookies["Authorization"];

			if (!token) {
				throw new Error("Token missing");
			}
		}

		const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;
		req.body.id = decoded._id;

		next();
	} catch (err) {
		res.status(401).send("Unauthorized to perform request.");
	}
};

export default auth;
