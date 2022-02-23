const router = require('express').Router()
const orders = require('../mongodb/order');
const crypto = require('crypto')
router.post('/', (req, res) => {


    const { payment, phone, address } = req.body.formObject;
    console.log(payment)
    // console.log('data',req.body)
    if (!phone || !address) {
        req.flash('error', 'All fields are required!')
        return res.redirect('/cart')
    }
    const order = new orders({
        customerId: req.user._id,
        items: req.session.cart.items,
        phone: phone,
        address: address,
        paymentType: payment
    })

    if (payment === 'Online') {
        order_id = req.body.orderId;
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body.response;
        // console.log(razorpay_payment_id, razorpay_order_id, razorpay_signature)
        // Pass yours key_secret here 
        const key_secret = '2SnRuoVgNbOahdSIheR9jsuq';
        // STEP 8: Verification & Send Response to User
        // Creating hmac object 
        let hmac = crypto.createHmac('sha256', key_secret);
        // Passing the data to be hashed
        hmac.update(order_id + "|" + razorpay_payment_id);
        // Creating the hmac in the required format
        const generated_signature = hmac.digest('hex');
        console.log('raxorpay :' + razorpay_signature)
        console.log('generated :' + generated_signature)
        if (razorpay_signature === generated_signature) {
            order.save().then(() => {
                // req.flash('success','Order placed successfully');
                delete req.session.cart;
                // return res.redirect('/orderspage');
                return res.json({ 'success': 'Order placed successfully' });
            }).catch((err) => {
                req.flash('error', 'something went wrong');
                return res.redirect('/cart')
            })
        }


        // else {
        //     req.flash('error','something went wrong');
        //     return res.redirect('/cart')
        // }
    }
    if (payment === 'COD') {

        order.save().then(() => {
            // req.flash('success','Order placed successfully');
            delete req.session.cart;
            // return res.redirect('/orderspage');
            return res.json({ 'success': 'Order placed successfully' });
        }).catch((err) => {
            req.flash('error', 'something went wrong');
            return res.redirect('/cart')
        })
    }




});

module.exports = router