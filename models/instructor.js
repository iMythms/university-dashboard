const mongoose = require('mongoose')

const instructorSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		contactInfo: {
			type: String,
			required: false,
		},
		course: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Course',
				required: false,
			},
		],
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{
		timestamps: true,
	}
)

const Instructor = mongoose.model('Instructor', instructorSchema)
module.exports = Instructor
