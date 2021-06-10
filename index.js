require("dotenv").config();
// const upload = require('./routes/upload');
const Grid = require('gridfs-stream');
const connection = require('./connection');
// const { connect } = require("./routes/upload");
const express = require('express');
const { isEmpty } = require('lodash');
const mongoose = require('mongoose');
const multer = require('multer');
const upload = require("./middleware/upload");
const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());
const base64 = require('node-base64-image');

connection();
let gfs;


const schema = new mongoose.Schema({
    image:String, 
    quantity:Number,
    t_id: String,
    account_id:String,
    price:Number,
    status:Boolean,
	product_id : Number, 
    image:String
});

const conn = mongoose.connection;

conn.once("open", function(){
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("photos");
});

app.get("/file/:filename", async (req, res) => {
    try {
        const file = await gfs.files.findOne({ filename: req.params.filename });
        const readStream = gfs.createReadStream(file.filename);
        readStream.pipe(res);
        console.log(readStream.pipe(res));

    } catch (error) {
        res.send("not found");
    }
});

app.post('/deleteProduct', async(req, res)=>{
    try{
        const data = req.body;
        const deleteProduct = await getDataOfSpecificMachine(req.body.machineId).findByIdAndDelete(data["_id"])
        return res.status(200).send({"Deleted":"Successfully"});
    }catch(error){
        return res.status(404).send("Something went wrong");
    };
    
});

app.post('/updateImage',upload.single("image"),  async(req, res)=>{
    try{
        if (req.file === undefined) return res.send("you must select a file.");
        
        const imgUrl = `https://obscure-cove-38079.herokuapp.com/file/${req.file.filename}`;
        // const data = req.body;
        // const filter = {_id: data["_id"]};

        const filter = {_id: "60b5036e25a51e59229d4fea"};
        const change = {image:imgUrl}; // here we add logic for adding image
        const update = await getDataOfSpecificMachine("machine3").findOneAndUpdate(filter, change);
        return res.status(200).send({"updated":"yes"});
    }catch(error){
        return res.status(400).send(error);
    };
});

app.post('/updateProduct', async(req, res)=>{
    try{
        const data = req.body;
        const filter = {_id: data["_id"]};
        const change = {price: data["price"], quantity:data["quantity"]}; // here we add logic for adding image
        const update = await getDataOfSpecificMachine(data["machineId"]).findOneAndUpdate(filter, change);
        return res.status(200).send({"updated":"yes"});
    }catch(error){
        return res.status(400).send(error);
    };
});

app.post('/update/:mId', async(req, res)=>{
    const left = req.body;
    const check =await getDataOfSpecificMachine(req.params.mId).find();
    const filter = {_id : left["_id"]};
    const change = {quantity:left["quantity"], status:left["status"]};
    const update = await getDataOfSpecificMachine(req.params.mId).findOneAndUpdate(filter, change);
    return res.status(200).send(update);

});

app.post('/final_recipt', async(req, res) =>{
	try{
		const recipt = new getDataOfSpecificMachine("final_recipt")({
			quantity : req.body.quantity,
			product_id:req.body.product_id,
			t_id:req.body.t_id,
			account_id:req.body.account_id,
		})
		const createRecipt = await recipt.save();
		return res.status(201).send(createRecipt);

	}catch(e){
        console.log(e)
		return res.status(400).send("Something went wrong")
	};
});

app.post('/fillProduct/:mId', async(req, res) => {
    try{
        // here we check the machine is registered or not. if not registered then we will not proceed.
        const machineId = req.params.mId;
        const validate = await getDataOfSpecificMachine(machineId).find();
        const isNotValid = Object.keys(validate).length === 0;
        if(isNotValid){
            return res.status(400).send("This machine is not valid. Please contact to our team for validation");
        }
        else{
            const fillProduct = new getDataOfSpecificMachine(machineId)({

                product_id:req.body.pid,
                image:req.body.image, 
                quantity:req.body.quantity,
                price:req.body.price,
                status:req.body.status,

            })
            const fill = await fillProduct.save();
            return res.status(201).send(fill);
        };        

    }catch(e){
        return res.status(404).send("Something went wrong...");
    };
});

// When we scan then This get method shows all the product discription in app.
app.get('/showProduct/:mId', async(req, res) =>{
    try{
        const machineId = req.params.mId;
        const showAllProduct = await getDataOfSpecificMachine(machineId).find();
        const isNotWorking = Object.keys(showAllProduct).length === 0;
        if(isNotWorking){
            return res.status(404).send("Sorry this machine is not working.");
        }
        else{
            // here we send all data
            return res.status(200).send(showAllProduct);
        }
    }catch(e){
        return res.status(404).send("Something went wrong.Please try again later.");
    }
})

function getDataOfSpecificMachine(machineId){
    const model = new mongoose.model(`${machineId}`, schema);
    return model;
}

app.listen(port, console.log(`Connection is successfully connected at ${port}`));