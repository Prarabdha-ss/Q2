const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';

function findAll() {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, { useNewUrlParser: true })
            .then(client => {
                console.log('Connected to MongoDB');
                const db = client.db("newDB");
                const collection = db.collection('customers');
                const cursor = collection.find({}).limit(10);
                cursor.forEach(doc => console.log(doc))
                    .then(() => {
                        console.log('Iteration complete');
                        client.close();
                        resolve();
                    })
                    .catch(err => {
                        console.log('Error during iteration:', err);
                        client.close();
                        reject(err);
                    });
            })
            .catch(err => {
                console.log("Error connecting to MongoDB:", err);
                reject(err);
            });
    });
}

setTimeout(() => {
    findAll()
        .then(() => console.log('iter'))
        .catch(err => console.log('Error in findAll:', err));
}, 5000);
