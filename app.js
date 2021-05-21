const express=require("express")
const bodyparser=require("body-parser")
const date=require(__dirname+"/date.js")
const lodash=require("lodash");
const mongoose=require("mongoose");
const { toLower } = require("lodash");
const { gettime } = require("./date");

const app=express();

app.set("view engine","ejs");

app.use(bodyparser.urlencoded({extended: true}));

mongoose.connect('mongodb+srv://m4l1c1ou5:<your_mongoDB_password>@cluster0.kwitg.mongodb.net/todoDB', {useNewUrlParser: true, useUnifiedTopology: true});

const todoschema = {
    item:String,
    label:String
};

const todolist_model = mongoose.model('todos',todoschema);

app.get("/",function(req,res){
    let Date=date.getdate();
    todolist_model.find(function(err,body){
        if(err){
            console.log(err);
        }
        else{
            res.render("index",{arr:body,date:Date});
        }
    })
})

app.get("/:labelname",function(req,res){
    let Date=date.getdate();
    let requested_parameter=req.params.labelname.toLowerCase();
    todolist_model.find({label:lodash.kebabCase(requested_parameter)},function(err,data){
        if(err){
            console.log(err);
        }
        else{
            res.render("specific",{arr:data,label_name:req.params.labelname,date:Date});
        }
    })
})

app.post("/",function(req,res){
    if(req.body.sub=="add"){
        let data=new todolist_model({
            item: lodash.capitalize(req.body.item),
            label:lodash.kebabCase(req.body.label.toLowerCase())
        });
        data.save().then(function(){
            res.redirect("/");
        });
    }
    else{
        todolist_model.find(function(err,body){
            if(err){
                console.log(err);
            }
            else{
                if(req.body.item_no>body.length){
                    console.log("Invalid Input");
                }
                else{
                    todolist_model.findByIdAndRemove({_id:body[req.body.item_no-1]._id},function(err){
                        if(err){
                            console.log(err);
                        }
                    });
                }
            }
        }).then(function(){
            res.redirect("/");
        });
    }
})

app.post("/specific",function(req,res){
    if(req.body.sub=="add"){
        let data=new todolist_model({
            item: lodash.capitalize(req.body.item),
            label:lodash.kebabCase(req.body.label)
        });
        data.save().then(function(){
            res.redirect("/"+req.body.label);
        });
    }
    else{
        todolist_model.find({label:req.body.label},function(err,body){
            if(err){
                console.log(err);
            }
            else{
                if(req.body.item_no>body.length){
                    console.log("Invalid Input");
                }
                else{
                    todolist_model.findByIdAndRemove({_id:body[req.body.item_no-1]._id},function(err){
                        if(err){
                            console.log(err);
                        }
                    });
                }
            }
        }).then(function(){
            res.redirect("/"+req.body.label);
        });
    }
})

app.listen(process.env.PORT || 3000,function(){
    console.log("Server Started in port 3000");
});