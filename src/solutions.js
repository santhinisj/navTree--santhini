/* jshint esversion:6 */
const path = require('path');
let mongoapi = require(path.resolve('mongoStuff/mongodb-connect'));
// var round = require('mongo-round');

const getYears = (dataset) => {
    return new Promise((resolve, reject) => {
        mongoapi.connectToMongo().then((db) => {
            db.collection(dataset).aggregate([{
                    $group: {
                        _id: "$season"
                    }
                },
                {
                    $sort: { _id: 1 }
                }
            ]).toArray().then((docs) => {
                // console.log(docs);
                resolve(docs);
                console.log("years");

            }), (err) => {
                console.log("cannot fetch data", err);
            }
        });
    });
};

const getTeams = (dataset, year) => {
    console.log("inside getteams");

    console.log(year);

    return new Promise((resolve, reject) => {
        mongoapi.connectToMongo().then((db) => {
            db.collection(dataset).aggregate([
                { $match: { season: parseInt(year) } },
                {
                    $group: {
                        _id: "$team1"
                    }
                }
            ]).toArray().then((docs) => {
                console.log(docs);
                resolve(docs);
                console.log("teams");

            }), (err) => {
                console.log("cannot fetch data", err);
            }
        });
    });
};
module.exports = {
    getYears,
    getTeams
};