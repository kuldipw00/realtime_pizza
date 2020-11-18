
import axios from 'axios'
import Noty from 'noty'
const { update } = require("../../app/http/models/menu");

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
