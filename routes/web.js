const express = require('express')
const router = express.Router()

const homeController = require('../app/http/controllers/homeController')
const authController = require('../app/http/controllers/authController')
const cartController = require('../app/http/controllers/customers/cartController')
const guest = require('../app/http/middlewares/guest')


router.get('/', homeController().index)

router.get('/login', guest, authController().login)
router.post('/login', authController().postLogin)

router.get('/register', guest, authController().register)
router.post('/register', authController().postRegister)

router.get('/cart', cartController().index)
router.post('/updateCart', cartController().update)

router.post('/logout', authController().logout)



module.exports = router