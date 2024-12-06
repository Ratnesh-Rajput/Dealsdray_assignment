const {Router} = require("express");
const multer= require("multer");
const path=require("path");
const Employee = require("../models/employee");


const router=Router();

const upload = multer({
    dest: '/public/uploads/',
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|png)$/)) {
            return cb(new Error('Only .jpg and .png files are allowed'));
        }
        cb(null, true);
    }
});

router
.route("/")
.get(async(req,res)=>{
    const allEmployees= await Employee.find({})
    return res.render("employee_list",{user: req.user,employees:allEmployees});
})

router
.route('/create')
.get(async(req,res)=>{
    return res.render("employee_creation");
})
.post(upload.single('coverImage'), async (req, res) => {
    try {
        const { name, email, mobileNo, designation, gender, course } = req.body;
        
       
        const existingEmployee = await Employee.findOne({ email });
        if (existingEmployee) {
            return res.status(400).send('Email already exists');
        }
        const courseValue = Array.isArray(course) ? course[0] : course;
      
        const newEmployee = new Employee({
            name,
            email,
            mobileNo,
            designation,
            gender,
            course: courseValue,
            coverImageURL: req.file ? `/uploads/${req.file.filename}` : undefined,
        });
        await newEmployee.save();
        res.redirect('/employee');
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Edit Employee
router
.route('/:id/edit')
.get(async(req,res)=>{
    try {
        const { id } = req.params;

        
        const employee = await Employee.findById(id);

        if (!employee) {
            return res.status(404).send('Employee not found'); 
        }
        return res.render("employee_edit", { employee });
    } catch (err) {
        console.error("Error fetching employee for edit:", err.message);
        res.status(500).send("Internal Server Error"); 
    }
})
.post( upload.single('coverImage'), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, mobileNo, designation, gender, course } = req.body;

        const courseValue = Array.isArray(course) ? course[0] : course;
        const updatedEmployee = await Employee.findByIdAndUpdate(id, {
            name,
            email,
            mobileNo,
            designation,
            gender,
            course: courseValue,
            ...(req.file && { coverImageURL: `/uploads/${req.file.filename}` }),
        }, { new: true });
        res.redirect('/employee');
    } catch (err) {
        res.status(400).send(err.message);
    }
});
router.route("/delete/:id").delete(async (req, res) => {
    try {
        const { id } = req.params; 
        const deletedEmployee = await Employee.findByIdAndDelete(id); 

        if (!deletedEmployee) {
            return res.status(404).json({ error: "Employee not found" });
        }

        res.status(200).json({ message: "Employee deleted successfully", data: deletedEmployee });
    } catch (error) {
        console.error("Error deleting employee:", error); 
        res.status(500).json({ error: "Internal Server Error" }); 
    }
});




module.exports=router;