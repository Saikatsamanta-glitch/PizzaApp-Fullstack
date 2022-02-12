const router = require('express').Router();
router.post('/',(req,res)=>{

    // If cart is created first time 
    if(!req.session.cart){
        req.session.cart={
            items:{
                // pizzaId: {item: pizzaObj, qty:0}
                // pizzaId: {item: pizzaObj, qty:0}
                // pizzaId: {item: pizzaObj, qty:0}
                // pizzaId: {item: pizzaObj, qty:0}
            },
            totalQty:0,
            totalPrice:0
        }
    }

    let cart=req.session.cart;
    // Check if item does not exist in cart
    if(!cart.items[req.body._id]){
        cart.items[req.body._id]={
            item: req.body,
            qty:1
        }
        cart.totalQty=cart.totalQty+1
        cart.totalPrice=cart.totalPrice+req.body.price
    }else{
        cart.items[req.body._id].qty=cart.items[req.body._id].qty+1
        cart.totalQty=cart.totalQty+1;
        cart.totalPrice=cart.totalPrice+req.body.price;
    }


    return res.json({totalQty:req.session.cart.totalQty}); 
})

module.exports  = router