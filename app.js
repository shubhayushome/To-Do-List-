const express=require("express");
const bodyParser=require("body-parser");
const app=express();
const _ =require("lodash");
const mongoose=require("mongoose");

mongoose.connect("mongodb+srv://Shubhayu:Z3Z5AbNay2yPcyqa@cluster0.8mywdid.mongodb.net/todolistDB",{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>{console.log("Connected");})
.catch((err)=>{console.log(err);})
const itemSchema=new mongoose.Schema({
  name: String,
  dateS: String,
  dateF: String,
  timeS: String,
  timeF: String
});
const Item=mongoose.model("Items",itemSchema);

const listSchema=new mongoose.Schema({
  name: String,
  items:  [itemSchema] 
});

const List=mongoose.model("Lists",listSchema);
const list=new List({
  name: "Home",
  items:[]
})

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.get("/Lists/:customListName",function (req,res) {
  
  List.findOne({name:req.params.customListName})
  .then((result)=>{
  res.render('lists', {heading : result.name, newListItem: result.items,bounds:result.items.length})})
  .catch(function(err){
    console.log(err);
   })
  ;
})
app.get("/",function(req,res) {

  List.find({})
  .then((result)=>{
  res.render('home', { newListItem: result,bounds:result.length})})
  .catch(function(err){
    console.log(err);
   })
  ;

})
app.post("/",function(req,res) {
  
  const newName= _.capitalize(req.body.ListName);
  List.find({name:newName})
  .then((result)=>{
     if(result.length === 0)
     {
        const list=new List({
    name: newName,
    items:[]
     })
     list.save();
     res.redirect("/");
    }
     else
     {
      res.redirect("/");
     }
     
  })
    .catch(function(err){
      console.log(err);
     })
    ;
  
  })


app.post("/Lists/:customListName",function (req,res) {
  console.log(req.params.customListName);
    let todays = req.body.dateofstart;
   let time=req.body.timeofstart;
   var holds= req.body.newItem;
   let todayf=req.body.dateoffinish;
   let timef=req.body.timeoffinish;
   const newtask=new Item({
    name: holds,
    dateS: todays,
    dateF: todayf,
    timeS: time,
    timeF: timef
     })
     List.findOne({name:req.params.customListName})
     .then((result)=>{
      result.items.push(newtask);
      result.save();
     })
     .catch(function(err){
      
       console.log(err);
      })
     ;
  res.redirect("/Lists/"+req.params.customListName);
   }

)
/*app.post("/delete",async function(req,res){
  const value=req.body.CheckTask;
  console.log(value);
  
  await Home.deleteOne({name:valuse})
  .then(()=>{
    console.log("successfully Deleted");
  })
  .catch((err)=>{
    console.log(err)
  })
  res.redirect("/");
})*/
app.post("/delete", function(req,res){
 
  const checkedItemId = req.body.checkBox;
  
    List.findOneAndRemove({ _id : checkedItemId})
    .then(()=>{
      console.log("successfully Deleted");
    })
    .catch((err)=>{
      console.log(err)
    })
    res.redirect("/");
  
  }
);
app.post("/Lists/:customListName/delete", function(req,res){
 
  console.log(req.params.customListName);
  const checkedItemId = req.body.checkBox;
  console.log(checkedItemId);
  List.findOneAndUpdate({name:req.params.customListName},{$pull:{items:{_id:checkedItemId}}})
  .then(()=>{
   res.redirect("/Lists/"+req.params.customListName);
  })
  .catch(function(err){
   
    console.log(err);
    res.redirect("/Lists/"+req.params.customListName);
   })
  
  }
);

app.get("/about",function(req,res)
{
  res.render('about',{typeofDay:"About Me"});
})

app.listen(process.env.PORT || 3003,function () {
  console.log("Server started on port 3000");
})
