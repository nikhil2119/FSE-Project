const express = require('express');
const app = express();
const db = require('./config/db');
const port = 3000;

app.get('/', (req, res) => {
    res.send('http:localhost:3000/');
});

app.listen(port, () => {
    console.log(`Running on: http://localhost:${port}`);
});


