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
                Order.populate(result, { path: 'customerId' }, (err, placedOrder) => {
                    if (err) {
                        req.flash('error', 'Something went wrong')
                        return res.redirect('/')
                    }
                    req.flash('success', 'Order Placed Successfully')
                    delete req.session.cart
                    // Emit event
                    const eventEmitter = req.app.get('eventEmitter')
                    eventEmitter.emit('orderPlaced', placedOrder)
                    return res.redirect('/customer/orders')
                })
            }).catch(err => {
                req.flash('error', 'Something went wrong')
                return res.redirect('/cart')
            })
        },
        async index(req, res) {
            const orders = await Order.find({ customerId: req.user._id }, null, { sort: { 'createdAt': -1 } })
            res.header('Cache-Control', 'no-store')
            res.render('customers/orders', { orders, moment })
        },
        async show(req, res) {
            const order = await Order.findById(req.params.id)
            // Authorize User
            if (req.user._id.toString() === order.customerId.toString()) {
                return res.render('customers/singleOrder', { order })
            }
            return res.redirect('/')
        }
    }
}

module.exports = orderController