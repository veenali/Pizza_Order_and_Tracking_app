import axios from 'axios'
import Noty from 'noty'
import { initAdmin } from './admin'
import moment from 'moment'

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


//Remove alert message after X seconds
const alertMsg = document.querySelector('#success-alert')
if (alertMsg) {
    setTimeout(() => {
        alertMsg.remove()
    }, 2000)
}



// According to the status of the order we need to add classes to the respective element
// If in progress then red/$primary and if done then gray/$gray
// Change Order status :
const hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order)

let statuses = document.querySelectorAll('.status_line')

let time = document.createElement('small')

function updateStatus(order) {
    statuses.forEach((status)=>{
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })
    let stepCompleted = true
    for (let status of statuses) {
        let dataProp = status.dataset.status
        if (stepCompleted) {
            status.classList.add('step-completed')
        }
        if (dataProp === order.status) {
            stepCompleted = false
            time.innerText = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time)
            if (status.nextElementSibling) {
                status.nextElementSibling.classList.add('current')
            }
        }
    }
}
updateStatus(order);


// Socket on client side ....... Add script tag on the layout folder to make the function available here.
// Whatever code is present here will run whenever we are on the client page
let socket = io()
initAdmin(socket)
// Join 
// When we reach the order page we need to notify the server that we have reached that page and create a private room
if (order) {
    socket.emit('join', `order_${order._id}`)
}

// Admin 
let adminAreaPath = window.location.pathname
if(adminAreaPath.includes('admin')){
    socket.emit('join', 'adminRoom')
}


// Listen the event 
// Sent from server.js
socket.on('orderUpdated', (data) => {
    const updatedOrder = { ...order }  //Create a copy of order
    updatedOrder.updatedAt = moment().format()  // Update its update time
    updatedOrder.status = data.status
    updateStatus(updatedOrder); // Call the updateStatus function created above using updatedOrder
    new Noty({
        type: 'success',
        text: 'Order Updated',
        timeout: 1000,
        progressBar: false
    }).show()
})
