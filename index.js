require("dotenv").config()
const express=require("express");
const path =require("path");
const userRoute = require("./routes/user");
const employeeRoute = require("./routes/employee");
const connectDB = require("./connection");
const cookieParser = require("cookie-parser");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");
const  Employee =require("./models/employee")

const PORT=8000;
const app=express();


// Database
connectDB(process.env.MONGO_URL|| "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.2" )
    .then(()=>{console.log("MongoDB connected")})
    .catch((err)=>{console.log(`Error connecting mongoDB:${err}` )})

// Views    
app.set("view engine","ejs");
app.set("views",path.resolve("./views"))

//MiddleWares
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use("/user",userRoute);
app.use("/employee",employeeRoute);
app.use(express.static(path.resolve('./public')));
// app.use(express.static(path.join(__dirname, 'public')));

app.get("/",async(req,res)=>{
    const allEmployees= await Employee.find({})
    return res.render("home",{user: req.user});
})

app.listen(PORT,()=>{console.log(`Server started at port:${PORT}`)});