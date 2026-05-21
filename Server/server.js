const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

/* Middleware */

app.use(cors());
app.use(express.json());

/* MongoDB Connection */

mongoose.connect("mongodb://127.0.0.1:27017/minicrm")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

/* Schema */

const LeadSchema = new mongoose.Schema({

    name: String,
    email: String,
    phone: String,
    source: String,
    notes: String,
    status: String,
    createdAt: {
        type: Date,
        default: Date.now
    }

});

/* Model */

const Lead = mongoose.model("Lead", LeadSchema);

/* =========================
   ADD LEAD
========================= */

app.post("/addLead", async (req,res)=>{

    try{

        const lead = new Lead(req.body);

        await lead.save();

        res.json({
            success:true,
            message:"Lead Added Successfully"
        });

    }

    catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

});

/* =========================
   GET ALL LEADS
========================= */

app.get("/leads", async (req,res)=>{

    try{

        const leads = await Lead.find().sort({
            createdAt:-1
        });

        res.json(leads);

    }

    catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

});

/* =========================
   UPDATE STATUS
========================= */

app.put("/update/:id", async (req,res)=>{

    try{

        await Lead.findByIdAndUpdate(req.params.id,{

            status:req.body.status

        });

        res.json({
            success:true,
            message:"Status Updated"
        });

    }

    catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

});

/* =========================
   DELETE LEAD
========================= */

app.delete("/delete/:id", async (req,res)=>{

    try{

        await Lead.findByIdAndDelete(req.params.id);

        res.json({
            success:true,
            message:"Lead Deleted Successfully"
        });

    }

    catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

});

/* =========================
   SEARCH LEADS
========================= */

app.get("/search/:key", async (req,res)=>{

    try{

        const key = req.params.key;

        const leads = await Lead.find({

            $or:[

                {
                    name:{
                        $regex:key,
                        $options:"i"
                    }
                },

                {
                    email:{
                        $regex:key,
                        $options:"i"
                    }
                }

            ]

        });

        res.json(leads);

    }

    catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

});

/* =========================
   DASHBOARD ANALYTICS
========================= */

app.get("/analytics", async (req,res)=>{

    try{

        const totalLeads = await Lead.countDocuments();

        const contacted = await Lead.countDocuments({
            status:"Contacted"
        });

        const converted = await Lead.countDocuments({
            status:"Converted"
        });

        const newLeads = await Lead.countDocuments({
            status:"New"
        });

        res.json({

            totalLeads,
            contacted,
            converted,
            newLeads

        });

    }

    catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

});

/* =========================
   SERVER
========================= */

app.listen(5000, ()=>{

    console.log("Server Running on Port 5000");

});