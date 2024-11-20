const mongoose = require('mongoose')

const semesterSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			require: true,
		},
		sgpa: {
			type: mongoose.Schema.Types.Decimal128,
			require: true,
			default: 0,
		},
		cgpa: {
			type: mongoose.Schema.Types.Decimal128,
			require: true,
			default: 0,
		},
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

const Semester = mongoose.model('Semester', semesterSchema)
module.exports = Semester
