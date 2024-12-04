const express = require('express')
const router = express.Router()
const Task = require('../models/task')
const Course = require('../models/course')

router.get('/', async (req, res) => {
	try {
		const tasks = await Task.find()
			.populate({
				path: 'course',
				select: 'courseCode courseTitle semester',
				populate: {
					path: 'semester',
					select: 'name',
				},
			})
			.exec()

		const groupedTasks = {}
		tasks.forEach((task) => {
			const semesterName = task.course.semester.name
			const courseName = `${task.course.courseCode}: ${task.course.courseTitle}`

			if (!groupedTasks[semesterName]) {
				groupedTasks[semesterName] = {}
			}

			if (!groupedTasks[semesterName][courseName]) {
				groupedTasks[semesterName][courseName] = []
			}

			groupedTasks[semesterName][courseName].push(task)
		})

		res.render('tasks/index', { groupedTasks })
	} catch (err) {
		console.error(err)
		res.redirect('/')
	}
})

router.get('/new', async (req, res) => {
	try {
		const courses = await Course.find().select('courseCode _id')
		res.render('tasks/new', { courses })
	} catch (err) {
		console.error(err)
		res.redirect('/tasks')
	}
})

router.post('/', async (req, res) => {
	try {
		req.body.user = req.session.user._id
		await Task.create(req.body)
		res.redirect('/tasks')
	} catch (err) {
		console.error(err)
		res.redirect('/')
	}
})

router.get('/:id', async (req, res) => {
	try {
		const task = await Task.findById(req.params.id).populate('user')
		res.render('tasks/view.ejs', { task })
	} catch (err) {
		console.log(err)
		res.redirect('/')
	}
})

router.get('/:id/edit', async (req, res) => {
	try {
		const task = await Task.findById(req.params.id).populate(
			'course',
			'courseCode'
		)
		if (!task) {
			throw new Error('Task not found.')
		}
		const courses = await Course.find().select('courseCode _id')

		res.render('tasks/edit', { task, courses })
	} catch (err) {
		console.error(err)
		res.redirect('/tasks')
	}
})

router.put('/:id', async (req, res) => {
	try {
		if (!req.body.name || !req.body.dueDate) {
			throw new Error('Name and Due Date are required.')
		}

		const updatedData = {
			name: req.body.name,
			dueDate: req.body.dueDate,
			status: req.body.status,
			score: req.body.score,
			weight: req.body.weight,
			finalGrade: req.body.finalGrade,
			course: req.body.course,
		}

		const updatedTask = await Task.findByIdAndUpdate(
			req.params.id,
			updatedData,
			{ new: true }
		)
		if (!updatedTask) {
			throw new Error('Task not found.')
		}

		res.redirect('/tasks')
	} catch (err) {
		console.error(err)
		res.redirect('/tasks')
	}
})

module.exports = router
