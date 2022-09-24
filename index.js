const express =require("express");
const constants =require("./private_constants");
const mongoose= require ("mongoose")
var md5 = require('md5');
const app=express();
const User =require("./Schema/user")
const jwt =require("jsonwebtoken");

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

app.post("/register",async (req,res)=>{

    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).send('That user already exisits!');
    } else {
        const hashpassword =await md5(req.body.password,12)
        user = new User({
            username:req.body.username,
            email: req.body.email,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            password:hashpassword
        });
        await user.save();
        res.send(user);
    }
})
app.post("/login",async(req,res)=>{
    let user = await User.findOne({ email: req.body.email });
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