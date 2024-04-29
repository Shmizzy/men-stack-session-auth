const express = require('express');
const User = require('../models/user.js')
const bcrypt = require('bcrypt');
const router = express.Router();

router.get('/sign-up', (req, res) => {
    res.render('auth/sign-up.ejs');
});
router.get('/sign-in', (req, res) => {
    res.render('auth/sign-in.ejs');
})
router.get('/sign-out', (req, res) => {
    req.session.destroy();
    res.redirect('/');
})

router.post('/sign-up', async (req, res) => {
    const userInDatabase = await User.findOne({
        username: req.body.username
    });

    if(userInDatabase) return res.send('Username already taken.');
    if(req.body.password !== req.body.confirmPassword) return res.send('Password and Confirm Password must match');

    const hashedPw = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPw;

    const user = await User.create(req.body);
    res.send(`Thanks for signing up! ${user.username}`);
});

router.post('/sign-in', async (req, res) => {
    const userInDatabase = await User.findOne({username: req.body.username});

    if(!userInDatabase) return res.send('Login failed. Username not found!');

    const validPassword = bcrypt.compareSync(
        req.body.password,
        userInDatabase.password
    );

    if(!validPassword) return res.send('Login failed. Wrong Password!');

    req.session.user = {
        username: userInDatabase.username,
    }

    res.redirect('/');
    

})



module.exports = router;