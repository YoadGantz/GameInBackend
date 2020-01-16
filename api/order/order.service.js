
const dbService = require('../../services/db.service')

module.exports = {
    query,
    add
}

async function query(filterBy = {}) {
    const criteria = _buildCriteria(filterBy)
    const collection = await dbService.getCollection('order')
    try {
        const orders = await collection.find(criteria).toArray();
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
    const criteria = {};
    if (filterBy.txt) {
        criteria.username = filterBy.txt
    }
    if (filterBy.minBalance) {
        criteria.balance = { $gte: +filterBy.minBalance }
    }
    return criteria;
}


