require('dotenv').config();
const express=require('express');
const app=express();
const port=process.env.PORT || 5000;
const ejs=require('ejs');
const expresslayout=require('express-ejs-layouts');
const path=require('path');
const mongoose=require('mongoose');
const session=require('express-session');
const flash=require('express-flash');
const MongoDbStore=require('connect-mongo');
const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;
const passports=require('./resources/middleware/passport');
const orders=require('./mongodb/order');
const moment=require('moment');
const auth=require('./resources/middleware/auth');
const Razorpay = require('razorpay'); 
// Json handling 
app.use(express.json());
app.use(express.urlencoded({extended:false}));
// Database connection
mongoose.connect(process.env.MONGODB_URI).then(()=>{
    console.log('connected🍕');
}).catch(()=>{
    console.log('disconneted😒')
})
// Session config
app.use(session({
    secret: process.env.COOKIE_SECRET,  //create a .env file and store COOKIE_SECRET
    resave:false,
    // https://www.diffchecker.com/6Vuly2qx 
    store: MongoDbStore.create({
        mongoUrl: 'mongodb://localhost/pizza',
        collectionName:'sessions'
    }),
    saveUninitialized:false,
    cookie:{maxAge:1000*10*6*10} //24 hours  1000*60*60*24
}))
// Passport config
app.use(passport.initialize());
passports();
app.use(passport.session());

//Razor pay integration



// Flash message
app.use(flash());

// Global middleware
app.use((req,res,next)=>{
    res.locals.session=req.session;
    res.locals.user=req.user;
    next() 
});
// set Template engine
app.set('views',path.join(__dirname,'/resources/views'));
app.set('view engine','ejs');
//Static Assests
app.use(express.static('public'))
//Home-root
app.use('/',require('./routes/home-root'));
//Cart-root
app.get('/cart',(req,res)=>{
    var instance = new Razorpay({
        key_id: 'rzp_test_iViU4lic20ILDr',
        key_secret: '2SnRuoVgNbOahdSIheR9jsuq',
      });
      // order_IxUbvX3dp7Qqud
      var options = {
        amount: 40000,  // amount in the smallest currency unit
        currency: "INR",
        receipt: "order_rcptid_11"
      };
      instance.orders.create(options, function (err, order) {
        // console.log(order.id);
        
        res.render('customers/cart', { OrderId: order.id })
      })
    
});
// Update-cart
app.use('/update-cart',require('./routes/update-cart'));
// login
app.use('/login',require('./routes/login-root'));
// register
app.use('/register',require('./routes/register-root'));
// logout
app.post('/logout',(req,res)=>{
    req.logOut();
    return res.redirect('/login');
});
// Orders
app.use('/order',require('./routes/order-root'));
// after orderpage
app.get('/orderspage',auth,async (req,res)=>{
    const order=await orders.find({customerId:req.user._id},null,{sort: {'createdAt':-1}})
    res.render('customers/orders',{orders:order,moment:moment})
});
// admin
app.get('/admin',async(req,res)=>{
    await orders.find({status:{$ne:'completed'}},null,{sort:{'createdAt':-1}}).populate('customerId','-password').exec((err,orders)=>{
        res.render('admin/admin')
    });
})
app.get('*',(req,res)=>{
    res.send('404 page not found')
})
app.listen(port,()=>{
    console.log(`Connected to port ${port}🙋‍♂️`);
});
