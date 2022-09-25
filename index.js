const express =require("express");
const constants =require("./private_constants");
const mongoose= require ("mongoose")
var md5 = require('md5');
const User =require("./Schema/user")
const jwt =require("jsonwebtoken");
const app=express();
// const User = mongoose.model("User");

mongoose.connect(constants.mongo_url,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    })
    mongoose.connection.on("connected",()=>{
        console.log("connected to mongodb")
    })
    mongoose.connection.on("error",(err)=>{
        console.log("connecteding error",err)
    })

app.use(express.json());
const AuthRouter = require('./Controller/auth');

app.use('/auth', AuthRouter);

app.post("/login",async(req,res)=>{
    let user;
    if(req.body.email){
        user = await User.findOne({ email: req.body.email});
    }
    else{
        user = await User.findOne({ username: req.body.username});
    }
    if(!user){
        return res.status(400).send('That  user not exisits!');
    }else {
        let matchpassowrd=await md5(req.body.password,user.password)
        if(!matchpassowrd){
            return res.status(400).send("email and password invalid");
        }
        const token =jwt.sign({userId:user._id},constants.JWT_SECRET)
        res.send({authentication:token,first_name:user.first_name,last_name:user.last_name});
        return {token}
    }

})

app.get('/', (req, res) => {
    res.send({
        sttaus: 200,
        message: "Welcome to friendlily"
    })
})

app.listen(constants.PORT, () => {
    console.log(`Listening on port 3000`);

})