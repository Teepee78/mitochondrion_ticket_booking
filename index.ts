import express from "express";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;
let app = express();

app.get("/", (req, res) => {
	return res.json({ status: "OK" });
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
