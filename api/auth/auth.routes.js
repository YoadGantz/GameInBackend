const express = require('express')
const {requireAuth}  = require('../../middlewares/requireAuth.middleware')
const {login, signUp, logout} = require('./auth.controller')

const router = express.Router()

router.post('/login', login)
router.post('/signup', signUp)
router.post('/logout', requireAuth, logout)

module.exports = router