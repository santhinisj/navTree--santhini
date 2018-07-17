/* jshint esversion:6 */

const express = require('express');
const app = express();
const path = require('path');
let solutions = require(path.resolve('src/solutions.js'));
const dataset1 = 'matches';
const dataset2 = 'deliveries';
app.set('view engine', 'ejs');
app.use(express.static('public'));

solutions.getYears(dataset1).then(data => {
    getYears = data;
});
// $('information').

app.get('/', (req, res) => {
    res.render('index');
})

app.get('/years', (req, res) => {
    console.log('inside years');

    res.send(getYears);
});

app.get('/years/:year', (req, res) => {
    let year = req.params.year;
    // console.log("inside router");
    // console.log(year);
    solutions.getTeams(dataset1, year).then(data => {
        // console.log(data);

        res.send(data);
    })
})

app.listen(3000);