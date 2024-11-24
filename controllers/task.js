const express = require('express')
const router = express.Router()
const Task = require('../models/task')

// List All Tasks
router.get('/', async (req, res) => {
	try {
		const tasks = await Task.find().populate('owner')
		res.render('tasks/index.ejs', { tasks })
	} catch (err) {
		console.error(err)
		res.redirect('/')
	}
})

// New Task Page
router.get('/new', (req, res) => {
	res.render('tasks/new.ejs')
})

// Create a new task
router.post('/', async (req, res) => {
	try {
		req.body.owner = req.session.user._id
		await Task.create(req.body)

		if (req.body.action === 'addAndView') {
			res.redirect('/tasks')
		} else if (req.body.action === 'addAndNew') {
			res.redirect('/tasks/new')
		}
	} catch (err) {
		console.error(err)
		res.redirect('/')
	}
})
