const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			require: true,
		},
		dueDate: {
			type: Date,
			require: false,
		},
		status: {
			type: String,
			enum: ['not started', 'in progress', 'done'],
			default: 'not started',
			require: true,
		},
		score: {
			type: mongoose.Schema.Types.Decimal128,
			require: true,
			default: 0,
		},
		weight: {
			type: mongoose.Schema.Types.Decimal128,
			require: true,
			default: 0,
		},
		finalGrade: {
			type: mongoose.Schema.Types.Decimal128,
			require: true,
			default: 0,
		},
		course: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Course',
			require: true,
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

const Task = mongoose.model('Task', taskSchema)
module.exports = Task
