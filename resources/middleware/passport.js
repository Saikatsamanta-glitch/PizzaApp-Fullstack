const passport=require('passport');
const userdata=require('../../mongodb/user');
const bcrypt=require('bcrypt');
const LocalStrategy=require('passport-local').Strategy;


const pass=()=>{
passport.use(new LocalStrategy({usernameField:'email'},async (email,password,done)=>{
    //login
  
    // check if email exists
    const user=await userdata.findOne({email:email});
    if(!user){
        return done(null,false,{message: 'No user with this email'})
    }
    bcrypt.compare(password,user.password).then(match=>{
        if(match){
            return done(null,user,{message: 'logged in successfully'})
        }
        return done(null, false,{message:'Wrong credentials'})
    }).catch(err=>{
        return done(null, false,{message:'Something went wrong'})
    })
    
}))
passport.serializeUser((user,done)=>{
    done(null,user._id)
})
passport.deserializeUser((id,done)=>{
    userdata.findById(id,(err,user)=>{
        done(err,user)
    })
})
}
module.exports=pass;