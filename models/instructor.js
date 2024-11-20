const mongoose = require('mongoose')

const instructorSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			require: true,
		},
		contactInfo: {
			type: String,
			require: false,
		},
		course: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Course',
				require: false,
			},
		],
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			require: true,
		},
	},
	{
		timestamps: true,
	}
)

const Instructor = mongoose.model('Instructor', instructorSchema)
module.exports = Instructor
