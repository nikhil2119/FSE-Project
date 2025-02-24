const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const dotenv = require('dotenv');
dotenv.config();


//routes
const userRoutes = require('./routes/userroutes');


//middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//routes
app.get('/', (req, res) => {
    res.send('<h1 style="text-align: center;"> HomePage </h1>');
});


app.use('/api/users', userRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Running on: http://localhost:${process.env.PORT}`);
});


