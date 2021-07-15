const Order = require('../../../models/orders')
const moment = require('moment')

function orderController() {
    return {
        store(req, res) {
            // Validating request
            const { address, phone } = req.body
            if (!phone || !address) {
                req.flash('error', 'Missing fields')
                return res.redirect('/cart')
            }

            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                phone,
                address
            })

            order.save().then(result => {
                req.flash('success', 'Order Placed Successfully')
                delete req.session.cart
                return res.redirect('/customer/orders')
            }).catch(err => {
                req.flash('error', 'Something went wrong')
                return res.redirect('/cart')
            })
        },
        async index(req, res) {
            const orders = await Order.find({ customerId: req.user._id }, null, { sort: { 'createdAt': -1 } })
            res.header('Cache-Control', 'no-store')
            res.render('customers/orders', { orders, moment })
        }
    }
}

module.exports = orderController