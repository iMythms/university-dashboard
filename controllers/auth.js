const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

// Sign out
const signedOut = (req, res) => {
	req.session.destroy(() => {
		res.redirect('/')
	})
}
router.get('/sign-out', signedOut)

// Sign up
router.get('/sign-up', (req, res) => {
	res.render('auth/sign-up.ejs')
})
router.post('/sign-up', async (req, res) => {
	const userInDatabase = await User.findOne({ username: req.body.username })
	if (userInDatabase) {
		return res.send('Username already taken')
	}
	if (req.body.password !== req.body.confirmPassword) {
		return res.send('Password and Confirm Password must match')
	}
})
