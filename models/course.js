const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema(
	{
		courseCode: {
			type: String,
			require: true,
		},
		courseTitle: {
			type: String,
			require: true,
		},
		status: {
			type: String,
			enum: ['not started', 'in progress', 'done', 'repeated'],
			default: 'not started',
			require: true,
		},
		day: {
			type: String,
			enum: [
				'saturday',
				'sunday',
				'monday',
				'tuesday',
				'wednesday',
				'thursday',
			],
			require: true,
		},
		duration: {
			type: String,
			require: true,
		},
		location: {
			type: String,
			require: false,
		},
		credits: {
			type: Number,
			require: true,
		},
		grade: {
			type: mongoose.Schema.Types.Decimal128,
			require: false,
			default: 0,
		},
		degree: {
			type: mongoose.Schema.Types.Decimal128,
			require: false,
			default: 0,
		},
		semester: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Semester',
			require: true,
		},
		instructor: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Instructor',
				require: true,
				default: 'To be announced',
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

const Course = mongoose.model('Course', courseSchema)
module.exports = Course
