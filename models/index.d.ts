import { Types } from "mongoose";

export interface I_MovieDocument {
	title: string;
	numberOfTickets: number;
	availableTickets: number;
	tickets: Array<Types.ObjectId>;
}

export interface I_TicketDocument {
	number: number;
	movieId: Types.ObjectId;
	userId: Types.ObjectId;
}

export interface I_UserDocument {
	name: string;
	email: string;
	password: string;
	tickets: Array<Types.ObjectId>;
}
