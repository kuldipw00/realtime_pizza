
import axios from 'axios'
import Noty from 'noty'
//const { update } = require("../../app/http/models/menu");
import initAdmin from './admin.js'
import moment from 'moment'


let addToCart=document.querySelectorAll('.add-cart')
let cartCounter=document.querySelector('#cartCounter')


function updateCart(pizza){
    axios.post('/update-cart',pizza).then(res=>{
        
        cartCounter.innerText=res.data.totalQty

        new Noty({
            type:'success',
            timeout:500,
            text:'Items added to cart',
            progressBar:false
        }).show()


    })
}
addToCart.forEach((btn)=>{
    btn.addEventListener('click',(e)=>{
        
        let pizza=JSON.parse(btn.dataset.pizza);
        updateCart(pizza)
      
    })
})


initAdmin()

//change order status
let Orderstatus=document.querySelectorAll('.status-line')
console.log(Orderstatus)
let hiddenInput=document.querySelector('#hiddenInput')
let order=hiddenInput?hiddenInput.value:null

order=JSON.parse(order)

let time=document.createElement('small')


function update_status(order){

    Orderstatus.forEach((status)=>{
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })

    let step_completed=true
    Orderstatus.forEach((status)=>{
        let dataProp=status.dataset.status
        if(step_completed){
            
            status.classList.add('step-completed')
        }
        console.log(order.status)
        if(dataProp===order.status){
            time.innerText=moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time)
            step_completed=false
            if(status.nextElementSibling){
                status.nextElementSibling.classList.add('current')
            }
            
        }
    })
}

update_status(order)

//socket
let socket=io()

//join
if(order){
    socket.emit('join',`order_${order._id}`)
}

socket.on('orderUpdated',(data)=>{
    const updatedOrder={...order}
    updatedOrder.updatedAt=moment().format()
    updatedOrder.status=data.status
    update_status(updatedOrder)
    new Noty({
        type:'success',
        timeout:500,
        text:'Order Updated',
        progressBar:false
    }).show()
})





