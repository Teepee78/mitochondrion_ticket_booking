# Ticket Booking API

This is a Ticket Booking API built with TypeScript and Express.

## Prerequisites

Before running the API, ensure you have the following installed:

- Node.js (version 19.0.1)
- npm (version 9.1.3)

## Live link for testing

https://mitochondrion-ticket-booking.vercel.app/

## Getting Started

1. Clone the repository:

   ```shell
   git clone https://github.com/Teepee78/mitochondrion_ticket_booking
   ```

2. Install dependencies:

   ```shell
   npm install
   ```

3. Start the development server:

   ```shell
   npm start
   ```

   The API will be accessible at http://localhost:3000.

## API Endpoints

### `POST /movies`

Create a new movie.

#### Request

- Body:

  ```json
  {
  	"title": "The man from HongKong",
  	"capacity": 50
  }
  ```

- Response:

  ```json
  {
  	"title": "The man from HongKong",
  	"capacity": 50,
  	"availableTickets": 50,
  	"tickets": [],
  	"_id": "64790afc3a55a6f97fb28c64",
  	"createdAt": "2023-06-01T21:17:48.320Z",
  	"updatedAt": "2023-06-01T21:17:48.320Z"
  }
  ```

### `GET /movies`

Get all movies in the database.

#### Request

- Response:

  ```json
  {
  	"length": 1,
  	"movies": [
  		{
  			"_id": "6473f9a85a816affb94e30e5",
  			"title": "The man from HongKong",
  			"capacity": 50,
  			"availableTickets": 43,
  			"tickets": [
  				"647403384239ca3eeeb3ca64",
  				"647403524239ca3eeeb3ca6a",
  				"647403524239ca3eeeb3ca6e",
  				"64740392e33fe6456121d12f",
  				"64740392e33fe6456121d133",
  				"64740448bd5dc016d9239ff3",
  				"64740449bd5dc016d9239ff7"
  			],
  			"createdAt": "2023-05-29T01:02:32.647Z",
  			"updatedAt": "2023-05-29T01:47:53.257Z"
  		}
  	]
  }
  ```

### `GET /movies/:id`

Get a movie by id.

#### Request

- Response:

  ```json
  {
  	"_id": "6473f9a85a816affb94e30e5",
  	"title": "The man from HongKong",
  	"capacity": 50,
  	"availableTickets": 43,
  	"tickets": [
  		{
  			"_id": "647403384239ca3eeeb3ca64",
  			"number": 1,
  			"movieId": "6473f9a85a816affb94e30e5",
  			"userId": "6473efc351a3bfa6d91159b3",
  			"createdAt": "2023-05-29T01:43:20.284Z",
  			"updatedAt": "2023-05-29T01:43:20.284Z"
  		},
  		{
  			"_id": "647403524239ca3eeeb3ca6a",
  			"number": 2,
  			"movieId": "6473f9a85a816affb94e30e5",
  			"userId": "6473efc351a3bfa6d91159b3",
  			"createdAt": "2023-05-29T01:43:46.272Z",
  			"updatedAt": "2023-05-29T01:43:46.272Z"
  		},
  		{
  			"_id": "647403524239ca3eeeb3ca6e",
  			"number": 3,
  			"movieId": "6473f9a85a816affb94e30e5",
  			"userId": "6473efc351a3bfa6d91159b3",
  			"createdAt": "2023-05-29T01:43:46.834Z",
  			"updatedAt": "2023-05-29T01:43:46.834Z"
  		},
  		{
  			"_id": "64740392e33fe6456121d12f",
  			"number": 4,
  			"movieId": "6473f9a85a816affb94e30e5",
  			"userId": "6473efc351a3bfa6d91159b3",
  			"createdAt": "2023-05-29T01:44:50.093Z",
  			"updatedAt": "2023-05-29T01:44:50.093Z"
  		},
  		{
  			"_id": "64740392e33fe6456121d133",
  			"number": 5,
  			"movieId": "6473f9a85a816affb94e30e5",
  			"userId": "6473efc351a3bfa6d91159b3",
  			"createdAt": "2023-05-29T01:44:50.658Z",
  			"updatedAt": "2023-05-29T01:44:50.658Z"
  		},
  		{
  			"_id": "64740448bd5dc016d9239ff3",
  			"number": 6,
  			"movieId": "6473f9a85a816affb94e30e5",
  			"userId": "6473efc351a3bfa6d91159b3",
  			"createdAt": "2023-05-29T01:47:52.499Z",
  			"updatedAt": "2023-05-29T01:47:52.499Z"
  		},
  		{
  			"_id": "64740449bd5dc016d9239ff7",
  			"number": 7,
  			"movieId": "6473f9a85a816affb94e30e5",
  			"userId": "6473efc351a3bfa6d91159b3",
  			"createdAt": "2023-05-29T01:47:53.070Z",
  			"updatedAt": "2023-05-29T01:47:53.070Z"
  		}
  	],
  	"createdAt": "2023-05-29T01:02:32.647Z",
  	"updatedAt": "2023-05-29T01:47:53.257Z"
  }
  ```

### `POST /users/signup`

Create a new user.

#### Request

- Body:

  ```json
  {
  	"name": "john",
  	"email": "john@gmail.com",
  	"password": "1234567"
  }
  ```

- Response:

  ```json
  {
  	"name": "john",
  	"email": "john@gmail.com",
  	"tickets": [],
  	"_id": "64790daa3a55a6f97fb28c6c",
  	"createdAt": "2023-06-01T21:29:14.802Z",
  	"updatedAt": "2023-06-01T21:29:14.802Z"
  }
  ```

### `POST /users/login`

Login a user.

#### Request

- Body:

  ```json
  {
  	"email": "john@gmail.com",
  	"password": "1234567"
  }
  ```

- Response:

  ```json
  {
  	"_id": "64790daa3a55a6f97fb28c6c",
  	"name": "john",
  	"email": "john@gmail.com",
  	"tickets": [],
  	"createdAt": "2023-06-01T21:29:14.802Z",
  	"updatedAt": "2023-06-01T21:29:14.802Z"
  }
  ```

### `POST /movies/book?movieId=6473f9a85a816affb94e30e5&seats=2`

Book a ticket to a movie

- User has to be logged in but for demonstration purpose the authentication middleware has been disabled.

#### Request

- Query Parameters:

  movieId, seats

- Response:

  ```json
  {
  	"message": "1 Ticket(s) for The man from HongKong created successfully",
  	"tickets": [
  		{
  			"number": 8,
  			"movieId": "6473f9a85a816affb94e30e5",
  			"userId": "64790daa3a55a6f97fb28c6c",
  			"_id": "64790f2f3a55a6f97fb28c72",
  			"createdAt": "2023-06-01T21:35:43.571Z",
  			"updatedAt": "2023-06-01T21:35:43.571Z"
  		}
  	]
  }
  ```
