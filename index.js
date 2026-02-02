//initializing important dependencies
const express=require("express");
const app=express();
const port=8080;
const path=require("path");

// to use method otherthen get,post in html doc we need to use metthodoverride
const methodOverride=require("method-override");
//import uuid to use it also install it
const { v4: uuidv4 } = require('uuid');

// set path view engine (html doc) during response from views folder
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
//set the path for css file for  html doc during respone from public folder 
app.use(express.static(path.join(__dirname,"public")));

//setting up middle ware ;the data format to be understood by express either urlencoded or of json
//we can parse both so that express understood everything
app.use(express.urlencoded({extended:true}));   //for url data from user https type

//using methodoverriding
app.use(methodOverride("_method"));

//setting up the server live tracker
app.listen(port,()=>{
    console.log("server is running -->");
});

//defining array inwhich data of users are stored
//assuming that this array is a data base
let posts=[
    {   id:uuidv4(),
        username:"abdulwarisgurkhoo",
        content:"hello dear im a AI/ML engineer"
    },
    {
        id:uuidv4(),
        username:"ayanfirdous",
        content:"im current in btech 6th sem",
    }
];

//setting up restfull API's for each rout resoure is post

// 01  main landing page  GET req route:- /posts 

app.get("/post",(req,res)=>{
   res.render("index.ejs",{posts});
   
});
//route to see a post in detail:

app.get("/post/show/:id",(req,res)=>{
    let{id}=req.params;
    let post=posts.find((p)=> id===p.id);
    res.render("show.ejs",{post});
});

//route for adding new post get for form filling then post request for pushing data in DB
app.get("/post/add",(req,res)=>{
    res.render("add.ejs",{posts});
    console.log("taking user inputs for new post");
});

//after taking user input upading or dsaving data into DB
app.post("/post",(req,res)=>{
    console.log("adding new post to DB");
    let {username,content}=req.body;
    let id=uuidv4();                   //not object a variable and puch in obj req.body or req.param {} return data as obj
    posts.push({id,username,content});
    res.redirect("/post");
});


//making some modifications in a post we will use PATCH request as html only understood get/post
//so we use an indirect way of method overriding to use requestes like PATCH<DELETE etc in html
app.get("/post/:id/edit",(req,res)=>{
   let{id}=req.params;
   let post=posts.find((p)=>id===p.id);
   res.render("edit.ejs",{post});
   
});

// app.patch("/post/:id",(req,res)=>{
//     let{id}=req.params;
//    let post=posts.find((p)=>id===p.id);
//    let newcontent=req.body.content;
//    posts.content=newcontent;
//    res.redirect("/post");
// });
app.patch("/post/:id", (req, res) => {
    let { id } = req.params;
    let newContent = req.body.content;

    // 1. Find the specific post object in your array
    let post = posts.find((p) => id === p.id);

    // 2. Update the content of THAT specific post
    if (post) {
        post.content = newContent;
    }

    // 3. Redirect back to the main posts page
    res.redirect("/post");
});

//destory or delete route
app.delete("/post/:id",(req,res)=>{
    let {id}=req.params;
    posts=posts.filter((p)=>id!==p.id);
    res.redirect("/post");
});