import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const AddTestcase = () => {
  const { problemId } = useParams();
  const [testcases, setTestcases] = useState([{ input: '', output: '' }]);
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTestcases = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/testcases/${problemId}`);
        if (response.data) {
          setTestcases(response.data.inputs.map((input, index) => ({ input, output: response.data.outputs[index] })));
          setIsUpdating(true);
        }
      } catch (error) {
        console.error('No test cases found, creating new ones');
      }
    };

    fetchTestcases();
  }, [problemId]);

  const handleAddTestcase = () => {
    setTestcases([...testcases, { input: '', output: '' }]);
  };

  const handleRemoveTestcase = (index) => {
    const newTestcases = testcases.filter((_, i) => i !== index);
    setTestcases(newTestcases);
  };

  const handleChange = (index, field, value) => {
    const newTestcases = [...testcases];
    newTestcases[index][field] = value;
    setTestcases(newTestcases);
  };

  const handleSave = async () => {
    const inputs = testcases.map(tc => tc.input);
    const outputs = testcases.map(tc => tc.output);

    try {
      if (isUpdating) {
        await axios.put(`${process.env.REACT_APP_BACKEND_URL}/testcases/${problemId}`, { inputs, outputs });
      } else {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/testcases`, { problemId, inputs, outputs });
      }
      navigate('/adminDashboard');
    } catch (error) {
      console.error('Error saving test cases', error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="border p-4 w-3/4 md:w-1/2 lg:w-1/3">
        <h2 className="text-center mb-4 text-xl">Add Test Cases</h2>
        <div className="overflow-y-auto h-96"> {/* Added container for scrolling */}
          {testcases.map((testcase, index) => (
            <div key={index} className="mb-4">
              <h3 className="mb-2">Test case {index + 1}</h3>
              <textarea
                className="w-full mb-2 p-2 border"
                placeholder="Input"
                value={testcase.input}
                onChange={(e) => handleChange(index, 'input', e.target.value)}
              />
              <textarea
                className="w-full mb-2 p-2 border"
                placeholder="Output"
                value={testcase.output}
                onChange={(e) => handleChange(index, 'output', e.target.value)}
              />
              <button
                className="bg-red-500 text-white px-4 py-2 mb-2"
                onClick={() => handleRemoveTestcase(index)}
              >
                Remove Test Case
              </button>
            </div>
          ))}
        </div>
        <button
          className="bg-black text-white px-4 py-2 mb-2 hover:bg-gray-700"
          onClick={handleAddTestcase}
        >
          Add Test Case
        </button>
        <button
          className="bg-blue-300 text-black px-4 py-2 hover:bg-blue-400"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default AddTestcase;
