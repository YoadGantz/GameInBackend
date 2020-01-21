
const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    getById,
    remove,
    update,
    add
}

async function query(filterBy) {
    const criteria = _buildCriteria(filterBy)
    const collection = await dbService.getCollection('game')
    try {
        let games = await collection.find(criteria).toArray();
        // if (!games.length) {show message to the user/guest }
        return games
    } catch (err) {
        console.log('ERROR: cannot find games')
        throw err;
    }
}

async function getById(gameId) {
    const collection = await dbService.getCollection('game')
    try {
        const game = await collection.findOne({ "_id": ObjectId(gameId) })
        return game
    } catch (err) {
        console.log(`ERROR: while finding game ${gameId}`)
        throw err;
    }
}

async function remove(gameId) {
    const collection = await dbService.getCollection('game')
    try {
        await collection.deleteOne({ "_id": ObjectId(gameId) })
    } catch (err) {
        console.log(`ERROR: cannot remove game ${gameId}`)
        throw err;
    }
}
async function update(game) {
    const collection = await dbService.getCollection('game')
    game._id = ObjectId(game._id);
    try {
        await collection.replaceOne({ "_id": game._id }, { $set: game })
        return game
    } catch (err) {
        console.log(`ERROR: cannot update game ${game._id}`)
        throw err;
    }
}

async function add(game) {
    const collection = await dbService.getCollection('game')
    try {
        console.log(game)
        await collection.insertOne(game);
        return game;
    } catch (err) {
        console.log(`ERROR: cannot add game`)
        throw err;
    }
}


function _buildCriteria(filterBy) {
    let criteria = {}
    if (filterBy._id) {
        criteria.publisher = filterBy._id
    }
    try {
        if (filterBy.shoppingCartIds) {
            criteria = {
                "_id": {
                    "$in": filterBy.shoppingCartIds.map((id) => {
                        return ObjectId(id)
                    })
                }
            }
        }
    } catch (err) {
        console.log(err)
    }
    if (filterBy.wishedIds) {
        criteria._id = {
            $in: filterBy.wishedIds.map((id) => {
                return ObjectId(id)
            })
        }
    }
    return criteria;
}


