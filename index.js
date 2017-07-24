var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:/dudco", (err) => {
    if(err){
        console.log("db connected error");
        throw err;
    }
});

app.use(bodyParser.urlencoded({
    extended: false
}));

var UserSchema = new mongoose.Schema({
    _id: String,
    email: String,
    pw: String,
    name: String,
    accessToken: String,
    token: String
});
Users = mongoose.model('users', UserSchema);

var PORT = 6974;

app.get("/", (req, res)=>{
    res.send("hello");
});

app.listen(PORT, ()=>{
    console.log("server running at " + PORT + " port");
})

require("./routes/auth")(app, Users);

