const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', (req, res) => res.send('Hello World!'));

app.post('/api/temperature', (req, res) => {
    const DataStore = require('nedb');
    const db = new DataStore({filename: './drinkit_temperature.db', autoload: true});

    db.insert(req.body, (err, newDoc) => {
        if (err) {
            res.status(500).send({error: err.message});
        } else {
            res.send({success: "submitted successfully"});
        }
    });
});

app.get('/api/temperature', (req, res) => {
    const DataStore = require('nedb');
    const db = new DataStore({filename: './drinkit_temperature.db', autoload: true});

    const machineId = req.param('machine_id');
    db.find({machine_id: machineId}).sort({timestamp: -1}).limit(30).exec((err, docs) => {
        if (err) {
            res.status(500).send({error: err.message});
        } else {
            res.send({temp: docs});
        }
    });
});

app.post('/api/lowstockalert', (req, res) => {
    const DataStore = require('nedb');
    const db = new DataStore({filename: './drinkit_lowstockalert.db', autoload: true});

    db.insert(req.body, (err, newDoc) => {
        if (err) {
            res.status(500).send({error: err.message});
        } else {
            res.send({success: "submitted successfully"});
        }
    });
});

app.get('/api/lowstockalert', (req, res) => {
    const DataStore = require('nedb');
    const db = new DataStore({filename: './drinkit_lowstockalert.db', autoload: true});

    const machineId = req.param('machine_id');
    db.find({machine_id: machineId}).sort({timestamp: -1}).limit(30).exec((err, docs) => {
        if (err) {
            res.status(500).send({error: err.message});
        } else {
            res.send(docs);
        }
    });
});

app.listen(port, () => console.log(`DrinKit API app listening on port ${port}!`));