var express  = require('express');
var mongoose = require('mongoose');
var app      = express();
var database = require('./config/database');
var bodyParser = require('body-parser');         // pull information from HTML POST (express4)
 
var port     = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json


mongoose.connect(database.url);

var Product = require('./models/product');


app.get('/api/products', async function(req, res) {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/api/products/:asin', (req, res) => {
    Product.findOne({ asin: req.params.asin })
        .then(product => {
            if (!product) {
                return res.status(404).send('Product not found');
            }
            res.json(product);
        })
        .catch(err => res.status(500).send(err.message));
});

app.post('/api/products', async function(req, res) {
    try {
        const {
            asin,
            title,
            imgUrl,
            stars,
            reviews,
            price,
            listPrice,
            categoryName,
            isBestSeller,
            boughtInLastMonth
        } = req.body;

        const product = new Product({
            asin,
            title,
            imgUrl,
            stars,
            reviews,
            price,
            listPrice,
            categoryName,
            isBestSeller,
            boughtInLastMonth
        });

        await product.save();

        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.put('/api/products/:asin', async (req, res) => {
    try {
        const { title, price } = req.body;
        const updatedProduct = await Product.findOneAndUpdate(
            { asin: req.params.asin },
            { title, price },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).send('Product not found');
        }

        res.json(updatedProduct);
    } catch (err) {
        res.status(500).send(err.message);
    }
});


app.delete('/api/products/:asin', async (req, res) => {
    try {
        const result = await Product.deleteOne({ asin: req.params.asin });
        if (result.deletedCount === 0) {
            return res.status(404).send('Product not found');
        }
        res.send('Product deleted successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
});


app.listen(port);
console.log("App listening on port : " + port);
