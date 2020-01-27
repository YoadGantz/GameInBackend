
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
        _updateOrderTimes(orders)
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
        criteria={createdAt:{$gte:+(filterBy.lastMonthId)},gameIds:filterBy.gameIds}
    }
    if (filterBy.orderBy) {
        criteria.orderBy = filterBy.orderBy
    }
    if (filterBy.gameId){
        criteria.gameIds=filterBy.gameId
    }
    return criteria;
}


async function _updateOrderTimes(orders) {
    try {
        orders.forEach(async (order) => {
            const createdAt = order.createdAt;
            while (order.createdAt < Date.now() - 31 * 24 * 60 * 60 * 1000) {
                order.createdAt += 31 * 24 * 60 * 60 * 1000;
            }
            if (createdAt !== order.createdAt) {
                await collection.updateOne({ "_id": ObjectId(order._id) }, { $set: { ...order } })
            }
        });
    } catch (err) {
        console.log('ERROR: cannot find orders')
        throw err;
    }
}