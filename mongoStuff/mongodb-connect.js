/*jshint esversion:6 */
const connectToMongo = () => {
    return new Promise((resolve, reject) => {
        const { MongoClient, ObjectID } = require('mongodb');
        const url = 'mongodb://localhost:27017';
        MongoClient.connect(url, (err, client) => {
            if (err) {
                return console.log("Connection to MongoDB server refused");
            }
            db = client.db('ipldataset');
            console.log('Connected to mongodb database');
            resolve(db);
        });
    });
};

module.exports = {
    connectToMongo
}