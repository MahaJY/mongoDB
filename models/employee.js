const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema
const employeeSchema = new Schema({
    name:{
        type: String
    },
    designation:{
        type: String
    },
    email:{
        type: String
    },
    age:{
        type: Number
    },
    username:{
        type: String
    },
    password: {
        type: String,
        required:true
    },
    role:{
        type: String
    },
},{
    timestamps:true
})
employeeSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
      return next();
    }
    
    try {
      const hashedPassword = await bcrypt.hash(this.password, 10);
      this.password = hashedPassword;
      next();
    } catch (error) {
      return next(error);
    }
  });
  
const employee = mongoose.model('Employee',employeeSchema);
module.exports = employee