const employee = require('../models/employee');
const bcrypt = require('bcrypt');
const handlebars = require('handlebars');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
require('dotenv').config(); 
const fs = require('fs');

const index = (req,res,next)=>{
    employee.find()
    .then(response =>{
        res.json({response})
    })
    .catch(error =>{
        res.json({message:"an error occured",error})
    })
}
const show = (req,res,next)=>{
    const employeeid = req.params.employeeid
    employee.findById(employeeid)
    .then(response =>{
        res.json({response})
    })
    .catch(error =>{
        res.json({message:"an error occured",error})
    })
}
const register = async(req,res)=>{
    const { name,designation,email,age,username,password,role } = req.body;

    try {
      const newUser = await employee.create({ name,designation,email,age,username,password,role });
      const templateFile = fs.readFileSync('./assets/email.html', 'utf-8');
      const template = handlebars.compile(templateFile);
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_EMAIL,
            pass: process.env.GMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.GMAIL_EMAIL,
        to: email, 
        subject: 'Registration Confirmation',
        html: template({name})
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });

    cron.schedule('*/30 * * * *', async() => {
      const thankyoumail = {
          from: process.env.GMAIL_EMAIL,
          to: email, 
          subject: 'thank you for registering!',
          html: 'thank you for registering with us'
      };
      
      transporter.sendMail(thankyoumail, (error, info) => {
          if (error) {
              console.error('Error sending thank you email:', error);
          } else {
              console.log('Thank you email sent:', info.response);
          }
      });
      cron.destroy();
  });
      
    res.status(201).json({ id: newUser.id, username });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error registering user');
    }}


const update = (req,res,next)=>{
    try{
    const employeeid = req.body.employeeid

    const updateddata={
        name :req.body.name,
        designation :req.body.designation,
        email:req.body.email,
        age :req.body.age,
        username:req.body.username,
        role :req.body.role,
    }
    employee.findByIdAndUpdate(employeeid,{$set:updateddata})
        res.json({message:'employee updateded successfully'});
    } catch (error) {
        console.error(error);
        res.status(500).send('Error registering user');
      }}

const destroy = (req,res,next)=>{
    const employeeid = req.body.employeeid
    employee.findOneAndDelete(employeeid)
    .then(()=>{
        res.json({message:'employee deleted successfully'})
    })
    .catch(error =>{
        res.json({message:"an error occured",error})
    })
}
module.exports ={index,show,register,update,destroy}