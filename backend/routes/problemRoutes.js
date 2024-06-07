const express = require('express');
const router = express.Router();
const problemController = require('../controllers/problemController.js');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const verify = async(req,res,next)=>{
    try {
        const token = req.cookies.token;
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        const regUser = await findOne({_id: verifyUser._id});
        if(!regUser){
            return res.status(401).send({message: "Not verified to perform action"});
        }
        next();
    }
    catch (error) {
        return res.status(401).send({message: error.message});
    }
};


router.get('/problems',problemController.readAllProblem)
router.post('/problems/create',problemController.createProblem);
router.get('/details/:id',problemController.readProblem);
router.put('/update/:id' ,problemController.updateProblem);
router.delete('/delete/:id',problemController.deleteProblem);

module.exports = router;