const User = require("../models/User");

module.exports = (req, res, next) => {
	User.findOne()
		.then((oneUser) => {
			req.session.currentUser = {
				_id: oneUser._id,
				username: oneUser.username,
				//password: oneUser.password,
			};
			next();
		})
		.catch(() => {
			next();
		});
};