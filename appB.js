var express  = require('express');
var path = require("path");
var mongoose = require('mongoose');
var app      = express();
var database = require('./config/database');
var bodyParser = require('body-parser');         // pull information from HTML POST (express4)
 
var port     = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
const exphbs  = require('express-handlebars');
app.use(express.static(path.join(__dirname, "public")));

mongoose.connect(database.url);

var Product = require('./models/product');

app.engine('.hbs', exphbs.engine({extname:'.hbs'}));
app.set('view engine','.hbs');

// Assuming this code is added after other middleware and before app.listen()

app.get('/', async (req, res) => {
    // Fetch all products from the API
    try {
        const products = await Product.find().lean();
        //res.json(products);
        res.render('products', { title: 'All Products', products: products });
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/add-product', (req, res) => {
    res.render('productForm');
});

app.post('/api/products', async (req, res) => {
    try {
        const product = new Product({
            asin: req.body.asin,
            title: req.body.title,
            imgUrl: req.body.imgUrl,
            stars: req.body.stars,
            reviews: req.body.reviews,
            price: req.body.price,
            listPrice: req.body.listPrice,
            categoryName: req.body.categoryName,
            isBestSeller: req.body.isBestSeller,
            boughtInLastMonth: req.body.boughtInLastMonth
        });
    //     await product.save();
    //   //  res.json(product);
    //     res.status(201).json(product);
    // } catch (err) {
    //     res.status(500).send(err);
    const savedProduct = await product.save(); // Save the product
        res.status(201).json(savedProduct); // Respond with the inserted product data
    } catch (err) {
        res.status(500).json({ error: err.message }); 
    }
});




app.listen(port);
console.log("App listening on port : " + port);
