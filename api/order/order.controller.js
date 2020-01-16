const orderService = require('./order.service')
  
async function getOrders(req, res) {
    console.log(req.query);
    const orders = await orderService.query(req.query)
    res.send(orders)
}

async function addOrder(req, res) {
    var order = req.body;
    console.log(order);
    
    // game.publiser = {_id: req.session.user._id, userName: req.session.user.userName};
    order = await orderService.add(order)
    res.send(order)
}


module.exports = {
    getOrders,
    addOrder
}