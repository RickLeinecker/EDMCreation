const router = require('express').Router();
const Composition = require('../models/compositions.model');
const User = require('../models/user.model');
const { check, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
const mongoose = require('mongoose');
const JSRSASign = require("jsrsasign");
const auth = require('../middleware/auth');
require('dotenv').config();

//post composition
router.route('/upload').post(auth,(req, res) =>{
    
    const { title, description, ID } = req.body;

    user_id = ID;

    const newComp = new Composition({ title, description, user_id });


    newComp.save()
        .then(()=>User.updateOne({_id:ID}, {$push: {"compositions": {"_id":newComp.id, "title":title, "description":description }}}))
        .then(() => res.status(200).json({ msg: 'composition uploaded'}))
        .catch(err => res.status(400).json('Error: ' + err));

        
});

module.exports = router;