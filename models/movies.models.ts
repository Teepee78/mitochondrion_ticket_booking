import mongoose from "mongoose";
import { I_MovieDocument } from ".";

const MovieSchema = new mongoose.Schema<I_MovieDocument>(
	{
		title: {
			type: String,
			required: true,
		},
		capacity: {
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

// mongoose middleware to set tickets to capacity before saving
MovieSchema.pre("save", async function (next) {
	const movie = this;

	if (movie.isModified("capacity")) {
		movie.availableTickets = movie.capacity - movie.tickets.length;
	}
	next();
});

export default mongoose.model<I_MovieDocument>("Movie", MovieSchema);
