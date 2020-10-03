const express = require('express');
const cors = require('cors');
require('./db/mongoose');
const path = require('path');
const productRouter = require('./routers/product');
const categoryRouter = require('./routers/category');

const app = express()
const port = process.env.PORT || 8000;

app.use(cors());
app.use('/static', express.static(path.join(__dirname, './public')))
app.use(express.json());


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(categoryRouter);
app.use(productRouter);

app.listen(port, () => {
    console.log("Server is up on port", port);
})
