function petSelected(req, res, next) {
	if (req.session.currentPet) {
		next();
	} else {
		res.redirect("/home");
	}
}

module.exports = petSelected;