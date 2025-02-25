const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const dotenv = require('dotenv');
dotenv.config();


//routes
const userRoutes = require('./routes/userroutes');
const categoryRoutes = require('./routes/categoryRoutes');
const authRoutes = require('./routes/authRoutes');

//middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);

//listen port
app.listen(process.env.PORT, () => {
    console.log(`Running on: http://localhost:${process.env.PORT}`);
});


