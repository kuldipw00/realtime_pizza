
const homeController=require('../app/http/controllers/homeController')
const authController=require('../app/http/controllers/authController')
const cartController=require('../app/http/controllers/customer/cartController')
const guest=require('../app/http/middlewares/guests')
function initRoutes(app){
    
    app.get('/',homeController().index)
    app.get('/login',guest,authController().login)
    app.post('/login',authController().postLogin)
    app.post('/logout',authController().postLogout)
    app.get('/register',guest,authController().register)
    app.post('/register',authController().postRegister)
    app.post('/update-cart',cartController().update)
    app.get('/cart',cartController().cart)
   
    
    
}
module.exports=initRoutes