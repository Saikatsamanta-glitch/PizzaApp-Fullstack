const passport = require('passport');

const router = require('express').Router()

const guest=require('../resources/middleware/guest')

router.get('/',guest, (req,res)=>{
    res.render('auth/login');
});

router.post('/',(req,res,next)=>{
    passport.authenticate('local', (err,user,info)=>{
        if(err){
            req.flash('error',info.message)
            return next(err)
        }
        if(!user){ 
            req.flash('error',info.message)
            return res.redirect('/login')
        }
        req.logIn(user,(err)=>{
            if(err){
                req.flash('error',info.message);
                return next(err)
            }
            return res.redirect('/')
        })
    })(req,res,next)
})
module.exports  = router