require("dotenv/config");
const mongoose = require("mongoose");

const User = require("../models/User");


const users = [
	{ 
		username: "homersimpson",
		email: "homersimpson@emailme.com",
		password: "1234",
		name: "Homer Simpson",
		dateJoined: '2021-06-01',
		membership: false,
		phoneNumber: 555-1111,
	},
	{
		username: "NedF",
		email: "iamned@emailme.com",
		password: "1234",
		name: "NedFlanders",
		dateJoined: '2021-05-01',
		membership: false,
		phoneNumber: 555-2222,
	},
	{
		username: "Grampa",
		email: "grampasimpson@emailme.com",
		password: "1234",
		name: "Grampa Simpson",
		dateJoined: '2021-06-01',
		membership: false,
		phoneNumber: 555-1122,
	},
	{
		username: "milhousevh",
		email: "immmilhousevh@emailme.com",
		password: "1234",
		name: "Milhouse Van Houten",
		dateJoined: '2021-07-01',
		membership: false,
		phoneNumber: 555-1321,
	},
	{
		username: "Ashk",
		email: "aketchum@gottacatch.com",
		password: "1234",
		name: "Ash Ketchum",
		dateJoined: '2021-04-01',
		membership: false,
		phoneNumber: 555-1222,
	},
	{
		username: "SailorMoon",
		email: "SailorM@emailme.com",
		password: "1234",
		name: "Sailor Moon",
		dateJoined: '2021-03-01',
		membership: false,
		phoneNumber: 555-3332,
	},
	{
		username: "AstroB",
		email: "astroB@emailme.com",
		password: "1234",
		name: "Astro Boy",
		dateJoined: '2021-06-01',
		membership: false,
		phoneNumber: 555-1227,
	},
	{
		username: "Totoro",
		email: "totoron@emailme.com",
		password: "1234",
		name: "Totoro",
		dateJoined: '2020-05-01',
		membership: false,
		phoneNumber: 555-1555,
	},
	{
		username: "sArcher",
		email: "sterlingarcher@emailme.com",
		password: "1234",
		name: "Sterling Archer",
		dateJoined: '2021-06-01',
		membership: false,
		phoneNumber: 555-5555,
	},
];


/*

username: String,
	email: String,
	password: String,
	name: String,
	dateJoined: Date, 
	memberships: {
		type: Boolean,
		default: false,
	},
	phoneNumber: Number, 

	*/


	mongoose
		.connect(process.env.MONGO_URI, {
			useNewParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		})

		.then(() => {
			User.create(users)
				.then((createdUsers) => {
					console.log(createdUsers.length);
				})

				.catch((error) => {
					console.log(error);
				});
		})
		.catch((error) => {
			console.log(error);
		});

