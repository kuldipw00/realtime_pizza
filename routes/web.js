
const homeController=require('../app/http/controllers/homeController')
const authController=require('../app/http/controllers/authController')
const cartController=require('../app/http/controllers/customer/cartController')
const orderController=require('../app/http/controllers/customer/orderController')
const adminController=require('../app/http/controllers/admin/adminOrderController')
const statusController=require('../app/http/controllers/admin/statusController')

//middlewares
const guest=require('../app/http/middlewares/guests')
const auth=require('../app/http/middlewares/auth')
const admin=require('../app/http/middlewares/admin')

function initRoutes(app){
    
    app.get('/',homeController().index)
    app.get('/login',guest,authController().login)
    app.post('/login',authController().postLogin)
    app.post('/logout',authController().postLogout)
    app.get('/register',guest,authController().register)
    app.post('/register',authController().postRegister)
    app.post('/update-cart',cartController().update)
    app.get('/cart',cartController().cart)
    

    // customer routes
    app.post('/order',auth,orderController().store)
    app.get('/customer/orders',auth,orderController().index)
    app.get('/customer/orders/:id',auth,orderController().show)


    //admin routes
    app.get('/admin/orders',admin,adminController().index)

    //admin status routes
    app.post('/admin/order/status',admin,statusController().update)

   
    
    
}
module.exports=initRoutes