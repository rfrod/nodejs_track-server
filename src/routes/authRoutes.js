const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const router = express.Router();

const User = mongoose.model('User');

const generateToken = (user, res) => {
    const token = jwt.sign({ userId: user._id}, 'MY_SECRET_KEY');
    res.send({ token });
};

router.post('/signup', async (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;

    try{
        const user = new User({email, password});

        await user.save();
        //const token = jwt.sign({ userId: user._id}, 'MY_SECRET_KEY');

        //res.send({ token });
        generateToken(user, res);
    } catch(err){
        return res.status(422).send(err.message);
    }
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password){
        return res.status(422).send({error: "Must provide email and password"});
    }
    const user = await User.findOne({email: email});

    if(!user){
        return res.status(422).send({error: "Invalid email or password"});
    }

    try{
        await user.comparePassword(password);
        //const token = jwt.sign({ userId: user._id}, 'MY_SECRET_KEY');

        //res.send({ token });
        generateToken(user, res);
    } catch(err){
        return res.status(422).send({error: "Invalid email or password"});
    }
});

module.exports = router;