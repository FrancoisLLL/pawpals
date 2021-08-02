const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema ({

	username: String,
	email: String,
	password: String,
	name: String,
	dateJoined: {
		type: String,
		default: Date.now, 
	},
	membership: {
		type: Boolean,
		default: false,
	},
	phoneNumber: Number, 
});

const User = mongoose.model("User", userSchema);
module.exports = User;






/*


Username String
Email String
Password String
Name String
Date they joined Date
Pets Ref. ---- delete for now, 
memberships boolean
Phone number

*/