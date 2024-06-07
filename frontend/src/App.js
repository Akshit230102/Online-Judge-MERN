import { Route, Routes } from "react-router-dom";
import AdminDashboard from "./Components/Admin/AdminDashboard.js";
import CreateProblem from "./Components/Admin/CreateProblem.js";
import DeleteProblem from "./Components/Admin/DeleteProblem.js";
import UpdateProblem from "./Components/Admin/UpdateProblem.js";
import UserDashboard from "./Components/User/UserDashboard.js";
import Login from './Components/Login/Login.js';
import Signup from './Components/Signup/Signup.js';
import Home from './Components/Home/Home.js';
import ProblemPage from "./Components/Problems/ProblemPage.js";
import AddTestcase from "./Components/Testcase/AddTestcase.js";


function App() {
  return (
    <>
    <Routes>
      <Route path = '/' element = {<Home />}/>
      <Route path='/signup' element= {<Signup />}/>
      <Route path='/login' element= {<Login />}/>
      <Route path='/dashboard' element={<UserDashboard />}/>
      <Route path = '/adminDashboard' element = {<AdminDashboard/>}/>
      <Route path = '/adminDashboard/create' element = {<CreateProblem />} />
      <Route path = '/adminDashboard/update/:id' element = {<UpdateProblem />} />
      <Route path = '/adminDashboard/delete/:id' element = {<DeleteProblem />} />
      <Route path = '/problems/:id' element = {<ProblemPage />} />
      <Route path = '/adminDashboard/addTestcase/:problemId' element = {<AddTestcase />} />
      </Routes>
    </>
  );
}

export default App;
