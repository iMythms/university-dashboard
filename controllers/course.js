const express = require('express')
const router = express.Router()
const Course = require('../models/course')
const Instructor = require('../models/instructor')
const Semester = require('../models/semester')

// List All Courses
router.get('/', async (req, res) => {
	try {
		// Populate both 'user' and 'instructor' fields
		const courses = await Course.find()
			.populate('user', 'username') // Populate the user field with the username
			.populate('instructor', 'name') // Populate the instructor field with the name

		// Render the courses page with the populated courses
		res.render('courses/index.ejs', { courses })
	} catch (err) {
		console.error(err)
		res.redirect('/')
	}
})

// New Course Page
router.get('/new', async (req, res) => {
	try {
		// Fetch instructors and semesters from the database
		const instructors = await Instructor.find()
		const semesters = await Semester.find()

		// Render the template and pass the data
		res.render('courses/new', { instructors, semesters })
	} catch (err) {
		console.error(err)
		res.redirect('/')
	}
})

// Create a New Course
router.post('/', async (req, res) => {
	try {
		// Ensure the `day` field is an array, even if only one day is selected
		const days = Array.isArray(req.body.day) ? req.body.day : [req.body.day]

		// Ensure timing exists and is valid
		const timing = req.body.timing
			? {
					startTime: req.body.timing.startTime || null,
					endTime: req.body.timing.endTime || null,
			  }
			: { startTime: null, endTime: null }

		if (!timing.startTime || !timing.endTime) {
			throw new Error('Timing (startTime and endTime) is required.')
		}

		// Build the course object
		const newCourse = {
			...req.body,
			day: days,
			timing,
			owner: req.session.user._id,
		}

		// Save the course to the database
		await Course.create(newCourse)

		// Redirect to the courses list page
		res.redirect('/courses')
	} catch (err) {
		console.error(err.message) // Log the error message for debugging
		res.redirect('/') // Redirect to the homepage in case of error
	}
})

// View Course Page
router.get('/:id', async (req, res) => {
	try {
		const course = await Course.findById(req.params.id).populate(
			'instructor',
			'name'
		)
		res.render('courses/view', { course })
	} catch (err) {
		console.error(err)
		res.redirect('/courses')
	}
})

// Edit Course Page
router.get('/:id/edit', async (req, res) => {
	try {
		// Find the course, instructors, and semesters
		const course = await Course.findById(req.params.id)
			.populate('instructor', 'name')
			.populate('semester', 'name')
		const instructors = await Instructor.find()
		const semesters = await Semester.find()

		// Render the edit page with the course data
		res.render('courses/edit', { course, instructors, semesters })
	} catch (err) {
		console.error(err)
		res.redirect('/courses')
	}
})

// Update Course
router.put('/:id', async (req, res) => {
	try {
		// Ensure `day` and `timing` are handled properly
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

		// Update the course
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
