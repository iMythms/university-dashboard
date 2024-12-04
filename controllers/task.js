const express = require('express')
const router = express.Router()
const Task = require('../models/task')

// List All Tasks
router.get('/', async (req, res) => {
	try {
		const tasks = await Task.find().populate('user')
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
		req.body.user = req.session.user._id
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

// Show Task Page
router.get('/:id', async (req, res) => {
	try {
		const task = await Task.findById(req.params.id).populate('user')
		res.render('tasks/show.ejs', { task })
	} catch (err) {
		console.log(err)
		res.redirect('/')
	}
})

// Update Task (Inline Editing)
router.put('/:id', async (req, res) => {
	try {
		const task = await Task.findById(req.params.id)

		if (!task) {
			return res.status(404).json({ error: 'Task not found' })
		}

		// Update only the fields provided in the request body
		Object.keys(req.body).forEach((key) => {
			task[key] = req.body[key]
		})

		await task.save()
		res.status(200).json({ success: true, task }) // Send updated task back as JSON
	} catch (err) {
		console.error(err)
		res.status(500).json({ error: 'Failed to update task' })
	}
})

module.exports = router
