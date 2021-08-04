const express = require("express");
const router = new express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

const SALT = 10;



router.get("/signin", (req, res, next) => {
	res.render("auth/signin.hbs")
});

router.get("/signup", (req, res, next) => {
	res.render("auth/signup.hbs", {
		date: new Date().toISOString().slice(0, 10),
	});
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
				errorMessage: "Email taken. Please use another email",
			});
			return;
		}

		// console.log(user.password, SALT);
		const hashedPassword = await bcrypt.hashSync(user.password, SALT);
		user.password = hashedPassword;

		const createdUser = await User.create(user);

		res.redirect("/signin");

	} catch (error) {
		next(error);
	}
});

router.post("/signin", async (req, res, next) => {

	try {
		const foundUser = await User.findOne({
			email: req.body.email
		});

		if (!foundUser) {
			res.render("auth/signin.hbs", {
				errorMessage: "Credentials don't match. Try again. Meow.",
			});
			return;
		}

		const isValidPassword = bcrypt.compareSync(
			req.body.password,
			foundUser.password
		);

		console.log("isValid" + isValidPassword)
		if (isValidPassword) {
			// console.log("before req session" + foundUser._id);

			// console.log(req.session);

			req.session.currentUser = {
				_id: foundUser._id,
			};

			// console.log("after req session" + foundUser._id);

			res.redirect("/home");

		} else {
			// console.log("else")
			res.render("auth/signin.hbs", {
				errorMessage: "Please input credentials again.",
			});
			return;
		}	

	} catch (error) {
		console.log(error)
		next(error)
	}
});




router.get("/logout", (req, res, next) => {
	req.session.destroy((error) => {
		if (error) {
			next(error);
		} else {
			res.redirect("/signout");
		}
	});
});

router.get("/signout", (req, res, next) => {
	res.render("auth/signout.hbs")
});


module.exports = router;