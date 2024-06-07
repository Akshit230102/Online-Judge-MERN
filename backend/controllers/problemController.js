const Problem = require("../models/problem.js");

//GET all problems
exports.readAllProblem = async (req, res) => {
  try {
    const problems = await Problem.find({});
    if(!problems){
      return res.status(400).json({message: "Not found"});
    }
    return res.json(problems);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


// GET a problem
exports.readProblem = async (req, res) => {
  try {
    const {id} = req.params;
    const problems = await Problem.findById(id);
    if(!problems){
      return res.status(400).json({message: "problem not found"});
    }
    return res.json(problems);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// POST a new problem
exports.createProblem = async (req, res) => {
  try {
    if(!req.body.title||!req.body.description||!req.body.difficulty||!req.body.solved||!req.body.category)
      {
          return res.status(400).send({message: "send all required fields"});
      }
    const newProblem = new Problem(req.body);
    const savedProblem = await newProblem.save();
    if(!savedProblem){
      return res.status(400).json({message: "Couldn't save problem"});
    }
    return res.status(201).json(savedProblem);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

//DELETE a problem
exports.deleteProblem = async(req,res)=>{
  try{
    const {id}=req.params;
    const delProblem= await Problem.findByIdAndDelete(id);
    if(!delProblem){
      res.status(400).json({message: "Not found"});
    }
    return res.status(200).json({message: "Deleted successfully"});
  }
  catch(err){
    return res.status(500).json({message: err.message});
  }
};

// UPDATE a problem 
exports.updateProblem = async(req,res)=>{
  try {
    if(!req.body.title||!req.body.description||!req.body.difficulty||!req.body.solved||!req.body.category){
      return response.status(404).send({message: "send all required fields"});
    }
    const {id} = req.params;
    const result = await Problem.findByIdAndUpdate(id,req.body);
    if(!result){
        return res.status(404).json({message: "Not found"});
    }
    return res.status(200).send({message: "Problem updated"});
  } 
  catch (error) {
    return res.status(500).json({message: error.message});
  }
};

