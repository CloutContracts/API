const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');



var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = 3000;

// app.get('*', (req, res) => {

//     res.status(404).send("page not found");
// });

app.get('/', (req, res) => {
    res.status(404).send("Welcome To Roll Up Api");
});

const rollUp = require('./routes/api/rollUpApi.js');
const rollUpRinkey = require('./routes/api/rollUpRinkey.js');


app.use('/api/v1/rollup', rollUp);
app.use('/api/v1/rollUpRinkey', rollUpRinkey);

app.listen(process.env.PORT || port, () => { console.log("Roll Up project API are live now.")})

