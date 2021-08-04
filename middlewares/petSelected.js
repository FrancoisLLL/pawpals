function petSelected(req, res, next) {
	if (req.session.currentPet) {
		next();
	} else {
		res.redirect("/home");
		console.log("no req.session.currentPet", req.session)
	}
}

module.exports = petSelected;