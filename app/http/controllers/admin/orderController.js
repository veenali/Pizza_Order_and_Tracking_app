const Order = require('../../../models/orders')

function orderController() {
    return {
        index(req, res) {
            Order.find({ status: { $ne: 'completed' } }, null, { sort: { 'createdAt': -1 } })
                .populate('customerId', '-password')
                .exec((err, orders) => {
                    //Ajax call
                    if (req.xhr) {
                        return res.json(orders)
                    }
                    return res.render('admin/orders')
                })
        }
    }
}

module.exports = orderController