import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateProblem = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [solved, setSolved] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {id} = useParams();

  useEffect(() => {
    setLoading(true);
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/details/${id}`)
    .then((response) => {
        setSolved(response.data.solved);
        setDescription(response.data.description);
        setTitle(response.data.title);
        setDifficulty(response.data.difficulty);
        setCategory(response.data.category);
        setLoading(false);
      }).catch((error) => {
        setLoading(false);
        alert('An error happened. Please Check console');
        console.log(error);
      });
  }, [])
  
  const handleUpdateProblem = () => {
    const data = {
      title,
      description,
      difficulty,
      solved,
      category
    };
    setLoading(true);
    axios
      .put(`${process.env.REACT_APP_BACKEND_URL}/update/${id}`, data)
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
      <h1 className='text-3xl my-4'>Edit Problem</h1>
      <div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto'>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Title</label>
          <input
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full h-40'
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2  w-full '
          >
            <option value="">Select Difficulty</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Solved</label>
          <select
            value={solved}
            onChange={(e) => setSolved(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2  w-full '
          >
            <option value="">Select Status</option>
            <option value="Solved">Solved</option>
            <option value="Unsolved">Unsolved</option>
          </select>
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2  w-full '
          >
            <option value="">Select Category</option>
            <option value="Basic">Basic</option>
            <option value="Arrays">Arrays</option>
            <option value="Strings">Strings</option>
            <option value="Linked Lists">Linked Lists</option>
            <option value="Stacks and Queues">Stacks and Queues</option>
            <option value="Dynamic Programming">Dynamic Programming</option>
            <option value="Trees">Trees</option>
            <option value="Graphs">Graphs</option>
          </select>
        </div>
        <button className='p-2 bg-sky-300 m-8' onClick={handleUpdateProblem}>
          Save
        </button>
      </div>
    </div>
  )
}

export default UpdateProblem
