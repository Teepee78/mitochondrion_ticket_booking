import mongoose from "mongoose";
import { I_MovieDocument } from ".";

const MovieSchema = new mongoose.Schema<I_MovieDocument>(
	{
		title: {
			type: String,
			required: true,
		},
		numberOfTickets: {
			type: Number,
			required: true,
		},
		availableTickets: {
			type: Number,
			required: true,
			default: 0,
		},
		tickets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ticket" }],
	},

	{ timestamps: true, versionKey: false }
);

export default mongoose.model<I_MovieDocument>("Movie", MovieSchema);
