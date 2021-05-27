const express = require('express')
const { isEmpty } = require('lodash')
const mongoose = require('mongoose')
require('./connection')
const app = express()
const port = process.env.PORT || 5000
app.use(express.json())


const schema = new mongoose.Schema({

    product_id:Number,
    image:String, 
    quantity:Number,
    price:Number,
    status:Boolean,
 
});

// app.post('/update/:mId', async(req, res)=>{
//     const check =await getDataOfSpecificMachine(req.params.mId).find();
//     const filter = {_id : check[0]._id}
//     const change = {product_one_status:faturelse}
//     const update = await getDataOfSpecificMachine(req.params.mId).findOneAndUpdate(filter, change);
//     res.send(update)
//     console.log(update)

// })


app.post('/fillProduct/:mId', async(req, res) => {
    try{
        // here we check the machine is registered or not. if not registered then we will not proceed.
        const machineId = req.params.mId
        const validate = await getDataOfSpecificMachine(machineId).find();
        const isNotValid = Object.keys(validate).length === 0
        if(isNotValid){
            res.status(400).send("This machine is not valid. Please contact to our team for validation")
        }
        else{
            const fillProduct = new getDataOfSpecificMachine(machineId)({

                product_id:req.body.pid,
                image:req.body.image, 
                quantity:req.body.quantity,
                price:req.body.price,
                status:req.body.status,

            })
            const fill = await fillProduct.save()
            res.status(201).send(fill)
            console.log(fill)
        }        

    }catch(e){
        console.log(e)
        res.status(404).send("Something went wrong...")
    }
})

// When we scan then This get method shows all the product discription in app.
app.get('/showProduct/:mId', async(req, res) =>{
    try{
        const machineId = req.params.mId;
        const showAllProduct = await getDataOfSpecificMachine(machineId).find();
        const isNotWorking = Object.keys(showAllProduct).length === 0
        if(isNotWorking){
            res.status(404).send("Sorry this machine is not working.")
        }
        else{
            res.send(showAllProduct)
        }
    }catch(e){
        console.log("The problem is here - ", e)
        res.status(404).send("Something went wrong.Please try again later.")
    }
})


function getDataOfSpecificMachine(machineId){
    const model = new mongoose.model(`${machineId}`, schema)
    return model
}

app.listen(port, console.log(`Connection is successfully connected at ${port}`))