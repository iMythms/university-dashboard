const express = require('express')
const router = express.Router()
const Instructor = require('../models/instructor')

// List All Instructors
router.get('/', async (req, res) => {
	try {
		const instructors = await Instructor.find().populate('user')
		res.render('instructors/index.ejs', { instructors })
	} catch (err) {
		console.error(err)
		res.redirect('/')
	}
})

// New Instructor Page
router.get('/new', (req, res) => {
	res.render('instructors/new.ejs')
})

// Create a New Instructor
router.post('/', async (req, res) => {
	try {
		// Extract necessary data from the form
		const { name, contactInfo } = req.body

		// Create the new instructor
		await Instructor.create({
			name,
			contactInfo,
			user: req.session.user._id, // Add owner for reference
		})

		// Redirect based on the action field in the form
		if (req.body.action === 'addAndView') {
			res.redirect('/instructors') // Redirect to the instructors list
		} else if (req.body.action === 'addAndNew') {
			res.redirect('/instructors/new') // Redirect to the new instructor form
		} else {
			res.redirect('/instructors') // Default redirection
		}
	} catch (err) {
		console.error(err)
		res.status(500).send('Error creating instructor')
	}
})

// Show Instructor Page
router.get('/:id', async (req, res) => {
	try {
		const instructor = await Instructor.findById(req.params.id).populate('user')
		res.render('instructors/show.ejs', { instructor })
	} catch (err) {
		console.error(err)
		res.redirect('/')
	}
})

// Update Instructor (Inline Editing)
router.put('/:id', async (req, res) => {
	try {
		const instructor = await Instructor.findById(req.params.id)

		if (!instructor) {
			return res.status(404).json({ error: 'Instructor not found' })
		}

		// Update only the fields provided in the request body
		Object.keys(req.body).forEach((key) => {
			instructor[key] = req.body[key]
		})

		await instructor.save()
		res.status(200).json({ success: true, instructor }) // Send updated instructor back as JSON
	} catch (err) {
		console.error(err)
		res.status(500).json({ error: 'Failed to update instructor' })
	}
})

module.exports = router
