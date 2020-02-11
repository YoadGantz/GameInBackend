
const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    add
}

async function query(filterBy = {}) {
    const criteria = _buildCriteria(filterBy)
    const collection = await dbService.getCollection('order')
    try {
        const orders = await collection.find(criteria).toArray();
        let oldOrders = await collection.find({ createdAt: { $lte: Date.now() - 29 * 24 * 60 * 60 * 1000 } }).toArray()
        while (oldOrders.length > 0) {
            await _updateOrderTimes(oldOrders, collection)
            oldOrders = await collection.find({ createdAt: { $lte: Date.now() - 29 * 24 * 60 * 60 * 1000 } }).toArray()
        }

        return orders
    } catch (err) {
        console.log('ERROR: cannot find orders')
        throw err;
    }
}

async function add(order) {
    const collection = await dbService.getCollection('order')
    try {
        await collection.insertOne(order);
        return order;
    } catch (err) {
        console.log(`ERROR: cannot add order`)
        throw err;
    }
}

function _buildCriteria(filterBy) {
    let criteria = {};
    if (filterBy.gameIds) {
        criteria = { createdAt: { $gte: +(filterBy.lastMonthId) }, gameIds: filterBy.gameIds }
    }
    if (filterBy.orderBy) {
        criteria.orderBy = filterBy.orderBy
    }
    if (filterBy.gameId) {
        criteria.gameIds = filterBy.gameId
    }
    return criteria;
}


async function _updateOrderTimes(orders, collection) {
    try {
        orders.forEach(async (order) => {
            order.createdAt += 29 * 24 * 60 * 60 * 1000;
            await collection.updateOne({ "_id": ObjectId(order._id) }, { $set: { ...order } })
        })
    }
    catch (err) {
        console.log('ERROR: cannot find orders')
        throw err;
    }
}