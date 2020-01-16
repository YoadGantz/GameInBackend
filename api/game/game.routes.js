const express = require('express')
const {requireAuth, requireAdmin} = require('../../middlewares/requireAuth.middleware')
const {getGame, getGames, deleteGame, updateGame, addGame} = require('./game.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getGames)
router.get('/:id', getGame)
router.post('/', addGame)
router.put('/:id',  /*requireAuth,*/ updateGame)
router.delete('/:id',  /*requireAuth, requireAdmin,*/ deleteGame)

module.exports = router