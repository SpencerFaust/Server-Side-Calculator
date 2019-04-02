const express = require('express');
const app = express();
const bodyParser = require('body-parser');
let PORT = process.env.PORT || 5000;

let problemRoute = require('./modules/problem-list');
let secondProbRoute = require('./modules/second-problem-list')

app.use(express.static('server/public'));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/problems', (req, res) => {
    console.log(problemRoute);
    res.send(problemRoute);
});

app.post('/newProblem', (req, res) => {
    if(req.body.actionImposed === '+' ) {
        {req.body.answer = Number(req.body.numberOne) + Number(req.body.numberTwo)} 
    } else if (req.body.actionImposed === '-' ) {
        {req.body.answer = Number(req.body.numberOne) - Number(req.body.numberTwo)} 
    } else if (req.body.actionImposed === '*' ) {
        {req.body.answer = Number(req.body.numberOne) * Number(req.body.numberTwo)} 
    } else {
        {req.body.answer = Number(req.body.numberOne) / Number(req.body.numberTwo)} 
    };
    console.log(req.body);
    
    problemRoute.unshift(req.body);
    res.sendStatus(201);
});

app.get('/second-problem-list', (req, res) => {
    console.log(secondProbRoute);
    res.send(secondProbRoute);
});

app.post('/second-problem-list', (req, res) => {
    if(req.body.operator === '+' ) {
        {req.body.answerToo = Number(req.body.first) + Number(req.body.second)} 
    } else if (req.body.operator === '-' ) {
        {req.body.answerToo = Number(req.body.first) - Number(req.body.second)} 
    } else if (req.body.operator === '*' ) {
        {req.body.answerToo = Number(req.body.first) * Number(req.body.second)} 
    } else {
        {req.body.answerToo = Number(req.body.first) / Number(req.body.second)} 
    };
    secondProbRoute.unshift(req.body);
    res.sendStatus(201);
});

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
})