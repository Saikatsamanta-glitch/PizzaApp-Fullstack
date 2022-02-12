const router = require('express').Router()
const mongoose=require('mongoose');
const menu=require('../mongodb/menu');

router.get('/',async (req,res)=>{
    const pizzas=await menu.find();   
    res.render('home',{pizzas:pizzas});
});

module.exports  = router