function cartController() {
    return {
        index(req, res) {
            res.render('customers/cart')
        },
        update(req, res) {
            // For the first time creating a cart
            if (!req.session.cart) {
                req.session.cart = {
                    items: {},
                    totalQty: 0,
                    totalPrice: 0
                }
            }

            // The cart that was just created or already existed is copied to cart variable
            let cart = req.session.cart

            // Check if item exists in cart
            if (!cart.items[req.body._id]) {
                cart.items[req.body._id] = {
                    item: req.body,
                    qty: 1
                }
                cart.totalQty += 1
                cart.totalPrice += req.body.price
            }
            else {
                cart.items[req.body._id].qty += 1
                cart.totalQty += 1
                cart.totalPrice += req.body.price
            }
            return res.json({ totalQty: req.session.cart.totalQty })
        }
    }
}

module.exports = cartController