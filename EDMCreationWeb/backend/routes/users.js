const router = require('express').Router();
const User = require('../models/user.model');
const { check, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
const JSRSASign = require("jsrsasign");
require('dotenv').config();

//sign up 
router.route('/signup').post(
    [
        check('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
        check('email').isEmail().withMessage('Email is invalid'),
        check('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters'),
        check('confirmationPassword').custom((value, { req }) => (value === req.body.password)).withMessage('Passwords do not match')
    ],
    (req, res) => {
        //check the results of  the validation
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() })
        }

        const { username, email, password } = req.body;

        //check if existing username or email
        User.findOne(
            {
                $or: [
                    { "email": { $regex: new RegExp(email, "i") } },
                    { "username": { $regex: new RegExp(username, "i") } }
                ]
            })
            .then(user => { //$or selects from either elements of array
                if (user) { //if found
                    if (user.email.toLowerCase() === email.toLowerCase()) //triple = for exact match, type and value
                        return res.status(400).json({ msg: "This email has already been registered" });
                    else
                        return res.status(400).json({ msg: "This username has been taken" });
                } else { //no collisions
                    //creating user
                    const listens_count = 0;
                    const upload_count = 0;
                    const newUser = new User({ username, email, password, listens_count, upload_count });

                    //hashing password before storing it in database
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) return res.status(400).json('Error: ' + err);
                            newUser.password = hash;
                            newUser.save()
                                .then(() => res.status(200).json('Registration successful!'))
                                .catch(err => res.status(400).json('Error: ' + err));
                        });
                    });

                    //creating web token for registration sign in
                    var day = new Date();
                    var time = day.getTime(); //get time to embed in token 
                    time += 604800000; //7 day expiration

                    const claims = { //assaign payload
                        Username: username,
                        ID: newUser.id, //new user for one just created
                        Expires: time
                    }

                    const key = process.env.JWT_KEY; //signature key
                    const header = { //token description
                        alg: "HS512",
                        typ: "JWT"
                    };

                    var sHeader = JSON.stringify(header);
                    var sPayload = JSON.stringify(claims);

                    const sJWT = JSRSASign.jws.JWS.sign("HS512", sHeader, sPayload, key); //token creation

                    res.json({ sJWT, msg: 'Registration Successful!' }); //return token in body for log in
                } //end adding user
            }); //end of user search
    }); //end registration

//login
router.route('/login').post(
    (req, res) => {
        const { username, password } = req.body;

        //creating user
        const oldUser = new User({ username, password });

        User.findOne(
            {
                $or: [
                    { "email": { $regex: new RegExp(username, "i") } },
                    { "username": { $regex: new RegExp(username, "i") } }
                ]
            })
            .then(user => {
                if (user) {//if username found
                    bcrypt.compare(password, user.password).then(isMatch => {
                        if (isMatch) {
                            //creating web token for normal sign in
                            var day = new Date();
                            var time = day.getTime(); //get time to embed in token 
                            time += 604800000; // 7 day expiration

                            const claims = { //assaign payload
                                Username: username,
                                ID: user.id,
                                Expires: time
                            }

                            const key = process.env.JWT_KEY; //signature key
                            const header = { //token description
                                alg: "HS512",
                                typ: "JWT"
                            };

                            var sHeader = JSON.stringify(header);
                            var sPayload = JSON.stringify(claims);

                            const sJWT = JSRSASign.jws.JWS.sign("HS512", sHeader, sPayload, key); //token creation

                            res.status(200).json({ sJWT, username: user.username, user_id: user_id, msg: 'Login successful!' }); //return token in body for log in      
                        } else {
                            return res.status(400).json({ msg: "Incorrect password" });
                        } //end password checking
                    }); //exact match
                } //end username match
                else {
                    return res.status(400).json({ msg: "Invalid username" });
                }
            }); //end user search
}); //end login



router.route('/info/:user_id').get((req, res) => {
    
});




module.exports = router;