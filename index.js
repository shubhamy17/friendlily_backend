const express =require("express");
const constants =require("./private_constants");
const mongoose= require ("mongoose")
const app=express();
const model =require("./Schema/user")
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
// console.log(model.User)
app.use(express.json());

app.get('/', (req, res) => {
    res.send({
        sttaus: 200,
        message: "Welcome to friendlily"
    })
})

app.listen(constants.PORT, () => {
    console.log(`Listening on port 3000`);

})