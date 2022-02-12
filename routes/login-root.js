const router = require('express').Router()


router.get('/',(req,res)=>{
    res.render('auth/login');
});

module.exports  = router