const router = require('express').Router();
const Composition = require('../models/compositions.model');
const User = require('../models/user.model');
const { check, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
const mongoose = require('mongoose');
const JSRSASign = require("jsrsasign");
const auth = require('../middleware/auth');
require('dotenv').config();

//for gridfs use
const bodyParser = require('body-parser');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const { Router } = require('express');



//had to put here as well as index so I can use gfs?
const uri = process.env.ATLAS_URI;//for connection //needed even in here
mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}
);
const connection = mongoose.connection;

let gfs;
connection.once('open', () => {
    gfs = Grid(connection.db, mongoose.mongo);
    gfs.collection('uploads');
});




// Create storage engine
const storage = new GridFsStorage({
    url: uri,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            
            crypto.randomBytes(16, (err, buf) => {
                
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    metadata: req.body.ID,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});
const upload = multer({ storage });



//upload new composition
router.route('/upload').post(auth, upload.single('file'), auth, (req, res) => { 
    
    //'file' for field name from front end  
    //AUTH CALLED TWICE BECAUSE MULTER OCCUPIES REQUESTBODY until after 
        
    const { title, description, ID, genre, image_id, uName } = req.body;

    //if fields are missing, need to add error here for it and remove song that was just uploaded?

    const file_id = req.file.id;//id from file being stored
    const filename = req.file.filename;
    listens = 0;//0 listens
    favorites=0;// 0 favorites
    comment_count=0;
    user_id = ID;//for finding accoun
    username = uName;

    const newComp = new Composition({ title, description, genre, image_id, user_id, username, file_id, listens,favorites,comment_count, filename });//just drop this line for only user upload?
    

    User.updateOne({ _id: ID }, { $push: { "compositions": newComp}, $inc:{upload_count: 1} })
        .then(() => res.status(200).json({ msg: 'composition uploaded' }))
        .catch(err => res.status(400).json('Error: ' + err));//might need to remove uploaded song from database if error occured
    
    //need to redirect on page once done? 
});



//single play and update count for when a user hits play on a given song
router.route('/play/:filename').get( (req, res)=>{
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
        // Check if file
        if (!file || file.length === 0) {
          return res.status(404).json({err: 'No file exists'});
        }
        
        // File exists
        
        // Check if midi then load
        if (file.contentType === 'audio/mid') {
            
        } else {
            return res.status(404).json({err: 'Not a MID file'});
        }
        const readstream = gfs.createReadStream(file.filename);
        
        //update listens for comp and user and send file data
        User.updateOne({"compositions.filename": req.params.filename}, { $inc: { "compositions.$.listens": 1 , listens_count: 1}})
            .then(() => readstream.pipe(res))//Return File for playing
            .catch(err => res.status(400).json('Error: ' + err));//might need to remove uploaded song from database if error occured
        
    });
});



//load multiple composition infos for pages
//REQUIRES PAGE NUMBER IN ROUTE, STARTING ON 1
router.route('/popular/:page').get( async (req, res)=>{


    //need to pull page amounts of entries sorted by a specific value
    //splice can be used for selective returns including skipping
    skip = 6*(req.params.page - 1);

    try {
        const items = await User.aggregate([
                        
            {$unwind : "$compositions"},
            {$project : {_id : 0, 
                         id : "$compositions.filename",
                         listens: "$compositions.listens"
                        },
            },
            
            {$sort: { "listens": -1 }},//descending values for listens

            { $skip: skip }, { $limit: 6 } //skip controls page number and limit controls output
        ])
        if (!items) throw Error('No items');
    
        res.status(200).json(items);
      } catch (e) {
        res.status(400).json({ msg: e.message });
      }


    
    //need to also pull images for associated songs?
});








module.exports = router;