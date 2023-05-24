//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://0.0.0.0:27017/wikiDB",{useNewUrlParser:true});

const articleSchema = {
    title:String,
    content:String
}

const Article = mongoose.model("article",articleSchema); 

/////////////////////////////Request Targeting All Articles////////////////////////////////////

app.route("/articles")

.get(function(req,res){
    Article.find(function(err,foundArticles){
        if(!err){
            res.send(foundArticles);  
        } else {
            res.send(err);
        }
    })
})

.post(function(req,res){
    console.log(req.body.title);
    console.log(req.body.content);

    const newArticle = new Article({
        title:req.body.title,
        content:req.body.content
    });
    newArticle.save(function(err){
        if(!err){
            res.send("Successfully added to a new article");
        }else{
            res.send(err);
        }
    });
})

.delete(function(req,res){
    Article.deleteMany(function(err){
        if(!err){
            res.send("Successfully deleted all the  articles");
        }else{
            res,send(err);
        }
    });
});

////////////////////////////////////Request Targetting A Specific Article////////////////////////////

app.route("/articles/:articleTitle")

.get(function(req,res){

   Article.findOne({title: req.params.articleTitle}, function(err,foundArticle){
    if(foundArticle){
        res.send(foundArticle);
    } else {
        res.send("No article Matching that title was found.")
         console.log(err)
    }
   });
})

.put(function(req,res){
    Article.update(
        {title:req.params.articleTitle},
        {title:req.body.title, content:req.body.content},
        {overwrite:true},
        function(err){
            if(!err){
                res.send("Successfully updated Article");
            }
        }
    );
})

.patch(function(req,res){
    Article.updateOne(
        {title:req.params.articleTitle},
        {$set: req.body},
        function(err){
            if(!err){
                res.send("Successfully Updated article.");
            }else{
                res.send(err);
            }
        }
    );
})

.delete(function(req ,res){
    Article.deleteOne(
    {title:req.params.articleTitle},
    function(err){
        if(!err){
            res.send(err);
        }else{
            res.send("Successfully Deleted the corresponding article");
        }
    }
    );
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});