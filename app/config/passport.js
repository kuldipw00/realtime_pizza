

const LocalStratergy=require('passport-local').Strategy
const User=require('../http/models/userDb')
const bcrypt=require('bcrypt')

function init(passport){

    passport.use(new LocalStratergy({usernameField:'email'},async (email,password,done)=>{
        //login
        //check if email exists
        const user=await User.findOne({email:email})
        if(!user){
            return done(null,false,{message:'No user with this email'})
        }

        bcrypt.compare(password,user.password).then(match=>{
            if(match){
                return done(null,user,{message:'Login successfully'})
            }
            return done(null,false,{message:'Wrong password'})
        }).catch(err=>{
            return done(null,false,{message:'Wrong password'})
        })


    }))

    passport.serializeUser((user,done)=>{
        done(null,user._id)

    })

    passport.deserializeUser((id,done)=>{
        User.findById(id,(err,user)=>{
            done(err,user)
        })
    })



}

module.exports=init