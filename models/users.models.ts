import mongoose from "mongoose";
import { I_UserDocument } from ".";

const UserSchema = new mongoose.Schema<I_UserDocument>(
	{
		name: {
			type: String,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		tickets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ticket" }],
	},

	{ timestamps: true, versionKey: false }
);

export default mongoose.model<I_UserDocument>("User", UserSchema);
