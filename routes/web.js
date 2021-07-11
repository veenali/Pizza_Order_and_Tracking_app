const express = require('express')
const router = express.Router()

const homeController = require('../app/http/controllers/homeController')
const authController = require('../app/http/controllers/authController')
const cartController = require('../app/http/controllers/customers/cartController')


router.get('/', homeController().index)
router.get('/login', authController().login)
router.get('/register', authController().register)

router.get('/cart', cartController().index)
router.post('/updateCart', cartController().update)




module.exports = router