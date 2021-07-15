const express = require('express')
const router = express.Router()

//Controllers
const homeController = require('../app/http/controllers/homeController')
const authController = require('../app/http/controllers/authController')
const cartController = require('../app/http/controllers/customers/cartController')
const orderController = require('../app/http/controllers/customers/orderController')
const adminOrderController = require('../app/http/controllers/admin/orderController')

//Middlewares
const guest = require('../app/http/middlewares/guest')
const auth = require('../app/http/middlewares/auth')
const admin = require('../app/http/middlewares/admin')


router.get('/', homeController().index)

router.get('/login', guest, authController().login)
router.post('/login', authController().postLogin)

router.get('/register', guest, authController().register)
router.post('/register', authController().postRegister)

router.get('/cart', cartController().index)
router.post('/updateCart', cartController().update)

router.post('/logout', authController().logout)

//Customer routes
router.post('/orders', auth, orderController().store)
router.get('/customer/orders', auth, orderController().index)


//Admin routes
router.get('/admin/orders', admin, adminOrderController().index)


module.exports = router