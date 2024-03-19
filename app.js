//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
var encrypt = require('mongoose-encryption');

const app = express();


app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended:true
}));

// console.log(process.env.SECRET);


mongoose.connect("mongodb://127.0.0.1:27017/authDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);






app.route("/")

.get(function(req,res){

    res.render("home")
    
});

app.route("/login")

.get(function(req,res){
    res.render("login")
})
.post(function(req,res){
    

    User.findOne({email: req.body.username}).then((result)=>{
        if(result){
            console.log(result);
            if(result.password === req.body.password){
                res.render("secrets")
            }
            else{
                res.send("Wrong Password");
            }
        
        }
        else{
            res.send("Wrong Username")
        }
    }).catch((err)=>{
        console.log(err);
    })

});

app.route("/register")

.get(function(req,res){
    res.render("register")
})

.post(function(req,res){
    

    const newUser = new User ({

        email : req.body.username,
        password : req.body.password
    } )

    newUser.save().then(()=>{
        res.render("secrets");
    }).catch(err=>{
        res.send(err);
    })
});

// app.route("/secrets")

// .get(function(req,res){

// });

// app.route("/submit")

// .get(function(req,res){

// });


app.listen(3000, function(){
    console.log("Server started at port 3000");
}); 