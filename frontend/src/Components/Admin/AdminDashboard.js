// src/ProblemsPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import {MdOutlineAddBox, MdOutlineEdit, MdOutlineDelete, MdBookmarkAdd} from "react-icons/md";

const getDifficultyClass = (difficulty) => {
  switch (difficulty) {
    case "Easy":
      return "text-green-500";
    case "Medium":
      return "text-yellow-500";
    case "Hard":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
};

const AdminDashboard = () => {
  const [problems, setProblems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filterDifficulty, setFilterDifficulty] = useState("All");

  useEffect(() => {
    axios
      .get("http://localhost:5001/problems")
      .then((response) => {
        setProblems(response.data);
        console.log(problems);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const filteredProblems =
    selectedCategory === "All"
      ? problems
      : problems.filter((problem) => problem.category === selectedCategory);

  const filteredByDifficulty =
    filterDifficulty === "All"
      ? filteredProblems
      : filteredProblems.filter(
          (problem) => problem.difficulty === filterDifficulty
        );

  return (
    <div className="bg-gray-200 min-h-screen">
      <Navbar />
      <div className="flex">
        <Sidebar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        <div className="flex-1 ml-64 p-4">
          <div className="flex justify-between mb-4">
            <div className="flex space-x-4">
              <Link
                to="/adminDashboard/create"
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md flex items-center"
              >
                <MdOutlineAddBox className="mr-2" size={24} />
                Create Problem
              </Link>
              <select
                className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md"
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
              >
                <option value="All">Sort By</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {filteredByDifficulty.map((problem) => (
              <Link
                key={problem._id}
                to={`/problems/${problem._id}`}
                className="bg-white shadow-lg rounded-lg p-4 flex justify-between items-center transition-transform duration-200 transform hover:bg-gray-100"
              >
                <div>
                  <h2 className="text-xl font-bold mb-1">{problem.title}</h2>
                  <p
                    className={`text-sm ${getDifficultyClass(
                      problem.difficulty
                    )}`}
                  >
                    {problem.difficulty}
                  </p>
                </div>
                <div>
                  <div className="flex">
                    <Link
                      to={`/adminDashboard/update/${problem._id}`}
                      className="text-blue-500 hover:text-blue-600 mr-4"
                    >
                      <MdOutlineEdit size={30} />
                    </Link>
                    <Link
                      to={`/adminDashboard/delete/${problem._id}`}
                      className="text-red-500 hover:text-red-600 mr-4"
                    >
                      <MdOutlineDelete size={30} />
                    </Link>
                    <Link
                      to={`/adminDashboard/addTestcase/${problem._id}`}
                      className="text-blue-500 hover:text-blue-600 mr-4"
                    >
                      <MdBookmarkAdd size={30} />
                    </Link>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
