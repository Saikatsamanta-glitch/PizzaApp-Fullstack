const router = require('express').Router()
const Userdata = require('../mongodb/user');
const bcrypt = require('bcrypt');
const guest = require('../resources/middleware/guest');
router.get('/', guest, (req, res) => {
    res.render('auth/register');
});
router.post('/', async (req, res) => {
    const { name, email, password } = req.body;
    console.log(name, email, password)
    // check if email exists
    const userexist = await Userdata.findOne({ email: email });
        if (userexist) {
            req.flash('error', 'email already exists')
            return res.redirect('/register');
        }
    // Hashing password for security
    const hashedpass = await bcrypt.hash(password, 10);

    //Create a user
    const user = new Userdata({
        name: name,
        email: email,
        password: hashedpass
    });
    await user.save().then(() => {
        // Login will be added here
        return res.redirect('/login')
    }).catch((err) => {
        req.flash('error', 'something went wrong')
        return res.redirect('/register');
    });
})

module.exports = router;