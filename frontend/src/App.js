// App.js
import { useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Home from './Components/Home/Home';
import Signup from './Components/Signup/Signup';
import Login from './Components/Login/Login';
import UserDashboard from './Components/User/UserDashboard';
import AdminDashboard from './Components/Admin/AdminDashboard';
import CreateProblem from './Components/Admin/CreateProblem';
import UpdateProblem from './Components/Admin/UpdateProblem';
import DeleteProblem from './Components/Admin/DeleteProblem';
import ProblemPage from './Components/Problems/ProblemPage';
import AddTestcase from './Components/Testcase/AddTestcase';
import Error from './Components/Error/Error';
import { getUserRoleFromToken } from './Utils/helpers';

const ProtectedRoute = ({ element: Element, adminOnly, ...rest }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = document.cookie.split('; ').find(row => row.startsWith('token='));
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const role = getUserRoleFromToken();
  if (adminOnly && role !== 'admin') {
    return <Navigate to="/error" />;
  }

  return <Element {...rest} />;
};

const App = () => {
  return (
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='error' element={<Error />}/>
        <Route path='/dashboard' element={<ProtectedRoute element={UserDashboard} />} />
        <Route path='/adminDashboard' element={<ProtectedRoute element={AdminDashboard} adminOnly />} />
        <Route path='/adminDashboard/create' element={<ProtectedRoute element={CreateProblem} adminOnly />} />
        <Route path='/adminDashboard/update/:id' element={<ProtectedRoute element={UpdateProblem} adminOnly />} />
        <Route path='/adminDashboard/delete/:id' element={<ProtectedRoute element={DeleteProblem} adminOnly />} />
        <Route path='/problems/:id' element={<ProtectedRoute element={ProblemPage} />} />
        <Route path='/adminDashboard/addTestcase/:problemId' element={<ProtectedRoute element={AddTestcase} adminOnly />} />
      </Routes>
  );
};

export default App;