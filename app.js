//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var _ = require('lodash');
const mongoose = require('mongoose');
const { update } = require("lodash");
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));



mongoose.connect('mongodb://127.0.0.1:27017/BlogDB', {useNewUrlParser:true});





var commentSchema = new mongoose.Schema({
  comment: String,
  name: String
})

var postSchema = new mongoose.Schema({
  title: String,
  content: String,
  comment: [commentSchema]
})

const Post = mongoose.model("Post", postSchema);

const Comment = mongoose.model("Comment", commentSchema);

app.post("/comment", function(req, res){
  const comment = new Comment({
    comment: req.body.comment,
    name: req.body.name
  })
  comment.save()
  res.redirect("/")
}) 


app.get("/", function(req, res){
 
  console.log
  Post.find({}, function(err, posts){
    console.log(posts.comment)
      res.render("home", {
        homepara: homeStartingContent,
        posts: posts,
        comment: posts.comment 
        });
    });
    
   
   
});


app.get("/About", function (req, res) {
  res.render(__dirname + "/views/about.ejs", {
    aboutpara: aboutContent
  })
})

app.get("/Contact-us", function (req, res) {
  res.render(__dirname + "/views/contact.ejs", {
    contactpara: contactContent
  })
})

app.get("/Compose", function (req, res) {
  res.render(__dirname + "/views/compose.ejs")

})
app.get("/update/:postId", function(req, res){
  Post.find({}, function(err, posts){
    res.render("update", {
      posts: posts,
      postId: req.params.postId,
      
      });
      
  });
  
})


  


app.post("/update/:postId", function(req, res){
 const requiredId = req.params.postId
  Post.findByIdAndUpdate(requiredId,{content: req.body.Text, title: req.body.Title }, function(err){
    if(err){
      console.log(err)
    } else {
      res.redirect("/")
    }
  })
})
app.post("/Compose", function (req, res) {
  const post = new Post({
    title: req.body.Title,
    content: req.body.Text
  })
 post.save()
  

  res.redirect("/")

})

app.get("/posts/:postId", function(req, res){

  const requestedPostId = req.params.postId;
  
    Post.findOne({_id: requestedPostId}, function(err, post){
      res.render("post", {
        title: post.title,
        content: post.content
      });
    });
  
  });
app.post("/delete", function(req, res){
  const requesteddeleteId = req.body.delete
  Post.findByIdAndRemove(requesteddeleteId, function(err){
    if(!err){
      
      res.redirect("/")
    }
  })
})

app.post("/deletecomment", function(req, res){
  const requesteddeleteId = req.body.deletecomment
  Post.findByIdAndRemove(requesteddeleteId, function(err){
    if(!err){
      
      res.redirect("/")
    }
  })
})

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
