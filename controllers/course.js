const express = require('express')
const router = express.Router()
const Course = require('../models/course')

// List All Courses
router.get('/', async (req, res) => {
	try {
		const courses = await Course.find().populate('owner')
		res.render('courses/index.ejs', { courses })
	} catch (err) {
		console.error(err)
		res.redirect('/')
	}
})

// New Course Page
router.get('/new', (req, res) => {
	res.render('courses/new.ejs')
})

// Create a New Course
router.post('/', async (req, res) => {
	try {
		req.body.owner = req.session.user._id
		await Course.create(req.body)

		if (req.body.action === 'addAndView') {
			res.redirect('/courses')
		} else if (req.body.action === 'addAndNew') {
			res.redirect('/courses/new')
		}
	} catch (err) {
		console.error(err)
		res.redirect('/')
	}
})

// Show Course Page
router.get('/:id', async (req, res) => {
	try {
		const course = await Course.findById(req.params.id).populate('owner')
		res.render('courses/show.ejs', { course })
	} catch (err) {
		console.error(err)
		res.redirect('/')
	}
})

// Update Course (Inline Editing)
router.put('/:id', async (req, res) => {
	try {
		const course = await Course.findById(req.params.id)

		if (!course) {
			return res.status(404).json({ error: 'Course not found' })
		}

		// Update only the fields provided in the request body
		Object.keys(req.body).forEach((key) => {
			course[key] = req.body[key]
		})

		await course.save()
		res.status(200).json({ success: true, course }) // Send updated course back as JSON
	} catch (err) {
		console.error(err)
		res.status(500).json({ error: 'Failed to update course' })
	}
})

module.exports = router
