const User = require("../models/user.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require('dotenv').config({path: "./.env"});


// registration page
exports.registration = async(req, res)=>{
    try{
      const {firstname, lastname, email, password} = req.body;
        if(!(firstname && lastname && email && password)){
            return res.status(401).send({message: "All fields required"});
        }
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if(!regex.test(email)) {
            return res.status(400).send({message: "invalid email"});
        }
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).send({message: "User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const user = User.create({
            firstname,
            lastname,
            email,
            password : hashedPassword
        });

        // const token = jwt.sign({id: user._id, email}, process.env.SECRET_KEY,{
        //     expiresIn : '1h',
        // });

        // user.token=token;
        // user.password = undefined;
        return res.status(200).json({message: "user registred successfully",});
    }
    catch(err){
      console.log(err);
    }
  };

  //login page
  exports.login = async(req,res)=>{
    try{
        const {email, password} = req.body;
        if(!(email && password)){
           return res.status(401).send({message: "All fields required"});
        }

        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if(!regex.test(email)) {
            return res.status(400).send({message: "invalid email"});
        }

        const user = await User.findOne({email});
        if(!user){
            return res.status(400).send({message: "User not found"});
        }

        const comparePassword = await bcrypt.compare(password, user.password);
        if(!comparePassword){
            return res.status(400).send({message: "Password does not match"});
        }

        if(user.email == process.env.adminEmail) {
            user.role = "admin";
        }
        else user.role = "user";

        const token = jwt.sign({id: user._id, role: user.role}, process.env.SECRET_KEY);
        user.token=token;
        user.password=undefined;

        const options = {
            expires : new Date(Date.now() + 1*24*60*60*1000), 
            httpOnly : false,
            secure: false,
            sameSite: 'Strict',
            path: '/',
        };

        return res.status(200).cookie("token", token, options).json({
            message: "You have logged in successfully",
            success: true,
        });
    }
    catch(err){
        console.log(err);
    }
  };

exports.logout = async (req, res) => {
    try {
        res.clearCookie("access_token");
        res.status(200).json({ message: "You have successfully logged out!" });
    } catch (error) {
        res.status(500).json({ message: "Server Error!" });
    }
}