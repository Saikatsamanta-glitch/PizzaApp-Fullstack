require('dotenv').config();
const express=require('express');
const app=express();
const port=process.env.PORT || 5000;
const ejs=require('ejs');
const expresslayout=require('express-ejs-layouts');
const path=require('path');
const mongoose=require('mongoose');
const session=require('express-session');
const jwt=require('jsonwebtoken');
const flash=require('express-flash');
const MongoDbStore=require('connect-mongo');
const passport=require('passport');
const userdata=require('./mongodb/user');
const bcrypt=require('bcrypt');
const LocalStrategy=require('passport-local').Strategy;

// Json handling
app.use(express.json());
app.use(express.urlencoded({extended:false}));

// Database connection
mongoose.connect('mongodb://localhost/pizza').then(()=>{
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
    cookie:{maxAge:1000*10*6} //24 hours  1000*60*60*24
}))

// Passport config
app.use(passport.initialize());
passport.use(new LocalStrategy({usernameField:'email'},async (email,password,done)=>{
    //login
    console.log(email,password)
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

app.use(passport.session());



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
    res.render('customers/cart');
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
})

app.listen(port,()=>{
    console.log(`Connected to port ${port}🙋‍♂️`);
});