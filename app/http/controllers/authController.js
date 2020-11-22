
const User=require('../models/userDb')
const bcrypt=require('bcrypt')
const passport = require('passport')

function authControllers(){

    const _getRedirectUrl=(req)=>{
        return req.user.role==='admin'?'/admin/orders':'customer/orders'
    }
    return{
        login(req,res){
            res.render('auth/login')
        },
        register(req,res){
            res.render('auth/register')
        },
        postLogout(req,res){
            req.logout()
            return res.redirect('/')
        },
        postLogin(req,res,next){
            passport.authenticate('local',(err,user,info)=>{

                if(err){
                    req.flash('error', info.message)
                    return next(err)
                }
                if(!user){
                    req.flash('error', info.message)
                    return res.redirect('/login')
                }

                req.login(user,(err)=>{
                    if(err){
                        req.flash('error', info.message)
                        return next(err)
                    }

                    

                    return res.redirect(_getRedirectUrl(req))
                })

            })(req,res,next)
        },
        async postRegister(req,res){
            const{ name,email,password}=req.body
            //validate request
            if(!name || !email || !password){
                req.flash('error','All fields are required')
                return res.redirect('/register')
            }

            User.exists({email:email},(err,result)=>{
                if(result){
                    req.flash('error','Email already taken')
                    req.flash('name',name)
                    req.flash('email',email)
                    return res.redirect('/register')
                }
            })

            //hasg password

            const hashedPassword=await bcrypt.hash(password,10)

            const user=new User({
                name,
                email,
                password:hashedPassword
            })
            user.save().then((user)=>{
                return res.redirect('/')
                console.log("success")
            }).catch(err=>{
                    req.flash('error','Something went wrong')
                    return res.redirect('/register')
            })
        }
    }
}

module.exports=authControllers