const mongoose=require("mongoose");
const {randomBytes, createHmac}=require("crypto");
const { createUserToken } = require("../services/authentication");

const userSchema=new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique: true,
    },
    salt:{
        type:String,
        // required:true,
    },
    password:{
        type:String,
        required:true,
    },
    // profileImageURL:{
    //     type:String,
    //     default:"../public/images/default.jpg", 
    // },
    role:{
        type:String,
        enum:["ADMIN"],//needs to be understood
        default:"ADMIN",
    },
    },{timestamps:true}
    );

    //using this function/method allows us to attach it to our schema 
    userSchema.static("matchPasswordandGenerateToken",async function (email,password){
        // const user=await User.findOne({email})
        const user=await this.findOne({email})
        if(!user){
                throw new Error("user not found");
        }
        const salt=user.salt;
        const userProvidedHash =  createHmac('sha256',salt)
                .update(password)
                .digest('hex');
        if(userProvidedHash!==user.password){
            throw new Error("Incorrect Password"); 
        }     
            const token = await createUserToken(user);
          return token;
    })

    userSchema.pre("save",function(next){
        const user= this;
        if(!user.isModified("password")){return};
        const salt=randomBytes(16).toString();
        const hashedPassword= createHmac('sha256',salt)
            .update(user.password)
            .digest("hex");

            this.salt=salt;
            this.password=hashedPassword;
            next();
    });
    const User= mongoose.model("user",userSchema);

    module.exports=User;