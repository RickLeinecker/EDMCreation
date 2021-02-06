const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;//file or 5000

app.use(cors());
app.use(express.json());


// MongoDB Database
const uri = process.env.ATLAS_URI;//for connection
mongoose.connect(uri, { 
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true }
);
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
});



// Routes
app.use('/api/users', require('./routes/users'));//combined
app.use('/api/compositions', require('./routes/compositions'));//combined


// Server
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});


// Swagger
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./edmcreationweb.yaml');

app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass