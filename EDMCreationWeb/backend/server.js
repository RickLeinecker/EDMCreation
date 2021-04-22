const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;//file or 5000
const https = require('https');
const fs = require('fs');

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
// app.listen(port, () => {
//     console.log(`Server is running on port: ${port}`);
// });

const httpsOptions = {
    key: fs.readFileSync('./security/cert.key'),
    cert: fs.readFileSync('./security/cert.pem')
}

const server = https.createServer(httpsOptions, app)
    .listen(port, () => {
        console.log('Server running at ' + port)
    })

// Swagger
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./edmcreationweb.yaml');

app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass