import axios from 'axios'
import Noty from 'noty'


let addToCart = document.querySelectorAll('.add-to-cart')
let cartCounter = document.querySelector('#cartCounter')

function updateCart(pizza) {
    axios.post('/updateCart', pizza).then(res => {
        cartCounter.innerText = res.data.totalQty
        new Noty({
            type: 'success',
            text: 'Item added to cart',
            timeout: 1000,
            progressBar: false
        }).show()
    }).catch(err => {
        new Noty({
            type: 'error',
            text: 'Something went wrong',
            timeout: 1000,
            progressBar: false
        }).show()
    })
}


addToCart.forEach((btn) => {
    btn.addEventListener('click', (event) => {
        let pizza = JSON.parse(btn.dataset.pizza)
        updateCart(pizza)
    })
})