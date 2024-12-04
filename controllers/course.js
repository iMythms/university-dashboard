const express = require('express')
const router = express.Router()
const Course = require('../models/course')
const Instructor = require('../models/instructor')
const Task = require('../models/task')
const Semester = require('../models/semester')

router.get('/', async (req, res) => {
	try {
		const courses = await Course.find()
			.populate('user', 'username')
			.populate('instructor', 'name')

		res.render('courses/index.ejs', { courses })
	} catch (err) {
		console.error(err)
		res.redirect('/')
	}
})

router.get('/new', async (req, res) => {
	try {
		const instructors = await Instructor.find()
		const semesters = await Semester.find()

		res.render('courses/new', { instructors, semesters })
	} catch (err) {
		console.error(err)
		res.redirect('/')
	}
})

router.post('/', async (req, res) => {
	try {
		const days = Array.isArray(req.body.day) ? req.body.day : [req.body.day]

		const timing = req.body.timing
			? {
					startTime: req.body.timing.startTime || null,
					endTime: req.body.timing.endTime || null,
			  }
			: { startTime: null, endTime: null }

		if (!timing.startTime || !timing.endTime) {
			throw new Error('Timing (startTime and endTime) is required.')
		}

		const newCourse = {
			...req.body,
			day: days,
			timing,
			owner: req.session.user._id,
		}

		await Course.create(newCourse)

		res.redirect('/courses')
	} catch (err) {
		console.error(err.message)
		res.redirect('/')
	}
})

router.get('/:id', async (req, res) => {
	try {
		// Find the course and populate the instructor field
		const course = await Course.findById(req.params.id)
			.populate('instructor', 'name')
			.populate('semester', 'name') // Ensure semester is also populated if needed

		// Find tasks associated with this course
		const tasks = await Task.find({ course: course._id })

		// Render the view page and pass both the course and tasks
		res.render('courses/view', { course, tasks })
	} catch (err) {
		console.error(err)
		res.redirect('/courses')
	}
})

router.get('/:id/edit', async (req, res) => {
	try {
		const course = await Course.findById(req.params.id)
			.populate('instructor', 'name')
			.populate('semester', 'name')
		const instructors = await Instructor.find()
		const semesters = await Semester.find()

		res.render('courses/edit', { course, instructors, semesters })
	} catch (err) {
		console.error(err)
		res.redirect('/courses')
	}
})

router.put('/:id', async (req, res) => {
	try {
		const days = Array.isArray(req.body.day) ? req.body.day : [req.body.day]
		const timing = req.body.timing
			? {
					startTime: req.body.timing.startTime || null,
					endTime: req.body.timing.endTime || null,
			  }
			: { startTime: null, endTime: null }

		if (!timing.startTime || !timing.endTime) {
			throw new Error('Timing (startTime and endTime) is required.')
		}

		await Course.findByIdAndUpdate(req.params.id, {
			...req.body,
			day: days,
			timing,
		})

		res.redirect('/courses')
	} catch (err) {
		console.error(err)
		res.redirect('/courses')
	}
})

module.exports = router
