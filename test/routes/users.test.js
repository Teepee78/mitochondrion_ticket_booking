const request = require("supertest");
const app = require("../../dist/index.js");
const { server } = require("../../dist/index.js");
const assert = require("chai").assert;
const expect = require("chai").expect;
const sinon = require("sinon");
const usersServices = require("../../dist/services/users.services.js");
const User = require("mongoose").model("User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

describe("users.routes.ts", () => {
	describe("POST /signup", () => {
		it("should return 401 if user exists", (done) => {
			sinon.replace(
				usersServices,
				"getUserByEmail",
				sinon.fake(() => true)
			);

			request(server)
				.post("/users/signup")
				.send({
					name: "Toluwalase",
					email: "toluwalase@gmail.com",
					password: "1234567",
				})
				.expect("Content-Type", /json/)
				.expect(401)
				.then(
					(response) => {
						// success
						assert.equal(
							response.body.message,
							"User with email: toluwalase@gmail.com already exists"
						);
						sinon.restore();
						done();
					},
					(error) => {
						// error
						console.log(error);
						sinon.restore();
						done();
					}
				);
		});

		it("should create user successfully", (done) => {
			sinon.replace(
				usersServices,
				"getUserByEmail",
				sinon.fake(() => false)
			);
			sinon.replace(
				jwt,
				"sign",
				sinon.fake(() => "123456")
			);
			const saveStub = sinon.stub(User.prototype, "save");

			request(server)
				.post("/users/signup")
				.send({
					name: "Toluwalase",
					email: "toluwalase@gmail.com",
					password: "1234567",
				})
				.expect("Content-Type", /json/)
				.expect("Authorization", "123456")
				.expect(201)
				.then(
					(response) => {
						// success
						const cookies = response.headers["set-cookie"];
						expect(cookies[0]).to.include("Authorization=123456");
						expect(response.body).to.have.keys([
							"name",
							"email",
							"tickets",
							"_id",
						]);
						expect(response.body).to.not.have.key("password");
						sinon.restore();
						saveStub.restore();
						done();
					},
					(error) => {
						// error
						console.log(error);
						sinon.restore();
						saveStub.restore();
						done();
					}
				);
		});
	});

	describe("POST /login", () => {
		it("should return 404 if user doesn't exist", (done) => {
			sinon.replace(
				usersServices,
				"getUserByEmail",
				sinon.fake(() => false)
			);

			request(server)
				.post("/users/login")
				.send({
					name: "Toluwalase",
					email: "toluwalase@gmail.com",
					password: "1234567",
				})
				.expect("Content-Type", /json/)
				.expect(404)
				.then(
					(response) => {
						// success
						assert.equal(response.body.message, "User not found");
						sinon.restore();
						done();
					},
					(error) => {
						// error
						console.log(error);
						sinon.restore();
						done();
					}
				);
		});

		it("should return 403 if password is incorrect", (done) => {
			sinon.replace(
				usersServices,
				"getUserByEmail",
				sinon.fake(() => {
					return {
						name: "Toluwalase",
						email: "toluwalase@gmail.com",
						password: "1234567",
					};
				})
			);
			sinon.replace(
				bcrypt,
				"compareSync",
				sinon.fake((password1, password2) => {
					if (password1 !== password2) return false;
				})
			);

			request(server)
				.post("/users/login")
				.send({
					name: "Toluwalase",
					email: "toluwalase@gmail.com",
					password: "12345678",
				})
				.expect("Content-Type", /json/)
				.expect(403)
				.then(
					(response) => {
						// success
						assert.equal(response.body.message, "Invalid password");
						sinon.restore();
						done();
					},
					(error) => {
						// error
						console.log(error);
						sinon.restore();
						done();
					}
				);
		});

		it("should login user user successfully", (done) => {
			sinon.replace(
				usersServices,
				"getUserByEmail",
				sinon.fake(() => {
					return {
						name: "Toluwalase",
						email: "toluwalase@gmail.com",
						password: "1234567",
						toObject: function () {
							return {
								name: "Toluwalase",
								email: "toluwalase@gmail.com",
								password: "1234567",
							};
						},
					};
				})
			);
			sinon.replace(
				bcrypt,
				"compareSync",
				sinon.fake((password1, password2) => true)
			);
			sinon.replace(
				jwt,
				"sign",
				sinon.fake(() => "123456")
			);

			request(server)
				.post("/users/login")
				.send({
					name: "Toluwalase",
					email: "toluwalase@gmail.com",
					password: "1234567",
				})
				.expect("Content-Type", /json/)
				.expect("Authorization", "123456")
				.expect(200)
				.then(
					(response) => {
						// success
            const cookies = response.headers["set-cookie"];
            expect(cookies[0]).to.include("Authorization=123456");
						expect(response.body).to.have.keys([
							"name",
							"email",
						]);
            expect(response.body).to.not.have.key("password");
						sinon.restore();
						done();
					},
					(error) => {
						// error
						console.log(error);
						sinon.restore();
						done();
					}
				);
		});
	});
});
