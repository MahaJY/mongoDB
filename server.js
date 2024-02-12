const express= require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const employeeroute = require('./routes/employeeroute')

mongoose.connect('mongodb://localhost:27017/database1',{
    useNewUrlParser:true,
    useUnifiedTopology:true,
});
const db = mongoose.connection
db.on('error',(err)=>{
    console.log(err);
})
db.once('open',()=>{
    console.log('database connection established');
})
const app = express();
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:true})); 
app.use(bodyParser.json());

app.use('/emp',employeeroute)

const PORT = process.env.PORT || 3010
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
})