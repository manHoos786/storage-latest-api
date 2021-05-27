const mongoose = require('mongoose')
mongoose.connect("mongodb+srv://user:user@cluster0.h5qwd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology:true, useFindAndModify:false})
.then(()=>console.log("Database connected successfully."))
.catch((err)=>console.log(err))
