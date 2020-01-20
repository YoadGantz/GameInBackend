const gameService = require('./game.service')
const logger = require('../../services/logger.service')

async function getGame(req, res) {
    const game = await gameService.getById(req.params.id)
    res.send(game)
}
  
async function getGames(req, res) {
    try {
        const games = await gameService.query(req.query)
        res.send(games)
    } catch (err) {
        logger.error('Cannot get games', err);
        res.status(500).send({ error: 'cannot get games' })
        
    }
}

async function deleteGame(req, res) {
    await gameService.remove(req.params.id)
    res.end()
}

async function addGame(req, res) {
    var game = req.body;
    // game.publiser = {_id: req.session.user._id, userName: req.session.user.userName};
    game = await gameService.add(game)
    res.send(game)
}

async function updateGame(req, res) {
    const game = req.body;
    await gameService.update(game)
    res.send(game)
}

module.exports = {
    getGame,
    getGames,
    deleteGame,
    addGame,
    updateGame
}