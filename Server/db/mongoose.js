const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/node_test_api',{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false // false is set tp remove  DeprecationWarning: collection.findAndModify is deprecated
})
