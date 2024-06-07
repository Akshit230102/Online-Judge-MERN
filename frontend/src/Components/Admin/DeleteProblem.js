import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const DeleteProblem= () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const handleDeleteBook = () => {
    setLoading(true);
    axios
      .delete(`http://localhost:5001/delete/${id}`)
      .then(() => {
        setLoading(false);
        navigate('/adminDashboard');
      })
      .catch((error) => {
        setLoading(false);
        // alert('An error happened. Please Check console');
        console.log(error);
      });
  };
  
  return (
    <div className='p-4'>
      <h1 className='text-3xl my-4'>Delete Problem</h1>
      <div className='flex flex-col items-center border-2 border-sky-400 rounded-xl w-[600px] p-8 mx-auto'>
        <h3 className='text-2xl'>Are You Sure You want to delete this problem?</h3>

        <button
          className='p-4 bg-red-600 text-white m-8 w-full'
          onClick={handleDeleteBook}
        >
          Yes, Delete it
        </button>
      </div>
    </div>
  )
}

export default DeleteProblem;