const moment = require('moment')
const Order=require('../../models/order')

const Noty =require('noty')

function orderController(){
    return{
        store(req,res){
            const {phone,address}=req.body
            if(!phone||!address){
                req.flash('error','all fields are mendatory')
                return res.redirect('/cart')
            }

            const order=new Order({
                customerId:req.user._id,
                items:req.session.cart.items,
                phone,
                address
            })

            order.save().then(result=>{
                req.flash('success','Order Placed!!')
                
                delete req.session.cart
              
                return res.redirect('/customer/orders')
            }).catch(err=>{
                req.flash('error','Something went wrong')
                return res.redirect('/cart')
            })
        },
        async index(req,res){
            const orders=await Order.find({customerId:req.user._id},
                null,
                {sort: {'createdAt':-1}})
            
            res.render('customers/orders',{orders:orders,moment:moment})
            
        },
        async show(req,res){
            const order=await Order.findById(req.params.id)

            //authprize
            if(req.user._id.toString()===order.customerId.toString()){
                return res.render('customers/singleOrder',{order})
            }else{
                return res.redirect('/')
            }
        }
    }
}

module.exports=orderController