const request = require("supertest");
const { server } = require("../../dist/index.js");
const assert = require("chai").assert;
const expect = require("chai").expect;
const sinon = require("sinon");
const Movie = require("mongoose").model("Movie");
const Ticket = require("mongoose").model("Ticket");
const User = require("mongoose").model("User");
const moviesServices = require("../../dist/services/movies.services.js");
const usersServices = require("../../dist/services/users.services.js");
const jwt = require("jsonwebtoken");

describe("movies.routes.ts", () => {
	describe("POST /movies", () => {
		it("should create a new movie successfully", (done) => {
			const stub = sinon.stub(Movie.prototype, "save");

			request(server)
				.post("/movies")
				.send({
					title: "A man from HongKong",
					capacity: 100,
				})
				.expect("Content-Type", /json/)
				.expect(201)
				.end((err, response) => {
					if (err) console.log(err);
					stub.restore();
					done();
				});
		});
	});

	describe("GET /movies", () => {
		it("should return all the movies in the database", (done) => {
			sinon.replace(
				moviesServices,
				"getAllMovies",
				sinon.fake(async () => [])
			);

			request(server)
				.get("/movies")
				.expect("Content-Type", /json/)
				.expect(200)
				.end((err, response) => {
					if (err) console.log(err);
					else {
						expect(response.body).to.have.keys(["length", "movies"]);
					}
					sinon.restore();
					done();
				});
		});
	});

	describe("GET /movies/:id", () => {
		it("should return a particular movie in the database", (done) => {
			sinon.replace(
				moviesServices,
				"getMovieById",
				sinon.fake(async () => {
					return {
						_id: "6473f9a85a816affb94e30e5",
						title: "The man from HongKong",
						capacity: 50,
						availableTickets: 43,
						tickets: [
							{
								_id: "647403384239ca3eeeb3ca64",
								number: 1,
								movieId: "6473f9a85a816affb94e30e5",
								userId: "6473efc351a3bfa6d91159b3",
								createdAt: "2023-05-29T01:43:20.284Z",
								updatedAt: "2023-05-29T01:43:20.284Z",
							},
							{
								_id: "647403524239ca3eeeb3ca6a",
								number: 2,
								movieId: "6473f9a85a816affb94e30e5",
								userId: "6473efc351a3bfa6d91159b3",
								createdAt: "2023-05-29T01:43:46.272Z",
								updatedAt: "2023-05-29T01:43:46.272Z",
							},
							{
								_id: "647403524239ca3eeeb3ca6e",
								number: 3,
								movieId: "6473f9a85a816affb94e30e5",
								userId: "6473efc351a3bfa6d91159b3",
								createdAt: "2023-05-29T01:43:46.834Z",
								updatedAt: "2023-05-29T01:43:46.834Z",
							},
							{
								_id: "64740392e33fe6456121d12f",
								number: 4,
								movieId: "6473f9a85a816affb94e30e5",
								userId: "6473efc351a3bfa6d91159b3",
								createdAt: "2023-05-29T01:44:50.093Z",
								updatedAt: "2023-05-29T01:44:50.093Z",
							},
							{
								_id: "64740392e33fe6456121d133",
								number: 5,
								movieId: "6473f9a85a816affb94e30e5",
								userId: "6473efc351a3bfa6d91159b3",
								createdAt: "2023-05-29T01:44:50.658Z",
								updatedAt: "2023-05-29T01:44:50.658Z",
							},
							{
								_id: "64740448bd5dc016d9239ff3",
								number: 6,
								movieId: "6473f9a85a816affb94e30e5",
								userId: "6473efc351a3bfa6d91159b3",
								createdAt: "2023-05-29T01:47:52.499Z",
								updatedAt: "2023-05-29T01:47:52.499Z",
							},
							{
								_id: "64740449bd5dc016d9239ff7",
								number: 7,
								movieId: "6473f9a85a816affb94e30e5",
								userId: "6473efc351a3bfa6d91159b3",
								createdAt: "2023-05-29T01:47:53.070Z",
								updatedAt: "2023-05-29T01:47:53.070Z",
							},
						],
						createdAt: "2023-05-29T01:02:32.647Z",
						updatedAt: "2023-05-29T01:47:53.257Z",
					};
				})
			);

			request(server)
				.get("/movies/6473f9a85a816affb94e30e5")
				.expect("Content-Type", /json/)
				.expect(200)
				.end((err, response) => {
					if (err) console.log(err);
					else {
						expect(response.body).to.have.keys([
							"_id",
							"title",
							"capacity",
							"availableTickets",
							"tickets",
							"createdAt",
							"updatedAt",
						]);
						expect(typeof response.body.tickets).to.be.equal("object");
					}
					sinon.restore();
					done();
				});
		});

		it("should return 404 if movie not in the database", (done) => {
			sinon.replace(
				moviesServices,
				"getMovieById",
				sinon.fake(async () => {
					throw Error;
				})
			);

			request(server)
				.get("/movies/6473f9a85a816affb94e30e5")
				.expect("Content-Type", /json/)
				.expect(404)
				.end((err, response) => {
					if (err) console.log(err);
					else {
						expect(response.body).to.not.have.keys([
							"_id",
							"title",
							"capacity",
							"availableTickets",
							"tickets",
							"createdAt",
							"updatedAt",
						]);
						expect(response.body.message).to.equal(
							"Movie not found, try a different id"
						);
					}
					sinon.restore();
					done();
				});
		});
	});

	describe("POST /movies/book", () => {
		it("should return 401 when authentication token is not provided", () => {
			request(server).post("/movies/book").expect(401);
		});

		it("should return 404 if movie doesn't exist", () => {
			sinon.replace(
				jwt,
				"verify",
				sinon.fake(() => {
					return { _id: "123" };
				})
			);
			sinon.replace(
				moviesServices,
				"getMovieById",
				sinon.fake(async () => false)
			);

			request(server)
				.post("/movies/book")
				.query({ movieId: "456", seats: "2" })
				.set("Authorization", "Token")
				.expect(404)
				.expect("Content-Type", /json/);

			sinon.restore();
		});

		it("should return 406 if movie has no tickets left", () => {
			sinon.replace(
				jwt,
				"verify",
				sinon.fake(() => {
					return { _id: "123" };
				})
			);
			sinon.replace(
				moviesServices,
				"getMovieById",
				sinon.fake(async () => {
					return {
						availableTickets: 0,
					};
				})
			);
			sinon.replace(
				usersServices,
				"getUserById",
				sinon.fake(async () => {
					return {
						tickets: [],
					};
				})
			);

			request(server)
				.post("/movies/book")
				.query({ movieId: "456", seats: "2" })
				.set("Authorization", "Token")
				.expect(406)
				.expect("Content-Type", /json/);

			sinon.restore();
		});

		it("should return 406 if seats requested is greater than availableTickets", () => {
			sinon.replace(
				jwt,
				"verify",
				sinon.fake(() => {
					return { _id: "123" };
				})
			);
			sinon.replace(
				moviesServices,
				"getMovieById",
				sinon.fake(async () => {
					return {
						availableTickets: 1,
					};
				})
			);
			sinon.replace(
				usersServices,
				"getUserById",
				sinon.fake(async () => {
					return {
						tickets: [],
					};
				})
			);

			request(server)
				.post("/movies/book")
				.query({ movieId: "456", seats: "2" })
				.set("Authorization", "Token")
				.expect(406)
				.expect("Content-Type", /json/);

			sinon.restore();
		});

		it("should book ticket successfully", () => {
			sinon.replace(
				jwt,
				"verify",
				sinon.fake(() => {
					return { _id: "123" };
				})
			);
			sinon.replace(
				moviesServices,
				"getMovieById",
				sinon.fake(async () => {
					return {
						capacity: 10,
						availableTickets: 10,
						tickets: [],
					};
				})
			);
			sinon.replace(
				usersServices,
				"getUserById",
				sinon.fake(async () => {
					return {
						tickets: [],
					};
				})
			);
			const ticketStub = sinon.stub(Ticket.prototype, "save");
			const movieStub = sinon.stub(Movie.prototype, "save");
			const userStub = sinon.stub(User.prototype, "save");

			request(server)
				.post("/movies/book")
				.query({ movieId: "456", seats: 1 })
				.set("Authorization", "Token")
				.expect(201)
				.expect("Content-Type", /json/)
				.end((err, response) => {
					if (err) console.log(err);
					else {
						expect(response.body).to.have.keys(["message", "tickets"]);
					}

					sinon.restore();
					ticketStub.restore();
					movieStub.restore();
					userStub.restore();
				});
		});

		it.skip("should book ticket successfully", async () => {
			sinon.replace(
				jwt,
				"verify",
				sinon.fake(() => {
					return { _id: "123" };
				})
			);
			sinon.replace(
				moviesServices,
				"getMovieById",
				sinon.fake(async () => {
					return {
						capacity: 10,
						availableTickets: 10,
						tickets: [],
					};
				})
			);
			sinon.replace(
				usersServices,
				"getUserById",
				sinon.fake(async () => {
					return {
						tickets: [],
					};
				})
			);
			const ticketStub = sinon.stub(Ticket.prototype, "save");
			const movieStub = sinon.stub(Movie.prototype, "save");
			const userStub = sinon.stub(User.prototype, "save");

			const requests = [];

			for (let i = 0; i < 20; i++) {
				const request = request(server)
					.post("/movies/book")
					.query({ movieId: "456", seats: 1 })
					.set("Authorization", "Token");

				requests.push(request);
			}
			console.log(requests);
			// Make the requests concurrently
			const responses = await Promise.all(
				requests.map((req) => req.expect(201))
			);
			for (let request of responses) {
				console.log(request);
			}
			// .end((err, response) => {
			// 	if (err) console.log(err);
			// 	else {
			// 		expect(response.body).to.have.keys(["message", "tickets"]);
			// 	}
			// });

			sinon.restore();
			ticketStub.restore();
			movieStub.restore();
			userStub.restore();
		});
	});
});
