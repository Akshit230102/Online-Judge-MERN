const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config({path: "../.env"});
const cors = require('cors');
var cookieParser = require('cookie-parser')

// Load environment variables
//dotenv.config();

// Initialize Express
const app = express();

// Middleware
app.use(cookieParser());
app.use(cors({origin: 'http://localhost:3000',
credentials: true}));
app.use(express.json());
app.use(express.urlencoded({extended : true}));

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI;
if(!mongoUri){
    throw new Error("Mongo URL not defined");
}
mongoose.connect(mongoUri);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Routes
const problemRouter = require('./routes/problemRoutes');
const authRouter = require('./routes/authRoutes');
const testCaseRouter = require('./routes/testcaseRoutes');
const submissionRouter = require('./routes/submissionRoutes');

//app.use('/api/example', exampleRouter);
app.use('/',authRouter);
app.use('/',problemRouter);
app.use('/',testCaseRouter);
app.use('/',submissionRouter);
// app.use('/api', require('./routes/solutionRoutes'));
// app.use('/api', require('./routes/problemRoutes'));
// app.use('/api', require('./routes/testCaseRoutes'));
// app.use('/api', require('./routes/submissionRoutes'));

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
