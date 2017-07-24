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
    token: String,
    money: String,
    history: Array
});
Users = mongoose.model('users', UserSchema);
LocData = mongoose.model('location', new mongoose.Schema({ 
    title : String,
    address : String,
    roadAddress : String,
    longitude : String,
    latitude : String
}), 'locations')

var PORT = 6974;

app.get("/", (req, res)=>{
    res.send("hello");
});

app.get("/search/user", (req, res)=>{
    var userList = []
    Users.find({"name" :req.query.name}, (err, users)=>{
        for(user of users){
            userList.push(user)
        }
        res.send(200, userList)
    })
})

app.listen(PORT, ()=>{
    console.log("server running at " + PORT + " port");
})

require("./routes/auth")(app, Users);
require("./routes/location")(app, LocData);
require("./routes/self")(app, Users);
require("./routes/money")(app, Users);
