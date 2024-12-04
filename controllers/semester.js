const express = require('express')
const router = express.Router()
const Semester = require('../models/semester')

// List All Semesters
router.get('/', async (req, res) => {
	try {
		const semesters = await Semester.find().populate('user')
		res.render('semesters/index.ejs', { semesters })
	} catch (err) {
		console.error(err)
		res.redirect('/')
	}
})

// New Semester Page
router.get('/new', (req, res) => {
	res.render('semesters/new.ejs')
})

// Create a New Semester
router.post('/', async (req, res) => {
	try {
		req.body.user = req.session.user._id
		await Semester.create(req.body)

		if (req.body.action === 'addAndView') {
			res.redirect('/semesters')
		} else if (req.body.action === 'addAndNew') {
			res.redirect('/semesters/new')
		}
	} catch (err) {
		console.error(err)
		res.redirect('/')
	}
})

// Show Semester Page
router.get('/:id', async (req, res) => {
	try {
		const semester = await Semester.findById(req.params.id).populate('user')
		res.render('semesters/show.ejs', { semester })
	} catch (err) {
		console.error(err)
		res.redirect('/')
	}
})

// Update Semester (Inline Editing)
router.put('/:id', async (req, res) => {
	try {
		const semester = await Course.findById(req.params.id)

		if (!semester) {
			return res.status(404).json({ error: 'Semester not found' })
		}

		// Update only the fields provided in the request body
		Object.keys(req.body).forEach((key) => {
			semester[key] = req.body[key]
		})

		await semester.save()
		res.status(200).json({ success: true, semester }) // Send updated semester back as JSON
	} catch (err) {
		console.error(err)
		res.status(500).json({ error: 'Failed to update semester' })
	}
})

module.exports = router
