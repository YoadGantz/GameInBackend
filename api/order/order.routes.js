const express = require('express')
const { getOrders, addOrder } = require('./order.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getOrders)
router.post('/', addOrder)

module.exports = router