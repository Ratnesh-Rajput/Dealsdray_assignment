const mongoose=require("mongoose");

const employeeSchema = new mongoose.Schema({
    
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true
    },
    mobileNo:{
        type:Number,
        required:true
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    designation:{
        type: String,
    enum: ["HR", "Manager", "Sales"], 
    required: true,
    },
    gender:{
        type: String,
    enum: ["Male", "Female"], 
    required: true,
    },
    course:{
        type: String,
        enum: ["MCA", "BCA", "BSc"], 
        required: true,
    },
    coverImageURL:{
        type:String,
        required:false,
    },
    },{timestamps:true})

const Employee = mongoose.model("employee",employeeSchema);

module.exports= Employee;