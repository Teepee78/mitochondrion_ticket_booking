import mongoose from "mongoose";
import { I_TicketDocument } from ".";

const TicketSchema = new mongoose.Schema<I_TicketDocument>(
	{
		number: {
			type: Number,
			required: true,
		},
		movieId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Movie",
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	},

	{ timestamps: true, versionKey: false }
);

export default mongoose.model<I_TicketDocument>("Ticket", TicketSchema);
