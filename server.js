const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const app = express()

const session = require('express-session')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')
const methodOverride = require('method-override')
const morgan = require('morgan')

const isSignedIn = require('./middleware/is-signed-in')
const passUserToView = require('./middleware/pass-user-to-view')

const PORT = process.env.PORT ? process.env.PORT : '3000'

mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', () => {
	console.log(`Connected to MongoDB ${mongoose.connection.name}`)
})

app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use(morgan('dev'))
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: true,
		store: MongoStore.create({
			mongoUrl: process.env.MONGODB_URI,
		}),
	})
)

app.get('/', async (req, res) => {
	res.render('index.ejs', {
		user: req.session.user,
	})
})

// Require and use Controllers
const authController = require('./controllers/auth.js')
const courseController = require('./controllers/course.js')
const taskController = require('./controllers/task.js')
const instructorController = require('./controllers/instructor.js')
const semesterController = require('./controllers/semester.js')

/* Add the rest of controllers */

app.use(passUserToView)
app.use('/auth', authController)
app.use(isSignedIn)
app.use('/course', courseController)
app.use('/task', taskController)
app.use('/instructor', instructorController)
app.use('/semester', semesterController)

// Landing Page
app.get('/', async (req, res) => {
	res.render('index.ejs')
})

// Listening on port
app.listen(PORT, () => {
	console.log(`Running on localhost:${PORT}`)
})
