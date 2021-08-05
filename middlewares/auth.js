function requireAuth(req, res, next) {
	if (req.session.currentUser) {
		next();
	} else {
		res.render("index");
	}
}

module.exports = requireAuth;