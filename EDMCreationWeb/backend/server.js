const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Database
const uri = process.env.ATLAS_URI;

mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }
);

const connection = mongoose.connection;

connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
});

let User = require('./models/user.model');

// Routes
const usersRouter = require('./routes/users');

app.use('', usersRouter);

// Server
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

// Test Routes
app.use("/api/testlogin", (req, res) => {
    res.send(
        {
            "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
        }
    );
});

app.use("/api/testuser", (req, res) => {
    res.send(
        {
            "username": "edmguy",
            "description": "Love EDM",
            "total_plays": "50",
            "uploads": "3"
        }
    );
});

app.use("/api/testcompositions", (req, res) => {
    res.send(
        [
            {
                "title": "EDM Composition #1",
                "username": "edmguy",
                "date": "Jan. 1, 2021",
                "likes": "10",
                "listens": "132",
                "num_comments": "3",
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
                "username": "edmguy",
                "date": "Jan. 3, 2021",
                "likes": "11",
                "listens": "101",
                "num_comments": "5",
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
                "username": "edmguy",
                "date": "Jan. 2, 2021",
                "likes": "3",
                "listens": "35",
                "num_comments": "1"
            }
        ]
    );
});

// Swagger
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./edmcreationweb.yaml');

app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));