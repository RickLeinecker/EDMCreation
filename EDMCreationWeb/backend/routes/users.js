const router = require('express').Router();
const User = require('../models/user.model');
const { check, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
const JSRSASign = require("jsrsasign");
require('dotenv').config();


//sign up 

router.route('/signup').post([
    check('username').isLength({ min: 3 }), //min username length 3
    check('email').isEmail(),               // is a valid email
    check('password').isLength({ min: 5 })  //min password length 5
    ], (req, res) => {
    //check the results of  the validation
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    const {username, email, password} = req.body;
    //check if existing username or email
    User.findOne({$or:[{email},{username}]}).then(user => { //$or selects from either elements of array
        if (user) {//if found
           if (user.email === email) //triple = for exact match, type and value
              return res.status(400).json({ msg: "This email has been taken" });
           else
              return res.status(400).json({ msg: "This Username has been taken" });
        } else {//no collisions
            //creating user
            const listens_count = 0;
            const upload_count = 0;
            const newUser = new User({ username, email, password, listens_count, upload_count });
            // hashing password before storing it in database
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                 if (err) return res.status(400).json('Error: ' + err);
                 newUser.password = hash;
                 newUser.save()
                    //.then(() => res.json('Registration successful!'))
                    .catch(err => res.status(400).json('Error: ' + err));
              });
            });
            //creating web token for registration sign in
            var day = new Date();
            var time = day.getTime();//get time to embed in token 
            time += 604800000;// 7 day expiration
            const claims = { //assaign payload
                 Username: username,
                 ID: newUser.id, //new user for one just created
                 Expires: time
            }
            const key = process.env.JWT_KEY;//signature key
            const header = {//token description
                alg: "HS512",
                typ: "JWT"
            };
            var sHeader = JSON.stringify(header);
            var sPayload = JSON.stringify(claims);
            const sJWT = JSRSASign.jws.JWS.sign("HS512", sHeader, sPayload, key);//token creation
            res.json({sJWT, msg:'Registration Successful!'});//return token in body for log in
        }//end adding user
    });//end of user search
});//end registration



//login

router.route('/login').post([
    check('username').isLength({ min: 3 }), //min username length 3
    check('password').isLength({ min: 5 })  //min password length 5
    ], (req, res) => {
    //check the results of  the validation
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    const {username, password} = req.body;
    //creating user
    const oldUser = new User({ username, password });
    User.findOne({username}).then(user => { 
        if (user) {//if username found
            if (user.username === username) {//triple = for exact match, type and value                  
                // hashing password to verify
                bcrypt.compare(password, user.password).then(isMatch => {
                    if (isMatch) {
                            //creating web token for normal sign in
                            var day = new Date();
                            var time = day.getTime();//get time to embed in token 
                            time += 604800000;// 7 day expiration
                            const claims = { //assaign payload
                                Username: username,
                                ID: user.id,
                                Expires: time
                            }
                            const key = process.env.JWT_KEY;//signature key
                            const header = {//token description
                                alg: "HS512",
                                typ: "JWT"
                            };
                            var sHeader = JSON.stringify(header);
                            var sPayload = JSON.stringify(claims);
                            const sJWT = JSRSASign.jws.JWS.sign("HS512", sHeader, sPayload, key);//token creation
                            res.json({sJWT, msg:'Login Successful!'});//return token in body for log in      
                    }else{
                        return res.status(400).json({ msg: "Incorrect Password" }); 
                    }//end password checking
                });//exact match
            } else {//no collisions, invalid log in username
                return res.status(400).json({ msg: "Invalid Username" });  
            }//end else for no collisions
        }//end username match
    });//end user search
});//end login



module.exports = router;