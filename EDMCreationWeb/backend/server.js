const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;//file or 5000

//for gridfs use
const bodyParser = require('body-parser');
const path = require('path');
const crypto = require('crypto');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');

app.use(cors());
app.use(express.json());
//added for gridfs
app.use(bodyParser.json());
app.use(methodOverride('_method'));

// MongoDB Database
const uri = process.env.ATLAS_URI;//for connection
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
    console.log("MongoDB database connection established successfully");
});

// Routes
app.use('/api/users', require('./routes/users'));//combined
app.use('/api/compositions', require('./routes/compositions'));//combined

// Server
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

// Test Routes
app.use("/api/testlogin", (req, res) => {
    res.send(
        {
            "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
            "username": "edmguy"
        }
    );
});

app.use("/api/testuser", (req, res) => {
    res.send(
        {
            "username": "edmguy",
            "description": "Love EDM",
            "total_plays": "50",
            "uploads": "3",
            "user_id": "1"
        }
    );
});

app.use("/api/anothertestuser", (req, res) => {
    res.send(
        {
            "username": "user",
            "description": "EDM",
            "total_plays": "10",
            "uploads": "5",
            "user_id": "2"
        }
    );
});

app.use("/api/testuserprivate", (req, res) => {
    res.send(
        {
            "username": "edmguy",
            "description": "Love EDM",
            "total_plays": "50",
            "uploads": "3",
            "email": "edmguy@gmail.com"
        }
    );
});

app.use("/api/testfollowing", (req, res) => {
    res.send(
        [
            {
                "username": "edmguy",
                "description": "Long long long long long long long long long long long long long long long long long long long long long long long long long description",
            },
            {
                "username": "edm",
                "description": "EDM",
            },
            {
                "username": "user",
                "description": "Description",
            }
        ]
    );
});

app.use("/api/testsongs", (req, res) => {
    res.send(
        [
            {
                "title": "EDM Composition #1",
                "genre": "Genre 1",
                "username": "edmguy",
                "date": "Jan. 1, 2021",
                "likes": 10,
                "liked": true,
                "listens": 132,
                "num_comments": 3,
                "comments": [
                    {
                        "username": "user1",
                        "comment": "Great Great Great Great Great Great Great Great Great Great Great Great Great Great Great Great Great Great Great Great Great Great",
                        "date": "Jan. 3, 2021"
                    },
                    {
                        "username": "user2",
                        "comment": "Good",
                        "date": "Jan. 2, 2021"
                    },
                    {
                        "username": "user1",
                        "comment": "Good Good Good Good Good Good Good Good Good Good Good Good Good Good Good Good Good Good",
                        "date": "Jan. 2, 2021"
                    },
                    {
                        "username": "user2",
                        "comment": "Good",
                        "date": "Jan. 1, 2021"
                    },
                    {
                        "username": "user1",
                        "comment": "Great ",
                        "date": "Jan. 1, 2021"
                    },
                    {
                        "username": "user2",
                        "comment": "Good",
                        "date": "Jan. 1, 2021"
                    }
                ]
            },
            {
                "title": "EDM Composition #2",
                "genre": "Genre 1",
                "username": "edmguy",
                "date": "Jan. 3, 2021",
                "likes": 11,
                "liked": false,
                "listens": 15,
                "num_comments": 2,
                "comments": [
                    {
                        "username": "user1",
                        "comment": "Good",
                        "date": "Jan. 3, 2021"
                    },
                    {
                        "username": "user2",
                        "comment": "Good",
                        "date": "Jan. 1, 2021"
                    }
                ]
            },
            {
                "title": "EDM Composition #3",
                "genre": "Genre 1",
                "username": "edmguy",
                "date": "Jan. 2, 2021",
                "likes": 3,
                "liked": true,
                "listens": 35,
                "num_comments": 1
            }
        ]
    );
});

app.use("/api/testsong", (req, res) => {
    res.send(
        {
            "title": "EDM Composition #3",
            "genre": "Genre 1",
            "username": "edmguy",
            "date": "Jan. 2, 2021",
            "likes": 3,
            "liked": true,
            "listens": 35,
            "num_comments": 1
        }
    );
});


app.use("/api/testsongnext", (req, res) => {
    res.send([
        {
            "title": "EDM Composition #3",
            "genre": "Genre 1",
            "username": "edmguy",
            "date": "Jan. 2, 2021",
            "likes": 3,
            "liked": true,
            "listens": 35,
            "num_comments": 1
        }
    ]);
});

// Swagger
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./edmcreationweb.yaml');

app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass