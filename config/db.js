const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
})
	.then(() => {
		console.log("you have mongo beans! ")
	})

	.catch(e => console.log(e));