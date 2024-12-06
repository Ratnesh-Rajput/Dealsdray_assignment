const mongoose  = require("mongoose");
 
function connectDB(URLstring) {
    return mongoose.connect(URLstring);
};
 module.exports=connectDB;