const express=require('express');
const app=express();
const port=process.env.PORT || 5000;
const ejs=require('ejs');
const expresslayout=require('express-ejs-layouts');
const path=require('path');

// set Template engine


app.set('views',path.join(__dirname,'/resources/views'));
app.set('view engine','ejs');
// Assests
app.use(express.static('public'))

app.get('/',(req,res)=>{
    res.render('home');
});
app.get('/cart',(req,res)=>{
    res.render('customers/cart');
});
app.get('/login',(req,res)=>{
    res.render('auth/login');
});
app.get('/register',(req,res)=>{
    res.render('auth/register');
});
app.listen(port,()=>{
    console.log(`Connected to port ${port}🙋‍♂️`);
});