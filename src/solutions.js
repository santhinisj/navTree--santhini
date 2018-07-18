/* jshint esversion:6 */
const path = require('path');
let mongoapi = require(path.resolve('mongoStuff/mongodb-connect'));
var round = require('mongo-round');

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
                // console.log("years");

            }), (err) => {
                console.log("cannot fetch data", err);
            }
        });
    });
};

const getTeams = (dataset, year) => {
    console.log("inside getteams");
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
                // console.log(docs);
                resolve(docs);
                // console.log("teams");

            }), (err) => {
                console.log("cannot fetch data", err);
            }
        });
    });
};

const getBowlers = (dataset, dataset2, year, team) => {
    console.log(team);

    return new Promise((resolve, reject) => {
        mongoapi.connectToMongo().then((db) => {
            db.collection(dataset).aggregate([{
                    $match: {
                        season: parseInt(year),
                        team1: team
                    }
                },
                {
                    $lookup: {
                        from: dataset2,
                        localField: 'id',
                        foreignField: 'match_id',
                        as: 'details'
                    }
                },
                {
                    $project: {
                        details: { bowler: 1, player_dismissed: 1, batsman: 1 }
                    }
                }, { $unwind: '$details' },
                {
                    $group: {
                        _id: '$details.bowler'

                    }
                },

            ]).toArray().then((docs) => {
                // console.log(docs);
                resolve(docs);
                // console.log("teams");

            }), (err) => {
                console.log("cannot fetch data", err);
            }
        });
    });
};


const bowlersandwickets = (dataset, dataset2, year, team) => {
    console.log(team);

    return new Promise((resolve, reject) => {
        mongoapi.connectToMongo().then((db) => {
            db.collection(dataset).aggregate([{
                    $match: {
                        $and: [
                            { season: parseInt(year) },
                            { team1: team }
                        ]
                    }
                },
                {
                    $lookup: {
                        from: dataset2,
                        localField: 'id',
                        foreignField: 'match_id',
                        as: 'details'
                    }
                },
                {
                    $project: {
                        details: { bowler: 1, player_dismissed: 1 }
                    }
                }, { $unwind: '$details' },
                {
                    $group: {
                        _id: '$details.bowler',
                        wicket: { $sum: { $cond: { if: { $ne: ["$details.player_dismissed", ''] }, then: 1, else: 0 } } }
                    }
                },
                { $sort: { wicket: -1 } },
                { $limit: 5 }
            ]).toArray().then((docs) => {
                // console.log(docs);
                resolve(docs);
                // console.log("teams");

            }), (err) => {
                console.log("cannot fetch data", err);
            }
        });
    });
};

const economyOfBowler = (dataset1, dataset2, year, team) => {
    return new Promise((resolve, reject) => {
        mongoapi.connectToMongo().then((db) => {
            db.collection(dataset1).aggregate([{
                    $match: {
                        $and: [
                            { season: parseInt(year) },
                            { team1: team }
                        ]
                    }
                },
                {
                    $lookup: {
                        from: dataset2,
                        localField: 'id',
                        foreignField: 'match_id',
                        as: 'details'
                    }
                }, {
                    $project: {
                        details: { bowler: 1, total_runs: 1, wide_runs: 1, noball_runs: 1 }
                    }
                }, { $unwind: '$details' }, {
                    $group: {
                        _id: '$details.bowler',
                        totalRuns: { $sum: '$details.total_runs' },
                        balls: { $sum: 1 },
                        wideBalls: { $sum: { $cond: { if: { $ne: ["$details.wide_runs", 0] }, then: 1, else: 0 } } },
                        noBalls: { $sum: { $cond: { if: { $ne: ["$details.noball_runs", 0] }, then: 1, else: 0 } } }
                    }
                }, {
                    $project: {
                        _id: '$_id',
                        economy: {
                            $divide: ['$totalRuns', {
                                $divide: [{
                                    $subtract: ['$balls', {
                                        $add: ['$wideBalls', '$noBalls']
                                    }]
                                }, 6]
                            }]
                        }
                    }

                }, {
                    $project: {
                        _id: '$_id',
                        economy: round('$economy', 2)
                    }

                }, { $sort: { economy: 1 } },
                { $limit: 5 }


            ]).toArray().then((docs) => {
                resolve(docs);
                console.log("top economical bowlers");

            }), (err) => {
                console.log("cannot fetch data", err);
                // process.exit(0);
            };

        });
    });
};

module.exports = {
    getYears,
    getTeams,
    getBowlers,
    bowlersandwickets,
    economyOfBowler
};