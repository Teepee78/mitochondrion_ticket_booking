import mongoose from "mongoose";
import { I_UserDocument } from ".";
import bcrypt from "bcryptjs";

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

// bcrypt salt rounds
const saltRounds = 8;

// mongoose middleware to alter password before saving
UserSchema.pre("save", async function (next) {
	const user = this;

	if (user.isModified("password")) {
		user.password = await bcrypt.hash(user.password, saltRounds);
	}
	next();
});

export default mongoose.model<I_UserDocument>("User", UserSchema);
