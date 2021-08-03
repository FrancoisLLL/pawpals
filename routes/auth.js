const express = require("express");
const router = new express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

const SALT = 10;


router.get("/signin", (req, res, next) => {
	res.render("auth/signin.hbs")
});

router.get("/signup", (req, res, next) => {
	res.render("auth/signup.hbs");
});

router.post("/signup", async (req, res, next) => {
	try {
		const user = req.body;

		if (!user.username || !user.email) {
			res.render("auth/signup.hbs", {
				errorMessage: "Please provide your username and email",
			});
			return;
		}

		const foundUser = await User.findOne({
			email: user.email
		});

		if (foundUser) {
			res.render("auth/signup.hbs", {
				errorMessage: "Email taken",
			});
			return;
		}

		console.log(user.password, SALT);
		const hashedPassword = await bcrypt.hashSync(user.password, SALT);
		user.password = hashedPassword;

		const createdUser = await User.create(user);

		req.session.currentUser = createdUser;

		console.log(req.session.currentUser);

		res.redirect("/signin");

	} catch (error) {
		next(error);
	}
});

router.post("/signin", async (req, res, next) => {

	console.log(req.body);

	try {
		const foundUser = await User.findOne({
			email: req.body.email
		});

		if (!foundUser) {
			res.render("auth/signin.hbs", {
				errorMessage: "try again",
			});
			return;
		}

		console.log(req.body.password, foundUser.password);

		const isValidPassword = bcrypt.compareSync(
			req.body.password,
			foundUser.password
		);

		if (isValidPassword) {
			req.session.currentUser = {
				_id: foundUser._id,
			};

			res.redirect("/");
		} else {
			res.render("auth/signin.hbs", {
				errorMessage: "try again",
			});
			return;
		}	
	} catch (error) {}
});

router.get("/signout", (req, res, next) => {
	req.session.destroy((error) => {
		if (error) {
			next(error);
		} else {
			res.redirect("/auth/signin");
		}
	});
});

module.exports = router;